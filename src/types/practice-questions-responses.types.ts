// types/practice-questions.types.ts

// Using string literals instead of enums for better compatibility with API responses
export type QuestionTypeEnum = 
  | 'multiple_choice'
  | 'short_answer'
  | 'true_false'
  | 'fill_in_blank'
  | 'matching';

export type DifficultyLevel = 
  | 'basic'
  | 'medium'
  | 'advanced';

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
  difficulty: string; // Changed to string to be more flexible
  explanation: string;
  citations: number[];
}

// Specific question types
export interface MultipleChoiceQuestionType extends BaseQuestionType {
  type: 'multiple_choice';
  options: QuestionOptionType[];
}

export interface ShortAnswerQuestionType extends BaseQuestionType {
  type: 'short_answer';
  sampleAnswer: string;
}

export interface TrueFalseQuestionType extends BaseQuestionType {
  type: 'true_false';
  options: QuestionOptionType[]; // Changed from fixed-length tuple to array
}

export interface FillInBlankQuestionType extends BaseQuestionType {
  type: 'fill_in_blank';
  blanks: string[]; // Array of correct answers for each blank
}

export interface MatchingQuestionType extends BaseQuestionType {
  type: 'matching';
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

// Practice question set type that will be used in the application
export interface PracticeQuestionsSetType {
  id: string;
  topic: string;
  difficulty: string; // Changed to string to accept any difficulty value
  courseId?: string;
  moduleId?: string;
  createdAt: number;
  questionCount: number;
  answer: string;
  questions: QuestionType[];
  citations: number[];
  context?: ContextType[];
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