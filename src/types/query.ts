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

// Define specific types for additional parameters
export type StudyGuideParams = {
  detailLevel?: 'basic' | 'medium' | 'comprehensive';
  format?: 'outline' | 'notes' | 'flashcards' | 'mind_map' | 'summary';
  includePracticeQuestions?: boolean;
};

export type PracticeQuestionsParams = {
  questionCount?: number;
  difficulty?: 'basic' | 'medium' | 'advanced';
  questionTypes?: string[];
};

export type KnowledgeGapParams = {
  pastInteractionsCount?: number;
  includeSuggestions?: boolean;
};

// Union type for all parameter types
export type AdditionalParams = StudyGuideParams | PracticeQuestionsParams | KnowledgeGapParams | Record<string, unknown>;

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
  return (params as StudyGuideParams).detailLevel !== undefined || 
         (params as StudyGuideParams).format !== undefined;
}

export function isPracticeQuestionsParams(params: AdditionalParams): params is PracticeQuestionsParams {
  return (params as PracticeQuestionsParams).questionCount !== undefined || 
         (params as PracticeQuestionsParams).questionTypes !== undefined;
}

export function isKnowledgeGapParams(params: AdditionalParams): params is KnowledgeGapParams {
  return (params as KnowledgeGapParams).pastInteractionsCount !== undefined;
}