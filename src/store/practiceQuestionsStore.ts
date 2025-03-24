// src/store/practiceQuestionsStore.ts
import { create } from 'zustand';
import { 
  QuestionSet,
  QuestionSetSummary,
  QuestionType,
  DifficultyLevel
} from '@/types/practice-questions-old';
import { practiceQuestionsService } from '@/services/practice.questions.service';

interface AnswerSubmission {
  [questionId: string]: string | boolean;
}

interface SubmissionResults {
  submission_id: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number | null;
  question_results: Array<{
    question_id: string;
    is_correct: boolean;
    correct_answer: string | boolean | null;
    explanation?: string;
    requires_review?: boolean;
  }>;
}

interface PracticeQuestionsState {
  // Data
  questionSets: QuestionSetSummary[];
  filteredQuestionSets: QuestionSetSummary[];
  currentQuestionSet: QuestionSet | null;
  currentSubmission: SubmissionResults | null;
  isLoading: boolean;
  error: string | null;
  
  // Filter state
  searchTerm: string;
  selectedCourse: string | null;
  selectedDifficulty: DifficultyLevel | null;
  selectedType: QuestionType | null;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
  setSelectedDifficulty: (difficulty: DifficultyLevel | null) => void;
  setSelectedType: (type: QuestionType | null) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  
  // Data actions
  fetchQuestionSets: (courseId?: string) => Promise<void>;
  getQuestionSet: (id: string) => Promise<QuestionSet>;
  createQuestionSet: (
    topic: string, 
    courseId: string, 
    questionCount?: number,
    difficulty?: DifficultyLevel,
    questionTypes?: QuestionType[],
    moduleId?: string, 
    topicId?: string
  ) => Promise<QuestionSet>;
  updateQuestionSet: (id: string, title?: string, description?: string) => Promise<QuestionSet>;
  deleteQuestionSet: (id: string) => Promise<void>;
  submitAnswers: (questionSetId: string, answers: AnswerSubmission) => Promise<SubmissionResults>;
  clearSubmission: () => void;
}

export const usePracticeQuestionsStore = create<PracticeQuestionsState>((set, get) => ({
  // Initial state
  questionSets: [],
  filteredQuestionSets: [],
  currentQuestionSet: null,
  currentSubmission: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedCourse: null,
  selectedDifficulty: null,
  selectedType: null,
  
  // Filter setters
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },
  
  setSelectedCourse: (courseId) => {
    set({ selectedCourse: courseId });
    get().applyFilters();
  },
  
  setSelectedDifficulty: (difficulty) => {
    set({ selectedDifficulty: difficulty });
    get().applyFilters();
  },
  
  setSelectedType: (type) => {
    set({ selectedType: type });
    get().applyFilters();
  },
  
  // Filter actions
  applyFilters: () => {
    const { 
      questionSets, 
      searchTerm, 
      selectedCourse, 
      selectedDifficulty, 
      selectedType 
    } = get();
    
    let result = [...questionSets];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        set => set.title.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply course filter (redundant if we're already fetching by course)
    if (selectedCourse) {
      result = result.filter(set => set.courseId === selectedCourse);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty) {
      result = result.filter(set => set.difficulty === selectedDifficulty);
    }
    
    // Apply question type filter
    if (selectedType) {
      result = result.filter(set => set.types.includes(selectedType));
    }
    
    set({ filteredQuestionSets: result });
  },
  
  resetFilters: () => {
    set({ 
      searchTerm: '',
      selectedCourse: null,
      selectedDifficulty: null,
      selectedType: null,
      filteredQuestionSets: get().questionSets
    });
  },
  
  // Data actions
  fetchQuestionSets: async (courseId) => {
    set({ isLoading: true, error: null });
    
    try {
      const questionSets = await practiceQuestionsService.getPracticeQuestionSets(courseId);
      set({ 
        questionSets, 
        filteredQuestionSets: questionSets, 
        isLoading: false,
        selectedCourse: courseId || null
      });
    } catch (error) {
      console.error('Error fetching practice question sets:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  getQuestionSet: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const questionSet = await practiceQuestionsService.getPracticeQuestionSet(id);
      set({ currentQuestionSet: questionSet, isLoading: false });
      return questionSet;
    } catch (error) {
      console.error('Error fetching practice question set:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  createQuestionSet: async (
    topic, 
    courseId, 
    questionCount = 5,
    difficulty = DifficultyLevel.MEDIUM,
    questionTypes = [QuestionType.MULTIPLE_CHOICE, QuestionType.SHORT_ANSWER],
    moduleId, 
    topicId
  ) => {
    set({ isLoading: true, error: null });
    
    try {
      const questionSet = await practiceQuestionsService.startPracticeQuestions(
        topic, courseId, questionCount, difficulty, questionTypes, moduleId, topicId
      );
      
      // Add the new question set to the list if we're already showing sets for this course
      if (get().selectedCourse === courseId || !get().selectedCourse) {
        set(state => {
          // Create a summary version for the list
          const questionSetSummary: QuestionSetSummary = {
            id: questionSet.id,
            title: questionSet.title,
            courseId: questionSet.courseId,
            moduleId: questionSet.moduleId,
            topicId: questionSet.topicId,
            createdAt: questionSet.createdAt,
            updatedAt: questionSet.updatedAt,
            difficulty: questionSet.difficulty,
            questionCount: questionSet.questions.length,
            types: [...new Set(questionSet.questions.map(q => q.type))]
          };
          
          const updatedQuestionSets = [...state.questionSets, questionSetSummary];
          
          return {
            questionSets: updatedQuestionSets,
            filteredQuestionSets: updatedQuestionSets,
            currentQuestionSet: questionSet,
            isLoading: false
          };
        });
        
        // Re-apply any filters
        get().applyFilters();
      } else {
        set({
          currentQuestionSet: questionSet,
          isLoading: false
        });
      }
      
      return questionSet;
    } catch (error) {
      console.error('Error creating practice question set:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateQuestionSet: async (id, title, description) => {
    set({ isLoading: true, error: null });
    
    try {
      const updateData: { title?: string; description?: string } = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      
      const updatedQuestionSet = await practiceQuestionsService.updatePracticeQuestionSet(id, updateData);
      
      set(state => {
        // Update the question set in the list
        const updatedQuestionSets = state.questionSets.map(set => 
          set.id === id 
            ? { 
                ...set, 
                title: updatedQuestionSet.title 
              } 
            : set
        );
        
        // Update current question set if it's the one being edited
        const currentQuestionSet = 
          state.currentQuestionSet && state.currentQuestionSet.id === id
            ? updatedQuestionSet
            : state.currentQuestionSet;
        
        return {
          questionSets: updatedQuestionSets,
          currentQuestionSet,
          isLoading: false
        };
      });
      
      // Re-apply filters
      get().applyFilters();
      
      return updatedQuestionSet;
    } catch (error) {
      console.error('Error updating practice question set:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteQuestionSet: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await practiceQuestionsService.deletePracticeQuestionSet(id);
      
      set(state => {
        const updatedQuestionSets = state.questionSets.filter(set => set.id !== id);
        
        // Clear current question set if it was the one deleted
        const currentQuestionSet = 
          state.currentQuestionSet && state.currentQuestionSet.id === id
            ? null
            : state.currentQuestionSet;
        
        return {
          questionSets: updatedQuestionSets,
          filteredQuestionSets: updatedQuestionSets,
          currentQuestionSet,
          isLoading: false
        };
      });
      
      // Re-apply filters
      get().applyFilters();
      
    } catch (error) {
      console.error('Error deleting practice question set:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  submitAnswers: async (questionSetId, answers) => {
    set({ isLoading: true, error: null });
    
    try {
      const results = await practiceQuestionsService.submitAnswers(questionSetId, answers);
      set({ 
        currentSubmission: results,
        isLoading: false 
      });
      return results;
    } catch (error) {
      console.error('Error submitting answers:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  clearSubmission: () => {
    set({ currentSubmission: null });
  }
}));