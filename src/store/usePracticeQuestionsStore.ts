import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  QuestionSet, 
  QuestionSetSummary, 
  CreatePracticeQuestionsRequest,
  // SubmitAnswersRequest,
  SubmissionResult,
  QuestionAnswer,
  DifficultyLevel,
  QuestionType
} from '@/types/practice-questions';
import { practiceQuestionsService } from '@/services/practiceQuestionsService';
import { ApiError, showErrorMessage } from '@/helpers/api';

// Define the error state interface for better typing
interface ErrorState {
  message: string;
  code: number;
  detail?: string;
}

interface PracticeQuestionsState {
  // List of question set summaries
  questionSets: QuestionSetSummary[];
  // Currently selected question set
  currentQuestionSet: QuestionSet | null;
  // User's answers for the current question set
  userAnswers: QuestionAnswer;
  // Submission results after submitting answers
  submissionResults: SubmissionResult | null;
  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  isCreating: boolean;
  // Error state with better typing
  error: ErrorState | null;
  // Filter states
  courseFilter: string | null;
  difficultyFilter: DifficultyLevel | null;
  typeFilter: QuestionType | null;
  // Action functions
  fetchQuestionSets: (courseId?: string) => Promise<void>;
  fetchQuestionSet: (questionSetId: string) => Promise<void>;
  createQuestionSet: (data: CreatePracticeQuestionsRequest) => Promise<string | null>;
  deleteQuestionSet: (questionSetId: string) => Promise<boolean>;
  updateQuestionSet: (questionSetId: string, data: { title?: string, description?: string }) => Promise<boolean>;
  submitAnswers: (questionSetId: string, answers: QuestionAnswer) => Promise<void>;
  setUserAnswer: (questionId: string, answer: string | boolean | string[]) => void;
  resetSubmission: () => void;
  setCourseFilter: (courseId: string | null) => void;
  setDifficultyFilter: (difficulty: DifficultyLevel | null) => void;
  setTypeFilter: (type: QuestionType | null) => void;
  clearFilters: () => void;
  clearError: () => void;
  // Helper for setting errors
  setError: (error: ApiError | null) => void;
}

// Create the store with persist middleware to save some data to localStorage
export const usePracticeQuestionsStore = create<PracticeQuestionsState>()(
  persist(
    (set, get) => ({
      // Initial state
      questionSets: [],
      currentQuestionSet: null,
      userAnswers: {},
      submissionResults: null,
      isLoading: false,
      isSubmitting: false,
      isCreating: false,
      error: null,
      courseFilter: null,
      difficultyFilter: null,
      typeFilter: null,

      // Enhanced error handler - now properly displays errors without throwing them
      setError: (error: ApiError | null) => {
        if (error === null) {
          set({ error: null });
          return;
        }
        
        // Set the error state for UI components to access
        set({ 
          error: {
            message: error.message,
            code: error.status,
            detail: error.detail
          }
        });
        
        // Display error message to user unless it's a 404 
        // since we handle those differently in the UI
        if (error.status !== 404) {
          showErrorMessage(error);
        }
      },

      // Actions
      fetchQuestionSets: async (courseId?: string) => {
        try {
          set({ isLoading: true, error: null });
          const result = await practiceQuestionsService.getQuestionSets(courseId);
          // Note: Now getQuestionSets will return an empty array for 404 errors
          // instead of throwing, so the rest of this code will execute normally
          set({ questionSets: result, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch question sets:', error);
          
          // Handle non-404 errors
          if (error instanceof ApiError) {
            get().setError(error);
          } else {
            get().setError(new ApiError(
              'An unexpected error occurred while fetching question sets',
              500, 
              error instanceof Error ? error.message : String(error)
            ));
          }
          
          // Always set loading to false, even on error
          set({ isLoading: false });
        }
      },

      fetchQuestionSet: async (questionSetId: string) => {
        try {
          set({ isLoading: true, error: null, userAnswers: {}, submissionResults: null });
          const result = await practiceQuestionsService.getQuestionSet(questionSetId);
          set({ currentQuestionSet: result, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch question set:', error);
          
          if (error instanceof ApiError) {
            // For 404, we'll just set the currentQuestionSet to null
            // and set an appropriate error message without showing a popup
            if (error.status === 404) {
              set({ 
                currentQuestionSet: null, 
                error: {
                  message: `Question set not found or no longer available`,
                  code: 404,
                  detail: error.detail || `The question set with ID ${questionSetId} could not be found`
                },
                isLoading: false 
              });
            } else {
              // For other errors, use the standard error handler
              get().setError(error);
            }
          } else {
            get().setError(new ApiError(
              'An unexpected error occurred while fetching the question set',
              500,
              error instanceof Error ? error.message : String(error)
            ));
          }
          
          set({ isLoading: false });
        }
      },

      createQuestionSet: async (data: CreatePracticeQuestionsRequest) => {
        try {
          set({ isCreating: true, error: null });
          const result = await practiceQuestionsService.createQuestionSet(data);
          
          // Refresh the question sets list
          await get().fetchQuestionSets(data.courseId);
          
          set({ isCreating: false });
          return result.id;
        } catch (error) {
          console.error('Failed to create question set:', error);
          
          if (error instanceof ApiError) {
            // For validation errors (422), provide more specific guidance
            if (error.status === 422) {
              get().setError(new ApiError(
                'Please check your question set configuration',
                422,
                error.detail || 'The server could not process your question configuration'
              ));
            } else {
              get().setError(error);
            }
          } else {
            get().setError(new ApiError(
              'Failed to create the question set',
              500,
              error instanceof Error ? error.message : String(error)
            ));
          }
          
          set({ isCreating: false });
          return null;
        }
      },

      deleteQuestionSet: async (questionSetId: string) => {
        try {
          set({ isLoading: true, error: null });
          // Service now handles 404 as success
          await practiceQuestionsService.deleteQuestionSet(questionSetId);
          
          // Update the list by removing the deleted question set
          const updatedSets = get().questionSets.filter(set => set.id !== questionSetId);
          set({ questionSets: updatedSets, isLoading: false });
          
          return true;
        } catch (error) {
          console.error('Failed to delete question set:', error);
          
          if (error instanceof ApiError) {
            get().setError(error);
          } else {
            get().setError(new ApiError(
              'Failed to delete the question set',
              500,
              error instanceof Error ? error.message : String(error)
            ));
          }
          
          set({ isLoading: false });
          return false;
        }
      },

      updateQuestionSet: async (questionSetId: string, data) => {
        try {
          set({ isLoading: true, error: null });
          const updatedSet = await practiceQuestionsService.updateQuestionSet(questionSetId, data);
          
          // Update both the current question set (if it's the one being edited)
          // and the list of question sets
          if (get().currentQuestionSet?.id === questionSetId) {
            set({ currentQuestionSet: updatedSet });
          }
          
          const updatedSets = get().questionSets.map(set => 
            set.id === questionSetId 
              ? { ...set, title: data.title || set.title, description: data.description || set.description }
              : set
          );
          
          set({ questionSets: updatedSets, isLoading: false });
          return true;
        } catch (error) {
          console.error('Failed to update question set:', error);
          
          if (error instanceof ApiError) {
            if (error.status === 404) {
              // Handle resource not found more gracefully
              set({ 
                error: {
                  message: 'Question set not found or no longer available',
                  code: 404,
                  detail: error.detail || `The question set with ID ${questionSetId} could not be found`
                },
                isLoading: false 
              });
              
              // If the current set is the one we tried to update, clear it
              if (get().currentQuestionSet?.id === questionSetId) {
                set({ currentQuestionSet: null });
              }
              
              // Remove from list if it's there
              const updatedSets = get().questionSets.filter(set => set.id !== questionSetId);
              if (updatedSets.length !== get().questionSets.length) {
                set({ questionSets: updatedSets });
              }
            } else {
              get().setError(error);
            }
          } else {
            get().setError(new ApiError(
              'Failed to update the question set',
              500,
              error instanceof Error ? error.message : String(error)
            ));
          }
          
          set({ isLoading: false });
          return false;
        }
      },

      submitAnswers: async (questionSetId: string, answers: QuestionAnswer) => {
        try {
          set({ isSubmitting: true, error: null });
          const results = await practiceQuestionsService.submitAnswers(questionSetId, { answers });
          set({ submissionResults: results, isSubmitting: false });
        } catch (error) {
          console.error('Failed to submit answers:', error);
          
          if (error instanceof ApiError) {
            if (error.status === 404) {
              // Handle resource not found specifically
              set({ 
                error: {
                  message: 'Question set no longer available',
                  code: 404,
                  detail: error.detail || `The question set you're trying to submit answers for could not be found`
                },
                isSubmitting: false 
              });
              
              // If the current set is the one we tried to submit for, clear it
              if (get().currentQuestionSet?.id === questionSetId) {
                set({ currentQuestionSet: null });
              }
            } else if (error.status === 400) {
              // Handle validation errors specifically
              get().setError(new ApiError(
                'Please complete all required questions',
                400,
                error.detail || 'Make sure all required questions are answered properly'
              ));
            } else {
              get().setError(error);
            }
          } else {
            get().setError(new ApiError(
              'Failed to submit your answers',
              500,
              error instanceof Error ? error.message : String(error)
            ));
          }
          
          set({ isSubmitting: false });
        }
      },

      setUserAnswer: (questionId: string, answer) => {
        set(state => ({
          userAnswers: {
            ...state.userAnswers,
            [questionId]: answer
          }
        }));
      },

      resetSubmission: () => {
        set({ userAnswers: {}, submissionResults: null });
      },

      setCourseFilter: (courseId) => {
        set({ courseFilter: courseId });
      },

      setDifficultyFilter: (difficulty) => {
        set({ difficultyFilter: difficulty });
      },

      setTypeFilter: (type) => {
        set({ typeFilter: type });
      },

      clearFilters: () => {
        set({ courseFilter: null, difficultyFilter: null, typeFilter: null });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'practice-questions-storage',
      partialize: (state) => ({ 
        // Only persist these fields
        courseFilter: state.courseFilter,
        difficultyFilter: state.difficultyFilter,
        typeFilter: state.typeFilter
      })
    }
  )
);