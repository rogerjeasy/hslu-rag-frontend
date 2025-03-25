/**
 * Updated types for queries and responses in the HSLU RAG application
 */
export enum QueryType {
  QUESTION_ANSWERING = "question_answering",
  STUDY_GUIDE = "study_guide",
  PRACTICE_QUESTIONS = "practice_questions",
  KNOWLEDGE_GAP = "knowledge_gap"
}

export interface Citation {
  materialId: string;
  title: string;
  chunkIndex: number;
  pageNumber?: number;
  contentPreview: string;
  fileUrl?: string;
}

// Base interface for all parameter types
export interface BaseParams {
  temperature?: number;
  max_length?: number;
}

// Define specific types for additional parameters
export interface StudyGuideParams extends BaseParams {
  detail_level?: 'basic' | 'medium' | 'comprehensive';
  format?: 'outline' | 'notes' | 'flashcards' | 'mind_map' | 'summary';
  include_examples?: boolean;
}

export interface QuestionAnsweringParams extends BaseParams {
  include_citations?: boolean;
}

export interface PracticeQuestionsParams extends BaseParams {
  question_count?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  question_types?: string[];
  include_answers?: boolean;
}

export interface KnowledgeGapParams extends BaseParams {
  past_interactions_count?: number;
  detail_level?: 'basic' | 'medium' | 'detailed';
  include_study_plan?: boolean;
}

// Union type for all parameter types
export type AdditionalParams = 
  | StudyGuideParams 
  | QuestionAnsweringParams
  | PracticeQuestionsParams 
  | KnowledgeGapParams;

export interface QueryRequest {
  text: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  queryType: QueryType;
  conversationId?: string;
  modelId?: string;
  additionalParams?: AdditionalParams;
}

export interface QueryResponse {
  responseText: string;
  citations: Citation[];
  queryType: QueryType;
  conversationId: string;
  timestamp: string;
  additionalData?: AdditionalParams;
}

// Extended interfaces for specific query types
export interface StudyGuideQueryRequest extends QueryRequest {
  queryType: QueryType.STUDY_GUIDE;
  additionalParams: StudyGuideParams;
}

export interface QuestionAnsweringQueryRequest extends QueryRequest {
  queryType: QueryType.QUESTION_ANSWERING;
  additionalParams: QuestionAnsweringParams;
}

export interface PracticeQuestionsQueryRequest extends QueryRequest {
  queryType: QueryType.PRACTICE_QUESTIONS;
  additionalParams: PracticeQuestionsParams;
}

export interface KnowledgeGapQueryRequest extends QueryRequest {
  queryType: QueryType.KNOWLEDGE_GAP;
  additionalParams: KnowledgeGapParams;
}

// Type guard functions to help with type checking
export function isStudyGuideParams(params: AdditionalParams): params is StudyGuideParams {
  return (
    params.hasOwnProperty('detail_level') ||
    params.hasOwnProperty('format') ||
    params.hasOwnProperty('include_examples')
  );
}

export function isQuestionAnsweringParams(params: AdditionalParams): params is QuestionAnsweringParams {
  return params.hasOwnProperty('include_citations');
}

export function isPracticeQuestionsParams(params: AdditionalParams): params is PracticeQuestionsParams {
  return (
    params.hasOwnProperty('question_count') ||
    params.hasOwnProperty('difficulty') ||
    params.hasOwnProperty('question_types') ||
    params.hasOwnProperty('include_answers')
  );
}

export function isKnowledgeGapParams(params: AdditionalParams): params is KnowledgeGapParams {
  return (
    params.hasOwnProperty('past_interactions_count') ||
    params.hasOwnProperty('include_study_plan')
  );
}