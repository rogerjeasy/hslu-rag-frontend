// Types for practice questions
export enum QuestionType {
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

export interface CitationSource {
  material_id: string;
  title: string;
  chunk_index: number;
  page_number?: number;
  content_preview: string;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface MatchingItem {
  id: string;
  leftText: string;
  rightText: string;
}

// Base interface for all question types
export interface QuestionBase {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  explanation?: string;
  citations: CitationSource[];
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: QuestionType.MULTIPLE_CHOICE;
  options: MultipleChoiceOption[];
}

export interface ShortAnswerQuestion extends QuestionBase {
  type: QuestionType.SHORT_ANSWER;
  sampleAnswer: string;
}

export interface TrueFalseQuestion extends QuestionBase {
  type: QuestionType.TRUE_FALSE;
  correctAnswer: boolean;
}

export interface FillInBlankQuestion extends QuestionBase {
  type: QuestionType.FILL_IN_BLANK;
  blanks: string[];
}

export interface MatchingQuestion extends QuestionBase {
  type: QuestionType.MATCHING;
  items: MatchingItem[];
}

export type Question =
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | TrueFalseQuestion
  | FillInBlankQuestion
  | MatchingQuestion;

export interface QuestionSet {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  difficulty: DifficultyLevel;
  questions: Question[];
  metadata?: Record<string, unknown>;
}

export interface QuestionSetSummary {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  createdAt: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  types: QuestionType[];
}

// For creating a new set of practice questions
export interface CreatePracticeQuestionsRequest {
  topic: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  modelId?: string;
  questionCount?: number;
  difficulty?: DifficultyLevel;
  questionTypes?: QuestionType[];
}

// Type for representing different possible answer types
export type AnswerType = string | boolean | string[];

// For submitting answers to practice questions
export interface QuestionAnswer {
  [questionId: string]: AnswerType; // Different types for different question types
}

export interface SubmitAnswersRequest {
  answers: QuestionAnswer;
}

export interface QuestionResult {
  question_id: string;
  is_correct: boolean;
  correct_answer: AnswerType;
  explanation: string;
  requires_review?: boolean;
}

export interface SubmissionResult {
  total_questions: number;
  correct_answers: number;
  question_results: QuestionResult[];
  score_percentage: number | null;
  submission_id: string;
}