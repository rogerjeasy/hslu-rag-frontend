"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCourseStore } from '@/store/courseStore';
import CourseCard from './CourseCard';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Animation variants for container
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function CourseCards() {
  const router = useRouter();
  const { courses, isLoading, error, fetchCourses } = useCourseStore();
  const [showAll, setShowAll] = useState(false);
  
  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  // Handle continue button click
  const handleContinue = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };
  
  // Show only active courses, limit to first 3 unless showAll is true
  const filteredCourses = courses
    .filter(course => course.status?.toLowerCase() !== 'archived')
    .slice(0, showAll ? undefined : 3);
  
  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[280px]">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <div className="bg-destructive/10 p-6 rounded-lg flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-destructive font-medium mb-2">Unable to load your courses</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchCourses()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  if (courses.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <div className="bg-muted p-6 rounded-lg flex flex-col items-center justify-center">
          <p className="text-lg font-medium mb-2">No courses found</p>
          <p className="text-sm text-muted-foreground mb-4">You haven&apos;t enrolled in any courses yet</p>
          <Button onClick={() => router.push('/courses/browse')}>
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Courses</h2>
        {courses.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'View All'}
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course}
            onContinue={handleContinue}
          />
        ))}
      </div>
    </motion.div>
  );
}