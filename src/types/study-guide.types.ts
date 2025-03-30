// src/types/study-guide.types.ts

// Importing existing RAG types
import {
    RAGResponse,
  } from "@/types/rag.types";
  
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
  
  export type GuideType = 'summary' | 'concept' | 'practice' | 'flashcard' | 'outline' | 'notes' | 'flashcards' | 'mind_map';
  export type ViewMode = 'grid' | 'list';
  export type SortOption = 'recent' | 'priority' | 'progress' | 'name';
  export type TabView = 'all' | 'recent' | 'recommended';
  
  /**
   * Base interface for content summary
   */
  export interface ContentSummary {
    id: string;
    topic: string;
    courseId?: string;
    moduleId?: string;
    createdAt: number;
  }
  
  /**
   * Study guide summary information
   */
  export interface StudyGuideSummary extends ContentSummary {
    format: string;
    detailLevel: string;
  }
  
  /**
   * Complete study guide information
   */
  export interface StudyGuide extends StudyGuideSummary {
    userId: string;
    progress: number;
    estimatedTime: number;
    lastStudied?: number;
    sections: string[];
    citations: string[];
    type: GuideType;
    title: string;
    updatedAt: number;
  }
  
  /**
   * DTO for creating a study guide
   */
  export interface StudyGuideCreateDTO {
    topic: string;
    courseId?: string;
    moduleId?: string;
    detailLevel: DetailLevel;
    format: StudyGuideFormat;
    includePracticeQuestions?: boolean;
  }
  
  /**
   * Extension of RAGResponse with study guide specific fields
   */
  export interface StudyGuideResponse extends RAGResponse {
    queryId: string;
    query: string;
    promptType: string;
    timestamp: string;
  }
  
  /**
   * Standard delete operation response
   */
  export interface DeleteResponse {
    success: boolean;
    message: string;
  }
  
  /**
   * Response for bulk deletion operations
   */
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
  
  /**
   * Study guide filters for querying
   */
  export interface StudyGuideFilters {
    courseId?: string;
    moduleId?: string;
    format?: StudyGuideFormat;
    detailLevel?: DetailLevel;
    dateRange?: {
      start: number;
      end: number;
    };
  }
  
  /**
   * Study guide statistics
   */
  export interface StudyGuideStats {
    totalGuides: number;
    completedGuides: number;
    inProgressGuides: number;
    totalStudyTime: number; // in minutes
    averageCompletionRate: number; // percentage
    mostStudiedTopic?: string;
  }
  
  /**
   * Study session for tracking study activities
   */
  export interface StudySession {
    id: string;
    studyGuideId: string;
    userId: string;
    startTime: number;
    endTime?: number;
    duration?: number; // in minutes
    completedSections: string[];
    notes?: string;
  }
  
  /**
   * Practice question summary
   */
  export interface PracticeQuestionsSummary extends ContentSummary {
    difficulty: string;
    questionCount: number;
  }
  
  /**
   * Knowledge gap summary
   */
  export interface KnowledgeGapSummary extends ContentSummary {
    query: string;
    gapCount: number;
    strengthCount: number;
  }