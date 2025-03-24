// src/types/material.types.ts
export type Material = {
  id: string;
  title: string;
  description?: string;
  type: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  status: 'processing' | 'completed' | 'failed' | 'canceled';
  uploadedAt: string;
  updatedAt?: string;
  batchId?: string; // Optional reference to batch ID
};

export type ProcessingStage =
  | 'pending'
  | 'upload_complete'
  | 'text_extraction'
  | 'chunking'
  | 'embedding'
  | 'indexing'
  | 'completed'
  | 'failed'
  | 'canceled';

export interface MaterialProcessingStatus {
  materialId: string;
  status: string;
  progress: number;
  stage: ProcessingStage;
  stageProgress: number;
  totalChunks?: number;
  processedChunks?: number;
  errorMessage?: string | null;
  startedAt: string;
  completedAt?: string | null;
  batch_id?: string; // Reference to batch ID
  batch_status?: string; // Optional batch status
}

export interface MaterialUploadRequest {
  courseId: string;
  moduleId?: string;
  topicId?: string;
  title?: string;
  description?: string;
  type?: string;
}

export interface MaterialUploadResponse {
  id: string;
  title: string;
  description?: string;
  type: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  status: string;
  uploadedAt: string;
  batch_id?: string; // Reference to batch ID
}

// New types for batch processing

export type BatchStatus = 
  | 'processing'
  | 'completed'
  | 'completed_with_errors'
  | 'failed'
  | 'canceled';

export interface BatchProcessingStatus {
  batch_id: string;
  status: BatchStatus;
  current_stage: ProcessingStage;
  total_count: number;
  completed_count: number;
  failed_count: number;
  material_ids: string[];
  stages_counts: Record<ProcessingStage, number>;
  created_at: string;
  updated_at: string;
  error_message?: string | null;
  progress: number;
  total_chunks?: number;
  processed_chunks?: number;
}

export interface BatchSummary {
  id: string;
  status: BatchStatus;
  current_stage: ProcessingStage;
  total_count: number;
  completed_count: number;
  failed_count: number;
  created_at: string;
  updated_at: string;
  progress: number;
}