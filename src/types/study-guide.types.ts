// src/types/study-guide.types.ts
import { RAGResponse } from "@/types/rag.types";

export enum DetailLevel {
  BASIC = 'basic',
  MEDIUM = 'medium',
  COMPREHENSIVE = 'comprehensive'
}

export enum StudyGuideFormat {
  OUTLINE = 'outline',
  NOTES = 'notes',
  FLASHCARDS = 'flashcards',
  MIND_MAP = 'mind_map',
  SUMMARY = 'summary'
}


export interface StudyGuideSummary {
  id: string;
  topic: string;
  courseId?: string;
  moduleId?: string;
  createdAt: number;
  format: string;
  detailLevel: string;
}

export interface StudyGuide extends StudyGuideSummary {
  userId: string;
  progress: number;
  estimatedTime: number;
  lastStudied?: number;
  sections: string[];
  citations: string[];
  type: GuideType;
  title: string; // Added missing property
  updatedAt: number; // Added missing property
}

export interface StudyGuideCreateDTO {
  topic: string;
  courseId?: string;
  moduleId?: string;
  detailLevel: DetailLevel;
  format: StudyGuideFormat;
  includePracticeQuestions?: boolean;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface DeleteAllResponse {
  success: boolean;
  deletedCounts: {
    studyGuides: number;
    practiceQuestions: number;
    knowledgeGaps: number;
    total: number;
  };
  message: string;
}

export type GuideType = 'summary' | 'concept' | 'practice' | 'flashcard' | "outline" | "notes" | "flashcards" | "mind_map";
export type ViewMode = 'grid' | 'list';
export type SortOption = 'recent' | 'priority' | 'progress' | 'name';
export type TabView = 'all' | 'recent' | 'recommended';