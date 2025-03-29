// src/types/rag.types.ts
export interface RAGContext {
  id: string;
  title: string;
  content: string;
  citationNumber: number;
  materialId?: string;
  sourceUrl?: string;
  sourcePage?: number;
  score?: number;
}

export interface RAGResponse {
  answer: string;
  citations: number[];
  context: RAGContext[];
  meta?: Record<string, unknown>;
}

export interface StudyGuideRequest {
  topic: string;
  courseId?: string;
  moduleId?: string;
  detailLevel?: 'basic' | 'medium' | 'comprehensive';
  format?: 'outline' | 'notes' | 'flashcards' | 'mind_map' | 'summary';
  additionalParams?: {
    courseId?: string;
    courseName?: string;
    [key: string]: unknown;
  };
}

export interface PracticeQuestionsRequest {
  topic: string;
  courseId?: string;
  moduleId?: string;
  questionCount?: number;
  difficulty?: 'basic' | 'medium' | 'advanced';
  questionTypes?: string[];
}

export interface Question {
  id: string;
  type: string;
  text: string;
  difficulty: string;
  citations: number[];
  options?: QuestionOption[];
  sampleAnswer?: string;
  explanation?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface KnowledgeGap {
  id: string;
  concept: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendedResources: Resource[];
  citations: number[];
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  url?: string;
  description?: string;
}

export interface Strength {
  id: string;
  concept: string;
  description: string;
}

export interface KnowledgeGapResponse extends RAGResponse {
  gaps: KnowledgeGap[];
  strengths: Strength[];
}