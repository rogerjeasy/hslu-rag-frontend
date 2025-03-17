'use client'

import { motion } from 'framer-motion'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Course } from '@/types/course'
import { getColorClasses } from '@/utils/courseUtils'
import { cn } from '@/lib/utils'
import { tabsVariants } from '@/constants/animationVariants'
import { JSX } from 'react'

interface CourseTabsProps {
  courses: Course[];
  activeTab: string;
  visibleCourses: number;
  onTabChange: (tabId: string) => void;
}

export function CourseTabs({ 
  courses, 
  activeTab, 
  visibleCourses, 
  onTabChange 
}: CourseTabsProps): JSX.Element {
  return (
    <motion.div variants={tabsVariants}>
      <div className="flex justify-center mb-8 overflow-x-auto scrollbar-hide">
        <TabsList className="grid grid-flow-col auto-cols-max md:grid-cols-6 lg:grid-cols-8 gap-1 px-1 py-1">
          {courses.slice(0, visibleCourses).map(course => {
            const colorClasses = getColorClasses(course.color);
            return (
              <TabsTrigger
                key={course.id}
                value={course.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 whitespace-nowrap transition-all duration-200",
                  "data-[state=active]:shadow-sm",
                  `data-[state=active]:${colorClasses.bg} data-[state=active]:${colorClasses.text}`
                )}
                onClick={() => onTabChange(course.id)}
              >
                <span className="hidden md:inline">{course.icon}</span>
                <span className="truncate">{course.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </motion.div>
  );
}