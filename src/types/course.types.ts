// src/types/course.types.ts
import { ReactNode } from 'react';

// Main Course type from your backend
export type Course = {
  id: string
  code: string
  name: string
  description: string
  semester: string
  credits: number
  status: 'active' | 'inactive' | 'archived'
  instructor: string
  materialsCount: number
  createdAt: string
  updatedAt: string
  // Additional fields for UI presentation - these would be added after fetching from backend
  icon?: ReactNode
  color?: CourseColor
  topics?: string[]
  sampleQuestion?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  highlights?: string[]
}

// DTOs that match the backend expectations
export interface CourseCreateDTO {
  code: string;
  name: string;
  description: string;
  semester: string;
  credits: number;
  instructor: string;
  status?: string;
}

export interface CourseUpdateDTO {
  code?: string;
  name?: string;
  description?: string;
  semester?: string;
  credits?: number;
  instructor?: string;
  status?: string;
}

export interface CourseResponseDTO {
  id: string;
  code: string;
  name: string;
  description: string;
  semester: string;
  credits: number;
  status: string;
  instructor: string;
  materialsCount: number;
  createdAt: string;
  updatedAt: string;
}

// UI Specific Types
export type CourseColor = 
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';

// Color class mapping for UI
export interface ColorClasses {
  bg: string;
  text: string;
  hover: string;
  border: string;
}

export type ColorClassMap = Record<CourseColor, ColorClasses>;