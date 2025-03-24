/**
 * Types for queries and responses in the HSLU RAG application
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

// Define a type for additional parameters to replace "any"
export type AdditionalParams = Record<string, unknown>;

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

export interface StudyGuideRequest extends QueryRequest {
  queryType: QueryType.STUDY_GUIDE;
  detailLevel?: 'basic' | 'medium' | 'comprehensive';
  format?: 'outline' | 'notes' | 'flashcards' | 'mind_map' | 'summary';
  includePracticeQuestions?: boolean;
}

export interface PracticeQuestionsRequest extends QueryRequest {
  queryType: QueryType.PRACTICE_QUESTIONS;
  questionCount?: number;
  difficulty?: 'basic' | 'medium' | 'advanced';
  questionTypes?: string[];
}

export interface KnowledgeGapRequest extends QueryRequest {
  queryType: QueryType.KNOWLEDGE_GAP;
  pastInteractionsCount?: number;
}