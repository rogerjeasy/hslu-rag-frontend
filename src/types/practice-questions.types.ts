// types/practice-questions.types.ts

export type QuestionOptionType = {
    id: string;
    text: string;
    isCorrect: boolean;
  };
  
  export type BaseQuestionType = {
    id: string;
    text: string;
    type: QuestionTypeEnum;
    difficulty: DifficultyLevel;
    explanation: string;
    citations: number[];
  };
  
  export type MultipleChoiceQuestionType = BaseQuestionType & {
    type: QuestionTypeEnum.MULTIPLE_CHOICE;
    options: QuestionOptionType[];
  };
  
  export type ShortAnswerQuestionType = BaseQuestionType & {
    type: QuestionTypeEnum.SHORT_ANSWER;
    sampleAnswer: string;
  };
  
  export type TrueFalseQuestionType = BaseQuestionType & {
    type: QuestionTypeEnum.TRUE_FALSE;
    options: [QuestionOptionType, QuestionOptionType]; // Always has exactly 2 options
  };
  
  export type FillInBlankQuestionType = BaseQuestionType & {
    type: QuestionTypeEnum.FILL_IN_BLANK;
    blanks: string[]; // Array of correct answers for each blank
  };
  
  export type MatchingQuestionType = BaseQuestionType & {
    type: QuestionTypeEnum.MATCHING;
    pairs: Array<{
      left: string;
      right: string;
    }>;
  };
  
  export type QuestionType = 
    | MultipleChoiceQuestionType 
    | ShortAnswerQuestionType 
    | TrueFalseQuestionType
    | FillInBlankQuestionType
    | MatchingQuestionType;
  
  export enum QuestionTypeEnum {
    MULTIPLE_CHOICE = "multiple_choice",
    SHORT_ANSWER = "short_answer",
    TRUE_FALSE = "true_false",
    FILL_IN_BLANK = "fill_in_blank",
    MATCHING = "matching"
  }
  
  export enum DifficultyLevel {
    BASIC = "basic",
    MEDIUM = "medium",
    ADVANCED = "advanced"
  }
  
  export type PracticeQuestionsSetType = {
    id: string;
    topic: string;
    difficulty: DifficultyLevel;
    courseId?: string;
    moduleId?: string;
    createdAt: number;
    questionCount: number;
    answer: string;
    questions: QuestionType[];
    citations: number[];
    context?: ContextType[];
    meta?: Record<string, unknown>;
  };
  
  export type ContextType = {
    id: string;
    title: string;
    content: string;
    citationNumber: number;
    materialId?: string;
    sourceUrl?: string;
    sourcePage?: number | null;
    score?: number;
  };
  
  export type UserAnswer = {
    questionId: string;
    answer: string | string[] | { [key: string]: string }; // Different formats based on question type
    isCorrect?: boolean;
    timestamp: number;
  };
  
  export type PracticeSessionStats = {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    completionPercentage: number;
    averageTimePerQuestion: number; // in seconds
  };
  
  export type PracticeSessionState = {
    currentQuestionIndex: number;
    userAnswers: Record<string, UserAnswer>;
    startTime: number;
    endTime?: number;
    stats: PracticeSessionStats;
  };

/**
 * Represents a citation source for a question
 */
export interface Citation {
    title: string;
    content_preview: string;
    page_number?: number;
    materialId?: string;
    sourceUrl?: string;
    citationNumber: number;
  }
  
  /**
   * Represents the result of a question submission
   */
  export interface QuestionResult {
    is_correct: boolean;
    explanation?: string;
    requires_review?: boolean;
    correct_answer?: string | string[] | Record<string, string>;
  }

/**
 * Summary type used by QuestionSetCard component
 */
export interface QuestionSetSummary {
    id: string;
    title: string;
    description?: string;
    difficulty: DifficultyLevel;
    courseId: string;
    createdAt: number;
    questionCount: number;
    types: QuestionTypeEnum[];
  }


/**
 * Represents the result of a practice question submission
 */
export interface SubmissionResult {
    /**
     * Total number of questions in the set
     */
    total_questions: number;
    
    /**
     * Number of questions answered correctly
     */
    correct_answers: number;
    
    /**
     * Percentage score (0-100)
     */
    score_percentage: number | null;
    
    /**
     * Detailed results for each question
     */
    question_results: Array<{
      /**
       * Unique identifier for the question
       */
      question_id: string;
      
      /**
       * Whether the answer was correct
       */
      is_correct: boolean;
      
      /**
       * Whether the question needs manual review
       */
      requires_review?: boolean;
      
      /**
       * Explanation for the correct answer
       */
      explanation?: string;
    }>;
  }

// Add to types/practice-questions.types.ts

/**
 * Represents the raw response from the backend API for practice question sets
 */
export interface PracticeQuestionSetResponse {
    queryId: string;
    query: string;
    answer: string;
    context: Array<{
      id: string;
      title: string;
      content: string;
      citationNumber: number;
      materialId?: string;
      sourceUrl?: string;
      sourcePage?: number | null;
      score?: number;
    }>;
    citations: number[];
    promptType: string;
    timestamp: string;
    meta: {
      courseId: string | null;
      moduleId: string | null;
      topic: string;
      difficulty: DifficultyLevel;
      questionCount: number;
      questions: QuestionType[];
      documentId: string;
    };
  }
  
/**
 * Utility function to transform the backend response (PracticeQuestionSetResponse)
 * into a format with questions at the top level
 */
export function transformPracticeQuestionResponse(response: PracticeQuestionSetResponse): {
    id: string;
    topic: string;
    difficulty: DifficultyLevel;
    courseId?: string;
    moduleId?: string;
    createdAt: number;
    questionCount: number;
    questions: QuestionType[];
    answer: string;
    citations: number[];
    context?: ContextType[];
    meta?: Record<string, unknown>;
  } {
    
    // Validate required fields
    if (!response.meta) {
      console.error('Response missing meta field:', response);
      console.groupEnd();
      throw new Error('Invalid response format: missing meta field');
    }
    
    // Extract questions from meta and validate it's an array
    const questions = response.meta.questions || [];

    
    if (!Array.isArray(questions)) {
      console.error('Questions is not an array:', questions);
      console.groupEnd();
      throw new Error('Invalid question format: questions must be an array');
    }
    
    console.log(`Found ${questions.length} questions in the response`);
    
    // Show a sample question if available
    if (questions.length > 0) {
      console.log('Sample question structure:', Object.keys(questions[0]));
    }
    
    // Create the transformed object with all required fields
    const transformedData = {
      id: response.queryId || response.meta.documentId,
      topic: response.meta.topic || 'Unnamed Practice Set',
      difficulty: response.meta.difficulty,
      courseId: response.meta.courseId || undefined,
      moduleId: response.meta.moduleId || undefined,
      createdAt: new Date(response.timestamp).getTime(),
      questionCount: response.meta.questionCount || questions.length,
      // Make sure to include these essential fields!
      questions: questions,
      answer: response.answer || '',
      citations: response.citations || [],
      context: response.context || [],
      meta: {
        queryId: response.queryId,
        promptType: response.promptType,
        documentId: response.meta.documentId
      }
    };
    
    console.log('Transformed data structure:', Object.keys(transformedData));
    console.log('Transformed data has questions:', 
      Array.isArray(transformedData.questions) && transformedData.questions.length > 0);
    console.groupEnd();
    
    return transformedData;
  }


// Question option (for multiple choice, etc.)
export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionTypeEnum;
  difficulty: DifficultyLevel;
  explanation: string;
  citations: number[];
}