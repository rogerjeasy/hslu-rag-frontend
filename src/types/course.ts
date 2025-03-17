import { ReactNode } from 'react';

export interface Course {
  id: string;
  title: string;
  icon: ReactNode;
  description: string;
  topics: string[];
  sampleQuestion: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  color: CourseColor;
  highlights?: string[];
}

export type CourseColor = 
  | 'purple'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'indigo'
  | 'teal'
  | 'orange'
  | 'violet'
  | 'amber'
  | 'emerald';

export interface ColorClasses {
  bg: string;
  text: string;
  hover: string;
  border: string;
}

export type ColorClassMap = Record<CourseColor, ColorClasses>;