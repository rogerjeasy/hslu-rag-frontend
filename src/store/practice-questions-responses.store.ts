// store/practice-questions-responses.store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  PracticeQuestionsSetType,
  UserAnswer,
  PracticeSessionState,
  PracticeSessionStats,
} from '@/types/practice-questions-responses.types'; // Updated import path
import { practiceQuestionsService } from '@/services/practice-questions-responses.service';

interface PracticeQuestionsStore {
  // Current practice question set
  currentSet: PracticeQuestionsSetType | null;
  isLoading: boolean;
  error: string | null;
  
  // Session state
  session: PracticeSessionState | null;
  
  // Actions
  fetchPracticeQuestionSet: (id: string) => Promise<void>;
  startSession: () => void;
  answerQuestion: (questionId: string, answer: string | string[] | Record<string, string>) => void;
  moveToQuestion: (index: number) => void;
  checkAnswer: (questionId: string) => boolean | null;
  finishSession: () => void;
  resetSession: () => void;
}

// Initial state for session statistics
const createInitialStats = (): PracticeSessionStats => ({
  totalQuestions: 0,
  answeredQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  skippedQuestions: 0,
  completionPercentage: 0,
  averageTimePerQuestion: 0,
});

export const usePracticeQuestionsStore = create<PracticeQuestionsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentSet: null,
        isLoading: false,
        error: null,
        session: null,

        // Fetch practice question set by ID
        fetchPracticeQuestionSet: async (id: string) => {
          console.log(`Starting fetch for practice question set with ID: ${id}`);
          set({ isLoading: true, error: null });
          try {
            const practiceSet = await practiceQuestionsService.getPracticeQuestionSet(id);
            console.log("Received practice set data:", practiceSet);
            
            if (!practiceSet) {
              throw new Error("Practice set is null or undefined");
            }
            
            if (!practiceSet.questions || !Array.isArray(practiceSet.questions)) {
              console.error("Invalid questions data structure:", practiceSet.questions);
              throw new Error("Questions data is missing or not in expected format");
            }
            
            if (practiceSet.questions.length === 0) {
              console.warn("Practice set has no questions");
            }
            
            set({ currentSet: practiceSet, isLoading: false });
            console.log("Practice set data successfully set to store");
          } catch (error) {
            console.error("Error fetching practice questions:", error);
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch practice questions', 
              isLoading: false 
            });
          }
        },

        // Start a new practice session
        startSession: () => {
          console.log("Starting new practice session");
          const { currentSet } = get();
          console.log("Current set data available for session:", currentSet);
          
          if (!currentSet) {
            console.error("Cannot start session - currentSet is not available");
            return;
          }
          
          if (!currentSet.questions) {
            console.error("Cannot start session - questions array is missing");
            return;
          }
          
          if (!Array.isArray(currentSet.questions)) {
            console.error("Cannot start session - questions is not an array:", typeof currentSet.questions);
            return;
          }
          
          if (currentSet.questions.length === 0) {
            console.error("Cannot start session - questions array is empty");
            return;
          }
          
          console.log(`Creating session with ${currentSet.questions.length} questions`);
          
          const newSession: PracticeSessionState = {
            currentQuestionIndex: 0,
            userAnswers: {},
            startTime: Date.now(),
            stats: {
              ...createInitialStats(),
              totalQuestions: currentSet.questions.length,
            }
          };
          
          console.log("New session created:", newSession);
          set({ session: newSession });
        },

        // Record user's answer to a question
        answerQuestion: (questionId: string, answer: string | string[] | Record<string, string>) => {
          const { session, currentSet } = get();
          if (!session || !currentSet || !currentSet.questions) return;

          // Create new answer object
          const userAnswer: UserAnswer = {
            questionId,
            answer,
            timestamp: Date.now(),
          };

          // Find the question to determine correctness
          const question = currentSet.questions.find(q => q.id === questionId);
          if (!question) return;

          // Update session with new answer
          const updatedUserAnswers = {
            ...session.userAnswers,
            [questionId]: userAnswer,
          };

          // Update stats
          const stats = { ...session.stats };
          
          // If this is a new answer (not overwriting)
          if (!session.userAnswers[questionId]) {
            stats.answeredQuestions += 1;
            stats.completionPercentage = (stats.answeredQuestions / stats.totalQuestions) * 100;
          }

          set({
            session: {
              ...session,
              userAnswers: updatedUserAnswers,
              stats,
            }
          });
        },

        // Move to a specific question by index
        moveToQuestion: (index: number) => {
          const { session, currentSet } = get();
          if (!session || !currentSet || !currentSet.questions) return;

          // Ensure index is within bounds
          const safeIndex = Math.max(0, Math.min(currentSet.questions.length - 1, index));
          
          set({
            session: {
              ...session,
              currentQuestionIndex: safeIndex,
            }
          });
        },

        // Check if the current answer for a question is correct
        checkAnswer: (questionId: string) => {
          const { session, currentSet } = get();
          if (!session || !currentSet || !currentSet.questions || !session.userAnswers[questionId]) return null;

          const userAnswer = session.userAnswers[questionId];
          const question = currentSet.questions.find(q => q.id === questionId);
          
          if (!question) return null;

          // Basic checking logic based on question type
          let isCorrect = false;
          
          if (question.type === 'multiple_choice' || question.type === 'true_false') {
            const correctOption = (question.options as Array<{id: string, isCorrect: boolean}>).find(o => o.isCorrect);
            isCorrect = correctOption ? userAnswer.answer === correctOption.id : false;
          } else {
            // For other types, we'll assume it's correct for demo
            isCorrect = true;
          }
          
          // Update the user answer with correctness
          const updatedUserAnswers = {
            ...session.userAnswers,
            [questionId]: {
              ...userAnswer,
              isCorrect,
            },
          };

          // Update stats
          const stats = { ...session.stats };
          
          // Only update correct/incorrect counts if not already checked
          if (userAnswer.isCorrect === undefined) {
            if (isCorrect) {
              stats.correctAnswers += 1;
            } else {
              stats.incorrectAnswers += 1;
            }
          }

          set({
            session: {
              ...session,
              userAnswers: updatedUserAnswers,
              stats,
            }
          });

          return isCorrect;
        },

        // Finish the current session
        finishSession: () => {
          const { session } = get();
          if (!session) return;

          const endTime = Date.now();
          const sessionDuration = endTime - session.startTime;
          
          // Calculate average time per answered question
          const averageTimePerQuestion = session.stats.answeredQuestions > 0
            ? sessionDuration / session.stats.answeredQuestions / 1000 // Convert to seconds
            : 0;

          // Update stats with time metrics
          const updatedStats = {
            ...session.stats,
            averageTimePerQuestion,
            // Mark unanswered questions as skipped
            skippedQuestions: session.stats.totalQuestions - session.stats.answeredQuestions,
          };

          set({
            session: {
              ...session,
              endTime,
              stats: updatedStats,
            }
          });
        },

        // Reset the current session
        resetSession: () => {
          set({ session: null });
        },
      }),
      {
        name: 'practice-questions-storage',
        // Only persist these keys
        partialize: (state) => ({
          currentSet: state.currentSet,
          session: state.session,
        }),
      }
    )
  )
);