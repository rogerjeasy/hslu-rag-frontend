// store/adapters/questionSetDetailAdapter.ts
import { create } from 'zustand';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { 
  DifficultyLevel, 
  QuestionType, 
  QuestionResult 
} from '@/types/practice-questions.types';

// Define the interface needed by QuestionSetDetail component
export interface ExtendedPracticeQuestionsStore {
  currentQuestionSet: {
    id: string;
    title: string;
    description?: string;
    difficulty: string;
    questions: QuestionType[];
  } | null;
  userAnswers: Record<string, any>;
  submissionResults?: {
    question_results: {
      question_id: string;
      is_correct: boolean;
      requires_review?: boolean;
    }[];
    correct_answers: number;
    score_percentage: number;
    total_questions: number;
  };
  fetchQuestionSet: (id: string) => Promise<void>;
  submitAnswers: (id: string, answers: Record<string, any>) => Promise<void>;
  resetSubmission: () => void;
  isLoading: boolean;
  isSubmitting: boolean;
  error: {
    code?: number;
    message: string;
    detail?: string;
  } | null;
}

// State for the adapter
interface AdapterState {
  userAnswers: Record<string, any>;
  submissionResults?: {
    question_results: {
      question_id: string;
      is_correct: boolean;
      requires_review?: boolean;
    }[];
    correct_answers: number;
    score_percentage: number;
    total_questions: number;
  };
  isSubmitting: boolean;
  error: {
    code?: number;
    message: string;
    detail?: string;
  } | null;
}

// Create a local store for the adapter
const useAdapterStore = create<AdapterState>()((set) => ({
  userAnswers: {},
  submissionResults: undefined,
  isSubmitting: false,
  error: null
}));

/**
 * Custom hook that adapts the practice questions store to the format expected by QuestionSetDetail
 */
export function useQuestionSetDetailAdapter(): ExtendedPracticeQuestionsStore {
  // Get the original store
  const practiceStore = usePracticeQuestionsStore();
  
  // Get the adapter store
  const adapterStore = useAdapterStore();
  
  // Adapt the currentSet to currentQuestionSet format
  const currentQuestionSet = practiceStore.currentSet ? {
    id: practiceStore.currentSet.id,
    title: practiceStore.currentSet.topic,
    description: practiceStore.currentSet.meta?.description as string | undefined,
    difficulty: practiceStore.currentSet.difficulty,
    questions: practiceStore.currentSet.questions
  } : null;
  
  // Implement the fetchQuestionSet method
  const fetchQuestionSet = async (id: string): Promise<void> => {
    try {
      // Clear previous adapter state
      useAdapterStore.setState({
        userAnswers: {},
        submissionResults: undefined,
        error: null
      });
      
      // Call the original store method
      await practiceStore.fetchQuestionSetById(id);
      
      // If we have a valid question set, initialize session
      if (practiceStore.currentSet) {
        // Map existing user answers from session if available
        if (practiceStore.session?.userAnswers) {
          useAdapterStore.setState({
            userAnswers: Object.entries(practiceStore.session.userAnswers).reduce((acc, [key, val]) => {
              acc[key] = val.answer;
              return acc;
            }, {} as Record<string, any>)
          });
        }
      }
    } catch (error) {
      // Handle error
      useAdapterStore.setState({
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch question set',
          detail: error instanceof Error ? error.stack : 'Unknown error'
        }
      });
    }
  };
  
  // Implement the submitAnswers method
  const submitAnswers = async (id: string, answers: Record<string, any>): Promise<void> => {
    try {
      useAdapterStore.setState({ isSubmitting: true });
      
      // Store user answers in adapter
      useAdapterStore.setState({ userAnswers: answers });
      
      // Process answers with the existing store
      // We don't have direct access to submitAnswers in your store,
      // so we'll simulate the submission logic
      
      if (practiceStore.currentSet) {
        // Process each answer and calculate results
        const questionResults = practiceStore.currentSet.questions.map(question => {
          const userAnswer = answers[question.id];
          let isCorrect = false;
          
          // Determine if answer is correct based on question type
          switch (question.type) {
            case 'multiple_choice':
            case 'true_false':
              if (typeof userAnswer === 'string') {
                const selectedOption = question.options.find(opt => opt.id === userAnswer);
                isCorrect = selectedOption?.isCorrect || false;
              }
              break;
              
            case 'short_answer':
              // For short answer, we mark as needing review
              isCorrect = false; // Will be marked as requiring review
              break;
              
            case 'fill_in_blank':
              if (Array.isArray(userAnswer) && userAnswer.length === question.blanks.length) {
                isCorrect = question.blanks.every((blank, i) => 
                  blank.toLowerCase() === (userAnswer[i] as string).toLowerCase()
                );
              }
              break;
              
            case 'matching':
              if (typeof userAnswer === 'object' && !Array.isArray(userAnswer)) {
                const answerObj = userAnswer as Record<string, string>;
                isCorrect = question.pairs.every(pair => 
                  answerObj[pair.left] === pair.right
                );
              }
              break;
          }
          
          return {
            question_id: question.id,
            is_correct: isCorrect,
            requires_review: question.type === 'short_answer'
          };
        });
        
        // Calculate overall results
        const correctAnswers = questionResults.filter(r => r.is_correct).length;
        const totalQuestions = questionResults.length;
        const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Set submission results
        useAdapterStore.setState({
          submissionResults: {
            question_results: questionResults,
            correct_answers: correctAnswers,
            score_percentage: scorePercentage,
            total_questions: totalQuestions
          },
          isSubmitting: false
        });
        
        // If store has a session, end it
        if (practiceStore.session) {
          practiceStore.endSession();
        }
      }
    } catch (error) {
      useAdapterStore.setState({
        error: {
          message: error instanceof Error ? error.message : 'Failed to submit answers',
          detail: error instanceof Error ? error.stack : 'Unknown error'
        },
        isSubmitting: false
      });
    }
  };
  
  // Implement the resetSubmission method
  const resetSubmission = (): void => {
    // Reset the adapter store
    useAdapterStore.setState({
      userAnswers: {},
      submissionResults: undefined,
      isSubmitting: false,
      error: null
    });
    
    // Reset session in original store if available
    if (practiceStore.resetSession) {
      practiceStore.resetSession();
    }
    
    // If we have a current set, start a new session
    if (practiceStore.currentSet && practiceStore.startSession) {
      practiceStore.startSession(practiceStore.currentSet.id);
    }
  };
  
  // Map error from original store
  const error = practiceStore.error ? {
    message: typeof practiceStore.error === 'string' 
      ? practiceStore.error 
      : 'An error occurred',
    detail: typeof practiceStore.error === 'string'
      ? practiceStore.error
      : JSON.stringify(practiceStore.error)
  } : adapterStore.error;
  
  // Return the adapted interface
  return {
    currentQuestionSet,
    userAnswers: adapterStore.userAnswers,
    submissionResults: adapterStore.submissionResults,
    fetchQuestionSet,
    submitAnswers,
    resetSubmission,
    isLoading: practiceStore.isLoading,
    isSubmitting: adapterStore.isSubmitting,
    error
  };
}