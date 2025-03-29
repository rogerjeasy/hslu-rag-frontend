// /components/study-guides/guides/GuideGrid.tsx
'use client';

import { motion } from 'framer-motion';
import { StudyGuide } from '@/types/study-guide.types';
import { Course } from '@/types/course.types';
import { GuideCard } from './GuideCard';
import { EmptyTabState } from '../tabs/EmptyTabState';

interface GuideGridProps {
  guides: StudyGuide[];
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
  isRecommended?: boolean;
}

export const GuideGrid = ({ 
  guides, 
  courses, 
  onCourseSelect, 
  isRecommended = false 
}: GuideGridProps) => {
  if (guides.length === 0) {
    return (
      <EmptyTabState 
        title="No guides available" 
        description="Select a course to get started with study guides." 
      />
    );
  }
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full"
    >
      {guides.map((guide) => {
        const course = courses.find(c => c.id === guide.courseId);
        if (!course) return null;
        
        return (
          <motion.div key={guide.id} variants={item} className="w-full">
            <GuideCard 
              guide={guide} 
              course={course} 
              onSelect={() => onCourseSelect(guide.id as string)} 
              isRecommended={isRecommended}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default GuideGrid;