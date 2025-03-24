/**
 * Types for study guides in the HSLU RAG application
 */
import { Citation } from './query';

export enum DetailLevel {
  BASIC = "basic",
  MEDIUM = "medium",
  COMPREHENSIVE = "comprehensive"
}

export enum StudyGuideFormat {
  OUTLINE = "outline",
  NOTES = "notes",
  FLASHCARDS = "flashcards",
  MIND_MAP = "mind_map",
  SUMMARY = "summary"
}

export interface StudyGuideSection {
  title: string;
  content: string;
  order: number;
  citations: Citation[];
  subSections: StudyGuideSection[];
}

// Define a type for study guide metadata
export type StudyGuideMetadata = Record<string, unknown>;

export interface StudyGuide {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  detailLevel: DetailLevel;
  format: StudyGuideFormat;
  sections: StudyGuideSection[];
  citations: Citation[];
  metadata?: StudyGuideMetadata;
}

export interface StudyGuideSummary {
  id: string;
  title: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  createdAt: string;
  updatedAt: string;
  detailLevel: DetailLevel;
  format: StudyGuideFormat;
  sectionCount: number;
}

export interface StudyGuideCreateResponse {
  id: string;
  title: string;
  courseId: string;
  createdAt: string;
}