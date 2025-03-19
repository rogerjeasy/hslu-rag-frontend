'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Course } from '@/types/course'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getColorClasses, getGradientClasses, getDifficultyLevel } from '@/utils/courseUtils'
import { cardVariants, badgeVariants, buttonVariants } from '@/constants/animationVariants'
import { JSX } from 'react'

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps): JSX.Element {
  const colorClasses = getColorClasses(course.color);
  const gradientClasses = getGradientClasses(course.color);
  const difficultyLevel = getDifficultyLevel(course.difficulty);

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      layout
    >
      <Card className="border-gray-200 h-full bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
        {/* Gradient border effect on hover */}
        <div 
          className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-br opacity-0 hover:opacity-100 transition-opacity duration-300" 
          style={{ 
            maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            background: `linear-gradient(to bottom right, var(--${course.color}-100), var(--${course.color}-200))`,
          }} 
        />
        
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {course.icon}
              <motion.div variants={badgeVariants}>
                <Badge 
                  className={cn(
                    colorClasses.bg,
                    colorClasses.text,
                    colorClasses.hover
                  )}
                >
                  {course.difficulty}
                </Badge>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex"
            >
              {Array.from({ length: difficultyLevel }).map((_, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "h-1.5 w-5 rounded-full mr-0.5",
                    colorClasses.bg
                  )} 
                />
              ))}
            </motion.div>
          </div>
          
          <CardTitle className="text-2xl">{course.title}</CardTitle>
          <CardDescription className="text-base">
            {course.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <h4 className="font-medium text-gray-900 mb-3">Key Topics</h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {course.topics.map(topic => (
              <motion.div key={topic} variants={badgeVariants}>
                <Badge 
                  variant="outline" 
                  className="bg-white hover:bg-gray-50 transition-colors"
                >
                  {topic}
                </Badge>
              </motion.div>
            ))}
          </div>

          <h4 className="font-medium text-gray-900 mb-3">Sample Question</h4>
          <div className={cn(
            "p-4 rounded-lg border mb-6",
            colorClasses.border,
            "bg-white bg-opacity-50"
          )}>
            <p className="text-gray-700 text-sm italic">&quot;{course.sampleQuestion}&quot;</p>
          </div>
          
          {course.highlights && (
            <>
              <h4 className="font-medium text-gray-900 mb-3">Course Highlights</h4>
              <ul className="space-y-2">
                {course.highlights.map((highlight, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <div className={cn(
                      "h-2 w-2 rounded-full mr-2",
                      colorClasses.bg
                    )} />
                    {highlight}
                  </motion.li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
        
        <CardFooter>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full"
          >
            <Button 
              className={cn(
                "w-full transition-all duration-300",
                "bg-gradient-to-r shadow-md",
                gradientClasses
              )}
            >
              Explore {course.title}
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "mirror",
                  duration: 1.5
                }}
              >
                <ChevronRight className="ml-2 h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}