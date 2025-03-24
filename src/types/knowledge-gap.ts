// src/types/knowledge-gap.ts
import { Citation } from './query';

export enum GapSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

// Define a type for resource metadata
export interface ResourceMetadata {
  title?: string;
  url?: string;
  type?: string;
  description?: string;
  relevance?: number;
  difficulty?: string;
  [key: string]: unknown;
}

export interface KnowledgeGap {
  id: string;
  concept: string;
  description: string;
  severity: GapSeverity;
  recommendedResources: Array<ResourceMetadata>;
  citations: Citation[];
}

export interface Strength {
  id: string;
  concept: string;
  description: string;
}

// Define a type for assessment metadata
export type AssessmentMetadata = Record<string, unknown>;

export interface KnowledgeAssessment {
  id: string;
  title: string;
  userId: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  createdAt: string;
  updatedAt: string;
  gaps: KnowledgeGap[];
  strengths: Strength[];
  recommendedStudyPlan?: string;
  metadata?: AssessmentMetadata;
}

export interface KnowledgeAssessmentSummary {
  id: string;
  title: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  createdAt: string;
  updatedAt: string;
  gapCount: number;
  highestSeverity?: GapSeverity;
}

export interface StudyPlanOptions {
  timeFrame?: string;
  hoursPerWeek?: number;
  modelId?: string;
}

export interface StudyPlanResponse {
  assessment_id: string;
  study_plan: string;
  time_frame: string;
  hours_per_week: number;
}