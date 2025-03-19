'use client'

import { useState, useRef, useEffect, JSX } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { BookOpen } from 'lucide-react'
import { sectionVariants } from '@/constants/animationVariants'
import { courses } from '@/data/course'

// Import our custom components
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BackgroundEffects } from '@/components/ui/BackgroundEffects'
import { CourseTabs } from '@/components/courses/CourseTabs'
import { CourseCard } from '@/components/courses/CourseCard'
import { CoursePreviewMockup } from '@/components/courses/CoursePreviewMockup'
import { MobileCourseGrid } from '@/components/courses/MobileCourseGrid'
import { CourseStats } from '@/components/courses/CourseStats'

/**
 * Main CoursePreview component that assembles all course-related components
 */
export function CoursePreview(): JSX.Element {
  // Component state
  const [activeTab, setActiveTab] = useState<string>('machine-learning');
  const [visibleCourses, setVisibleCourses] = useState<number>(6);
  
  // Refs and animation hooks
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Get active course data
  const activeCourse = courses.find(course => course.id === activeTab);

  // Handle responsive behavior
  useEffect(() => {
    // Adjust visible courses based on screen width
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setVisibleCourses(4);
        } else if (window.innerWidth < 1024) {
          setVisibleCourses(6);
        } else {
          setVisibleCourses(8);
        }
      }
    };
    
    // Initial call
    handleResize();
    
    // Set up event listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white"
    >
      {/* Background decorative elements */}
      <BackgroundEffects />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <SectionHeading
          badge={{
            text: 'Comprehensive Curriculum',
            icon: <BookOpen className="h-4 w-4" />
          }}
          title="Explore Our"
          highlightedWord="Courses"
          description="Browse our comprehensive course materials designed specifically for HSLU MSc students in Applied Information and Data Science."
          isInView={isInView}
        />

        <Tabs
          defaultValue="machine-learning"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Course tabs navigation */}
          <CourseTabs 
            courses={courses} 
            activeTab={activeTab} 
            visibleCourses={visibleCourses} 
            onTabChange={setActiveTab} 
          />

          {/* Course content display */}
          <AnimatePresence mode="wait">
            {activeCourse && (
              <TabsContent key={activeCourse.id} value={activeCourse.id} className="mt-0">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Course info card */}
                  <CourseCard course={activeCourse} />

                  {/* Course preview illustration */}
                  <CoursePreviewMockup course={activeCourse} />
                </div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>

        {/* Mobile-optimized course grid */}
        <MobileCourseGrid 
          courses={courses}
          activeTab={activeTab}
          onCourseSelect={setActiveTab}
        />
        
        {/* Course statistics */}
        <CourseStats />
      </div>
    </motion.section>
  );
}