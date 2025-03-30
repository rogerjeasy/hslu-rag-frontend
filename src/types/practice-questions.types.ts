// types/practice-questions.types.ts

// Existing enums and basic types
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
  
  // Context type for source materials
  export interface ContextType {
    id: string;
    title: string;
    content: string;
    citationNumber: number;
    materialId?: string;
    sourceUrl?: string;
    sourcePage?: number | null;
    score?: number;
  }
  
  // Question option types
  export interface QuestionOptionType {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  // Base question type that all question types extend
  export interface BaseQuestionType {
    id: string;
    text: string;
    type: QuestionTypeEnum;
    difficulty: DifficultyLevel;
    explanation: string;
    citations: number[];
  }
  
  // Specific question types
  export interface MultipleChoiceQuestionType extends BaseQuestionType {
    type: QuestionTypeEnum.MULTIPLE_CHOICE;
    options: QuestionOptionType[];
  }
  
  export interface ShortAnswerQuestionType extends BaseQuestionType {
    type: QuestionTypeEnum.SHORT_ANSWER;
    sampleAnswer: string;
  }
  
  export interface TrueFalseQuestionType extends BaseQuestionType {
    type: QuestionTypeEnum.TRUE_FALSE;
    options: [QuestionOptionType, QuestionOptionType]; // Always has exactly 2 options
  }
  
  export interface FillInBlankQuestionType extends BaseQuestionType {
    type: QuestionTypeEnum.FILL_IN_BLANK;
    blanks: string[]; // Array of correct answers for each blank
  }
  
  export interface MatchingQuestionType extends BaseQuestionType {
    type: QuestionTypeEnum.MATCHING;
    pairs: Array<{
      left: string;
      right: string;
    }>;
  }
  
  // Union type for all question types
  export type QuestionType = 
    | MultipleChoiceQuestionType 
    | ShortAnswerQuestionType 
    | TrueFalseQuestionType
    | FillInBlankQuestionType
    | MatchingQuestionType;
  
  // Response from the API
  export interface PracticeQuestionSetResponse {
    queryId: string;
    query: string;
    answer: string;
    context: ContextType[];
    citations: number[];
    promptType: string;
    timestamp: string;
    meta: PracticeQuestionMetaType;
  }
  
  // Meta data generalized to handle all question forms
  export interface PracticeQuestionMetaType {
    courseId: string | null;
    moduleId: string | null;
    topic: string;
    difficulty: DifficultyLevel;
    questionCount: number;
    questions: QuestionType[];
    documentId: string;
    [key: string]: unknown; // For extensibility while preserving type safety
  }
  
  // Practice question set type that will be used in the application
  export interface PracticeQuestionsSetType {
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
  }
  
  // User answer tracking
  export interface UserAnswer {
    questionId: string;
    answer: string | string[] | Record<string, string>; // Different formats based on question type
    isCorrect?: boolean;
    timestamp: number;
  }
  
  // Practice session statistics
  export interface PracticeSessionStats {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    completionPercentage: number;
    averageTimePerQuestion: number; // in seconds
  }
  
  // Practice session state
  export interface PracticeSessionState {
    currentQuestionIndex: number;
    userAnswers: Record<string, UserAnswer>;
    startTime: number;
    endTime?: number;
    stats: PracticeSessionStats;
  }
  
  // Citation interface
  export interface Citation {
    title: string;
    content_preview: string;
    page_number?: number;
    materialId?: string;
    sourceUrl?: string;
    citationNumber: number;
  }
  
  // Question result interface
  export interface QuestionResult {
    is_correct: boolean;
    explanation?: string;
    requires_review?: boolean;
    correct_answer?: string | string[] | Record<string, string>;
  }
  
  // Summary type for QuestionSetCard component
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
  
  // Submission result interface
  export interface SubmissionResult {
    total_questions: number;
    correct_answers: number;
    score_percentage: number | null;
    question_results: Array<{
      question_id: string;
      is_correct: boolean;
      requires_review?: boolean;
      explanation?: string;
    }>;
  }


  export interface PracticeQuestionsSetType {
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
  }
  
  /**
   * Utility function to transform the backend response (PracticeQuestionSetResponse)
   * into a format with questions at the top level
   */
  export function transformPracticeQuestionResponse(response: PracticeQuestionSetResponse): PracticeQuestionsSetType {
    // Validate required fields
    if (!response.meta) {
      throw new Error('Invalid response format: missing meta field');
    }
    
    // Extract questions from meta and validate it's an array
    const questions = response.meta.questions || [];
    
    if (!Array.isArray(questions)) {
      throw new Error('Invalid question format: questions must be an array');
    }
    
    // Create the transformed object with all required fields
    return {
      id: response.queryId || response.meta.documentId,
      topic: response.meta.topic || 'Unnamed Practice Set',
      difficulty: response.meta.difficulty,
      courseId: response.meta.courseId || undefined,
      moduleId: response.meta.moduleId || undefined,
      createdAt: new Date(response.timestamp).getTime(),
      questionCount: response.meta.questionCount || questions.length,
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
  }