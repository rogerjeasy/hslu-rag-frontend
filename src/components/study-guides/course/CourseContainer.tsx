'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { ViewMode } from '@/types/study-guide';
import { Course } from '@/types/course.types';
import { CourseCard } from './CourseCard';

interface CourseContainerProps {
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
  guidesCount: Record<string, number>; // Map course IDs to their guide counts
  viewMode: ViewMode;
}

export const CourseContainer = ({
  courses,
  onCourseSelect,
  guidesCount,
  viewMode
}: CourseContainerProps) => {
  // Filter only active courses
  const activeCourses = courses.filter(c => c.status === 'active');
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (activeCourses.length === 0) {
    return null;
  }

  return (
    <div className="pt-8 pb-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
        <GraduationCap className="h-5 w-5 mr-2 text-primary" />
        Your Courses
      </h2>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className={`grid grid-cols-1 ${viewMode === 'grid' ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-4 w-full`}
      >
        {activeCourses.map((course) => (
          <motion.div key={course.id} variants={item} className="w-full">
            <CourseCard 
              course={course} 
              onSelect={() => onCourseSelect(course.id)}
              guideCount={guidesCount[course.id] || 0}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CourseContainer;