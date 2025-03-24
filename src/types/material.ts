/**
 * Types for course materials in the HSLU RAG application
 */
export enum MaterialType {
  LECTURE_SLIDES = "lecture_slides",
  READING = "reading",
  LAB = "lab",
  ASSIGNMENT = "assignment",
  EXAM = "exam",
  VIDEO = "video",
  OTHER = "other"
}

export enum MaterialStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  INDEXED = "indexed",
  FAILED = "failed"
}

// Define a type for metadata to replace "any"
export type MaterialMetadata = Record<string, unknown>;

export interface Material {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  type: MaterialType;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  status: MaterialStatus;
  pageCount?: number;
  metadata?: MaterialMetadata;
}

export interface MaterialSummary {
  id: string;
  title: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  type: MaterialType;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  status: MaterialStatus;
}

export interface MaterialUploadRequest {
  title: string;
  description?: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  type: MaterialType;
  file: File;
  metadata?: MaterialMetadata;
}

export interface MaterialUploadResponse {
  id: string;
  title: string;
  fileName: string;
  status: MaterialStatus;
  uploadedAt: string;
}