'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Course } from '@/types/course'
import { getColorClasses } from '@/utils/courseUtils'
import { cn } from '@/lib/utils'
import { JSX } from 'react'

interface MobileCourseGridProps {
  courses: Course[];
  activeTab: string;
  onCourseSelect: (courseId: string) => void;
}

export function MobileCourseGrid({ 
  courses, 
  activeTab, 
  onCourseSelect 
}: MobileCourseGridProps): JSX.Element {
  return (
    <div className="mt-12 md:hidden">
      <h3 className="text-lg font-medium text-gray-900 mb-4">All Courses</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map(course => {
          const colorClasses = getColorClasses(course.color);
          return (
            <motion.div
              key={course.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className={cn(
                  "justify-start h-auto py-4 px-4 w-full border-gray-200 transition-all duration-200",
                  activeTab === course.id ? `bg-gray-50 border-${course.color}-200` : ""
                )}
                onClick={() => onCourseSelect(course.id)}
              >
                <div className="flex items-center">
                  <div className={cn(
                    "mr-3 p-2 rounded-full",
                    activeTab === course.id ? colorClasses.bg : "bg-gray-100"
                  )}>
                    {course.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{course.title}</p>
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500 mt-1">{course.topics.length} topics</p>
                      <span className="mx-2 text-gray-300">•</span>
                      <p className="text-xs text-gray-500">{course.difficulty}</p>
                    </div>
                  </div>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}