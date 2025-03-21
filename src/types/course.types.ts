// src/types/course.types.ts
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