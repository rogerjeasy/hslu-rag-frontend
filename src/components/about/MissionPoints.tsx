'use client'

import { FC, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  CheckCircle, 
  Brain, 
  ClipboardCheck, 
  UserCog, 
  BookOpen, 
  Users
} from 'lucide-react'

interface MissionPoint {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const MissionPoints: FC = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px 0px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const missionPoints: MissionPoint[] = [
    {
      icon: <Brain className="h-5 w-5" />,
      title: "Enhanced Concept Understanding",
      description: "Support students in understanding complex data science concepts through interactive explanations and visual aids",
      color: "blue"
    },
    {
      icon: <ClipboardCheck className="h-5 w-5" />,
      title: "Efficient Exam Preparation",
      description: "Make exam preparation more efficient and effective with adaptive study guides and targeted practice questions",
      color: "emerald"
    },
    {
      icon: <UserCog className="h-5 w-5" />,
      title: "Personalized Learning",
      description: "Provide personalized learning experiences based on individual needs, learning styles, and progress tracking",
      color: "violet"
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Intelligent Content Access",
      description: "Enhance accessibility to course materials through intelligent retrieval and contextual recommendations",
      color: "amber"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Collaborative Environment",
      description: "Foster collaborative learning environments within the HSLU community through shared resources and discussion",
      color: "rose"
    }
  ]

  // Color mappings for different accent colors
  const colorMappings = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
      shadow: "shadow-blue-500/10",
      hover: "group-hover:bg-blue-500 dark:group-hover:bg-blue-600"
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-600 dark:text-emerald-400",
      shadow: "shadow-emerald-500/10",
      hover: "group-hover:bg-emerald-500 dark:group-hover:bg-emerald-600"
    },
    violet: {
      bg: "bg-violet-50 dark:bg-violet-900/20",
      border: "border-violet-200 dark:border-violet-800",
      text: "text-violet-600 dark:text-violet-400",
      shadow: "shadow-violet-500/10",
      hover: "group-hover:bg-violet-500 dark:group-hover:bg-violet-600"
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-600 dark:text-amber-400",
      shadow: "shadow-amber-500/10",
      hover: "group-hover:bg-amber-500 dark:group-hover:bg-amber-600"
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-200 dark:border-rose-800",
      text: "text-rose-600 dark:text-rose-400",
      shadow: "shadow-rose-500/10",
      hover: "group-hover:bg-rose-500 dark:group-hover:bg-rose-600"
    }
  }

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      {missionPoints.map((point, index) => {
        const colors = colorMappings[point.color as keyof typeof colorMappings]
        const isHovered = hoveredIndex === index
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
            transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className={`group relative rounded-lg border ${colors.border} ${colors.bg} p-4 transition-all duration-300 ${isHovered ? `${colors.shadow} shadow-lg` : 'shadow-sm'}`}
          >
            {/* Animated background glow on hover */}
            <motion.div 
              className={`absolute inset-0 rounded-lg opacity-0 ${colors.hover}`}
              animate={{ opacity: isHovered ? 0.1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="flex items-start gap-4 relative z-10">
              {/* Animated icon container */}
              <motion.div 
                className={`rounded-full p-2 ${colors.bg} border ${colors.border} ${colors.text} flex-shrink-0`}
                animate={{ 
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? [0, -5, 5, 0] : 0
                }}
                transition={{ 
                  scale: { duration: 0.2 },
                  rotate: { duration: 0.4, repeat: isHovered ? 1 : 0 }
                }}
              >
                {point.icon}
              </motion.div>
              
              <div className="flex-1">
                <motion.h4 
                  className={`font-medium ${colors.text} transition-colors duration-300 text-base`}
                  animate={{ scale: isHovered ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {point.title}
                </motion.h4>
                
                <motion.p 
                  className="mt-1 text-slate-700 dark:text-slate-300 text-sm"
                  animate={{ 
                    opacity: isHovered ? 1 : 0.9,
                    y: isHovered ? 0 : 2
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {point.description}
                </motion.p>
              </div>
              
              {/* Animated check indicator */}
              <motion.div
                className={`flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${colors.text}`}
                animate={{ 
                  scale: isHovered ? 1.2 : 1,
                  rotate: isHovered ? 360 : 0
                }}
                transition={{ 
                  scale: { duration: 0.3 }, 
                  rotate: { duration: 0.5 } 
                }}
              >
                <CheckCircle className="h-5 w-5" />
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default MissionPoints