// /components/study-guides/guides/GuideList.tsx
'use client';

import { motion } from 'framer-motion';
import { GuideListItem } from './GuideListItem';
import { EmptyTabState } from '../tabs/EmptyTabState';
import { Course } from '@/types/course.types';
import { StudyGuide } from '@/types/study-guide';

interface GuideListProps {
  guides: StudyGuide[];
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
  isRecommended?: boolean;
}

export const GuideList = ({ 
  guides, 
  courses, 
  onCourseSelect, 
  isRecommended = false 
}: GuideListProps) => {
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
      className="space-y-3 w-full"
    >
      {guides.map((guide) => {
        const course = courses.find(c => c.id === guide.courseId);
        if (!course) return null;
        
        return (
          <motion.div key={guide.id} variants={item} className="w-full">
            <GuideListItem
              guide={guide} 
              course={course} 
              onSelect={() => onCourseSelect(guide.courseId)} 
              isRecommended={isRecommended}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default GuideList;