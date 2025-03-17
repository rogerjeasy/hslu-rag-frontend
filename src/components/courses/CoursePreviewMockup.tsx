'use client'

import { motion } from 'framer-motion'
import { BookOpen, LineChart, Code, BrainCircuit, Lightbulb, ChevronRight } from 'lucide-react'
import { Course } from '@/types/course'
import { getColorClasses } from '@/utils/courseUtils'
import { cn } from '@/lib/utils'
import { previewVariants } from '@/constants/animationVariants'
import { JSX } from 'react'

interface CoursePreviewMockupProps {
  course: Course;
}

export function CoursePreviewMockup({ course }: CoursePreviewMockupProps): JSX.Element {
  const colorClasses = getColorClasses(course.color);
  
  // Mock icons for different sections
  const icons = [
    <BookOpen key="book" className="h-5 w-5 text-gray-500 opacity-50" />,
    <LineChart key="chart" className="h-5 w-5 text-gray-500 opacity-50" />,
    <Code key="code" className="h-5 w-5 text-gray-500 opacity-50" />,
    <BrainCircuit key="brain" className="h-5 w-5 text-gray-500 opacity-50" />
  ];

  return (
    <motion.div
      variants={previewVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full"
    >
      {/* Animated course preview mockup */}
      <div className="p-6 h-full flex flex-col">
        <div className="h-6 bg-gray-100 rounded w-3/4 mb-6"></div>
        
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded w-4/6"></div>
        </div>
        
        <div className="my-6 border-t border-gray-100 pt-6">
          <div className={cn(
            "h-5 rounded w-1/3 mb-4",
            colorClasses.bg
          )}></div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="h-24 bg-gray-50 rounded border border-gray-100 flex items-center justify-center"
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  colorClasses.bg
                )}>
                  <div className="h-5 w-5 text-gray-500 opacity-50">
                    {icons[idx]}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <div className={cn(
            "rounded-lg p-4 border",
            colorClasses.border,
            "bg-white bg-opacity-50"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <div className="h-6 w-6 text-gray-400">
                  <Lightbulb />
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-100 rounded w-24"></div>
                <div className="h-3 bg-gray-100 rounded w-32"></div>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-3 bg-gray-100 rounded"></div>
              <div className="h-3 bg-gray-100 rounded w-11/12"></div>
              <div className="h-3 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-12 bg-gray-50 border-t border-gray-100 flex items-center px-6">
        <div className="h-6 w-6 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
          <ChevronRight className="h-4 w-4 text-blue-600" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </motion.div>
  );
}