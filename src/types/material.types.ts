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
    status: 'processing' | 'completed' | 'failed';
    uploadedAt: string;
    updatedAt?: string;
  };
  
  export type MaterialProcessingStatus = {
    materialId: string;
    status: string;
    progress: number;
    errorMessage?: string;
    startedAt: string;
    completedAt?: string;
  };
  
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
  }