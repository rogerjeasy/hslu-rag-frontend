
import { ReactNode } from 'react';

/**
 * Activity interface definition that represents a single user activity
 */
export interface Activity {
  id: string;
  icon: ReactNode;
  title: string;
  time: string;
  duration?: string;
  color: string;
  type: 'study' | 'practice' | 'guide' | 'knowledge' | 'course';
  score?: number;
  courseId?: string;
  resourceId?: string;
}