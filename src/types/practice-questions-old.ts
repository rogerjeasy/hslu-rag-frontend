/**
 * Types for practice questions in the HSLU RAG application
 */
import { Citation } from './query';

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

export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  explanation?: string;
  citations: Citation[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  options: MultipleChoiceOption[];
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: QuestionType.SHORT_ANSWER;
  sampleAnswer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: QuestionType.TRUE_FALSE;
  correctAnswer: boolean;
}

export interface FillInBlankQuestion extends BaseQuestion {
  type: QuestionType.FILL_IN_BLANK;
  blanks: string[];
}

export interface MatchingQuestion extends BaseQuestion {
  type: QuestionType.MATCHING;
  items: MatchingItem[];
}

export type Question =
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | TrueFalseQuestion
  | FillInBlankQuestion
  | MatchingQuestion;

// Define a type for question set metadata
export type QuestionSetMetadata = Record<string, unknown>;

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
  metadata?: QuestionSetMetadata;
}

export interface QuestionSetSummary {
  id: string;
  title: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  createdAt: string;
  updatedAt: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  types: QuestionType[];
}