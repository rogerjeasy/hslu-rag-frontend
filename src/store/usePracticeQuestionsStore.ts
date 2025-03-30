// store/usePracticeQuestionsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { practiceQuestionsService } from '@/services/practiceQuestionsService';
import { 
  PracticeQuestionsSetType, 
  UserAnswer, 
  PracticeSessionState, 
  PracticeSessionStats,
  QuestionType,
  DifficultyLevel,
  QuestionTypeEnum
} from '@/types/practice-questions.types';

// Added active filters tracking
interface ActiveFilters {
  searchTerm: string;
  courseId?: string;
  difficulty?: DifficultyLevel | null;
  type?: QuestionTypeEnum | null;
}

interface PracticeQuestionsState {
  // Question sets data
  questionSets: PracticeQuestionsSetType[];
  filteredSets: PracticeQuestionsSetType[];
  currentSet: PracticeQuestionsSetType | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  
  // Added active filters state
  activeFilters: ActiveFilters;
  
  // Practice session state
  session: PracticeSessionState | null;
  
  // Actions
  fetchQuestionSets: (courseId?: string) => Promise<void>;
  fetchQuestionSetById: (id: string) => Promise<void>;
  filterQuestionSets: (searchTerm: string, courseId?: string, difficulty?: DifficultyLevel | null, type?: QuestionTypeEnum | null) => void;
  resetFilters: () => void;
  clearError: () => void;
  createQuestionSet: (params: {
    topic: string;
    courseId: string;
    moduleId?: string;
    questionCount: number;
    difficulty: string;
    questionTypes: QuestionType[];
  }) => Promise<string>;
  
  // Session actions
  startSession: (setId: string) => void;
  endSession: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  submitAnswer: (questionId: string, answer: UserAnswer['answer']) => void;
  resetSession: () => void;
}

const initialSessionStats: PracticeSessionStats = {
  totalQuestions: 0,
  answeredQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  skippedQuestions: 0,
  completionPercentage: 0,
  averageTimePerQuestion: 0
};

const initialActiveFilters: ActiveFilters = {
  searchTerm: '',
  courseId: undefined,
  difficulty: null,
  type: null
};

export const usePracticeQuestionsStore = create<PracticeQuestionsState>()(
  persist(
    (set, get) => ({
      // State
      questionSets: [],
      filteredSets: [],
      currentSet: null,
      isLoading: false,
      isCreating: false,
      error: null,
      activeFilters: initialActiveFilters,
      session: null,
      
      // API actions
      fetchQuestionSets: async (courseId?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Use the correct method from the service
          const result = await practiceQuestionsService.fetchPracticeQuestionSets();
          
          // Filter by courseId if provided
          const filteredResult = courseId 
            ? result.filter(set => set.courseId === courseId)
            : result;
            
          // Update activeFilters if courseId is provided
          const activeFilters = courseId 
            ? { ...get().activeFilters, courseId } 
            : get().activeFilters;
            
          set({ 
            questionSets: result, 
            filteredSets: filteredResult,
            activeFilters,
            isLoading: false 
          });
        } catch (error) {
          console.error('Error fetching question sets:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false 
          });
        }
      },
      
      fetchQuestionSetById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Check if we already have this set in state
          const existingSet = get().questionSets.find(set => set.id === id);
          if (existingSet) {
            set({ currentSet: existingSet, isLoading: false });
            return;
          }
          
          // Use the correct method from the service
          const data = await practiceQuestionsService.fetchPracticeQuestionSet(id);
          set({ currentSet: data, isLoading: false });
        } catch (error) {
          console.error(`Error fetching question set ${id}:`, error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false 
          });
        }
      },
      
      filterQuestionSets: (searchTerm: string, courseId?: string, difficulty?: DifficultyLevel | null, type?: QuestionTypeEnum | null) => {
        const { questionSets, activeFilters } = get();
        
        // Skip if filters haven't changed
        if (
          activeFilters.searchTerm === searchTerm &&
          activeFilters.courseId === courseId &&
          activeFilters.difficulty === difficulty &&
          activeFilters.type === type
        ) {
          return;
        }
        
        let filtered = [...questionSets];
        
        // Filter by search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(set => 
            set.topic.toLowerCase().includes(term)
          );
        }
        
        // Filter by course
        if (courseId) {
          filtered = filtered.filter(set => set.courseId === courseId);
        }
        
        // Filter by difficulty
        if (difficulty) {
          filtered = filtered.filter(set => set.difficulty === difficulty);
        }
        
        // Filter by question type
        if (type) {
          filtered = filtered.filter(set => 
            set.questions && set.questions.some(q => q.type === type)
          );
        }
        
        set({ 
          filteredSets: filtered,
          activeFilters: {
            searchTerm,
            courseId,
            difficulty,
            type
          }
        });
      },
      
      resetFilters: () => {
        set({ 
          filteredSets: get().questionSets,
          activeFilters: initialActiveFilters
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      createQuestionSet: async (params) => {
        set({ isCreating: true, error: null });
        
        try {
          // Transform the params to match the service expectations
          const serviceParams = {
            topic: params.topic,
            courseId: params.courseId,
            moduleId: params.moduleId,
            questionCount: params.questionCount,
            difficulty: params.difficulty,
            questionTypes: params.questionTypes.map(type => type.toString())
          };
          
          const result = await practiceQuestionsService.generatePracticeQuestions(serviceParams);
          
          // Update the questionSets state with the new set
          set(state => ({
            questionSets: [...state.questionSets, result],
            filteredSets: [...state.filteredSets, result],
            currentSet: result,
            isCreating: false
          }));
          
          return result.id;
        } catch (error) {
          console.error('Error creating question set:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create practice questions',
            isCreating: false 
          });
          throw error;
        }
      },
      
      // Session management
      startSession: (setId: string) => {
        // Don't create a new session if one already exists for this set
        if (get().session && get().currentSet?.id === setId) {
          return;
        }
        
        const questionSet = get().questionSets.find(set => set.id === setId) || 
                          get().currentSet;
        
        if (!questionSet) {
          set({ error: 'Question set not found' });
          return;
        }
        
        // Add additional check for questions array
        if (!questionSet.questions || !Array.isArray(questionSet.questions)) {
          set({ error: 'Question set contains no questions or invalid data' });
          return;
        }
        
        const newSession = {
          currentQuestionIndex: 0,
          userAnswers: {},
          startTime: Date.now(),
          stats: {
            ...initialSessionStats,
            totalQuestions: questionSet.questions.length
          }
        };
        
        set({ 
          session: newSession,
          currentSet: questionSet,
          error: null // Clear any previous errors
        });
      },
      
      endSession: () => {
        const { session } = get();
        if (session) {
          set({
            session: {
              ...session,
              endTime: Date.now()
            }
          });
        }
      },
      
      nextQuestion: () => {
        const { session, currentSet } = get();
        if (!session || !currentSet) return;
        
        const totalQuestions = currentSet.questions.length;
        const nextIndex = Math.min(session.currentQuestionIndex + 1, totalQuestions - 1);
        
        set({
          session: {
            ...session,
            currentQuestionIndex: nextIndex
          }
        });
      },
      
      previousQuestion: () => {
        const { session } = get();
        if (!session) return;
        
        const prevIndex = Math.max(session.currentQuestionIndex - 1, 0);
        
        set({
          session: {
            ...session,
            currentQuestionIndex: prevIndex
          }
        });
      },
      
      jumpToQuestion: (index: number) => {
        const { session, currentSet } = get();
        if (!session || !currentSet) return;
        
        const totalQuestions = currentSet.questions.length;
        if (index < 0 || index >= totalQuestions) return;
        
        set({
          session: {
            ...session,
            currentQuestionIndex: index
          }
        });
      },
      
      submitAnswer: (questionId: string, answer: UserAnswer['answer']) => {
        const { session, currentSet } = get();
        if (!session || !currentSet) return;
        
        const question = currentSet.questions.find(q => q.id === questionId);
        if (!question) return;
        
        // Changed from boolean to boolean | undefined to match UserAnswer.isCorrect type
        let isCorrect: boolean | undefined = false;
        
        // Check if answer is correct based on question type
        switch (question.type) {
          case 'multiple_choice':
          case 'true_false':
            // For multiple choice, check if selected option is the correct one
            if (typeof answer === 'string') {
              const selectedOption = question.options.find(opt => opt.id === answer);
              isCorrect = selectedOption?.isCorrect || false;
            }
            break;
            
          case 'short_answer':
            // For short answer, we can't automatically grade - leave as undefined
            isCorrect = undefined;
            break;
            
          case 'fill_in_blank':
            // For fill in blank, check if all answers match
            if (Array.isArray(answer) && answer.length === question.blanks.length) {
              isCorrect = question.blanks.every((blank, i) => 
                blank.toLowerCase() === (answer[i] as string).toLowerCase()
              );
            }
            break;
            
          case 'matching':
            // For matching, check if all pairs match
            if (typeof answer === 'object' && !Array.isArray(answer)) {
              const answerObj = answer as Record<string, string>;
              const allMatched = question.pairs.every(pair => 
                answerObj[pair.left] === pair.right
              );
              isCorrect = allMatched;
            }
            break;
        }
        
        // Update user answers
        const userAnswers = {
          ...session.userAnswers,
          [questionId]: {
            questionId,
            answer,
            isCorrect,
            timestamp: Date.now()
          }
        };
        
        // Update stats
        const answeredQuestions = Object.keys(userAnswers).length;
        // Only count answers where isCorrect is explicitly true
        const correctAnswers = Object.values(userAnswers)
          .filter(a => a.isCorrect === true).length;
        // Only count answers where isCorrect is explicitly false
        const incorrectAnswers = Object.values(userAnswers)
          .filter(a => a.isCorrect === false).length;
        
        const totalTimeSpent = Date.now() - session.startTime;
        const averageTimePerQuestion = answeredQuestions > 0 
          ? totalTimeSpent / (answeredQuestions * 1000) // convert to seconds
          : 0;
        
        const stats: PracticeSessionStats = {
          totalQuestions: currentSet.questions.length,
          answeredQuestions,
          correctAnswers,
          incorrectAnswers,
          skippedQuestions: currentSet.questions.length - answeredQuestions,
          completionPercentage: (answeredQuestions / currentSet.questions.length) * 100,
          averageTimePerQuestion
        };
        
        set({
          session: {
            ...session,
            userAnswers,
            stats
          }
        });
        
        // Automatically move to next question
        get().nextQuestion();
      },
      
      // In the store's resetSession function:
      resetSession: () => {
        // Check if there's an active session before resetting
        const currentState = get();
        if (!currentState.session) return;
        
        try {
          // Use a more targeted update that only affects the session
          set((state) => ({
            ...state,
            session: null,
            // Don't modify other properties of the state
          }));
        } catch (error) {
          console.error('Error resetting session:', error);
        }
      }
    }),
    {
      name: 'practice-questions-storage',
      partialize: (state) => ({
        questionSets: state.questionSets,
        currentSet: state.currentSet
      })
    }
  )
);