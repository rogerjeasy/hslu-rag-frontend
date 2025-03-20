'use client'

import { FC, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export interface Technology {
  name: string
  description: string
  url: string
}

export interface TechnologyCardProps {
  icon: React.ReactNode
  title: string
  technologies: Technology[]
  delay?: number
  accentColor: string
  index: number
}

export const TechnologyCard: FC<TechnologyCardProps> = ({
  icon,
  title,
  technologies,
  delay = 0,
  accentColor,
  // index
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  // Map accent color to Tailwind classes
  const gradientMap = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    indigo: 'from-indigo-500 to-indigo-600',
    cyan: 'from-cyan-500 to-cyan-600',
    orange: 'from-orange-500 to-orange-600'
  }
  
  const bgMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    violet: 'bg-violet-50 dark:bg-violet-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
    rose: 'bg-rose-50 dark:bg-rose-900/20',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20'
  }
  
  const borderMap = {
    blue: 'border-blue-100 dark:border-blue-800',
    emerald: 'border-emerald-100 dark:border-emerald-800',
    violet: 'border-violet-100 dark:border-violet-800',
    amber: 'border-amber-100 dark:border-amber-800',
    rose: 'border-rose-100 dark:border-rose-800',
    indigo: 'border-indigo-100 dark:border-indigo-800',
    cyan: 'border-cyan-100 dark:border-cyan-800',
    orange: 'border-orange-100 dark:border-orange-800'
  }
  
  const textMap = {
    blue: 'text-blue-600 dark:text-blue-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    violet: 'text-violet-600 dark:text-violet-400',
    amber: 'text-amber-600 dark:text-amber-400',
    rose: 'text-rose-600 dark:text-rose-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    orange: 'text-orange-600 dark:text-orange-400'
  }
  
  const gradient = gradientMap[accentColor as keyof typeof gradientMap] || gradientMap.blue
  const bgColor = bgMap[accentColor as keyof typeof bgMap] || bgMap.blue
  const borderColor = borderMap[accentColor as keyof typeof borderMap] || borderMap.blue
  const textColor = textMap[accentColor as keyof typeof textMap] || textMap.blue

  // Card animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: delay 
      }
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  }

  // Icon container animation variants
  const iconContainerVariants = {
    initial: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.15,
      rotate: [0, -5, 5, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2.5,
        },
        scale: {
          duration: 0.3,
        }
      }
    }
  }

  // Technology card animation variants
  const techCardVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9 
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        delay: i * 0.05
      }
    }),
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "visible" : "initial"}
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative rounded-2xl border ${borderColor} bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
    >
      {/* Animated border gradient on hover */}
      <motion.div 
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 blur-sm`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        {/* Card header and toggle */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="cursor-pointer"
        >
          <div className="flex items-center p-5">
            {/* Icon container with animations */}
            <motion.div 
              className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0 mr-4`}
              variants={iconContainerVariants}
            >
              <motion.div
                className={`h-6 w-6 ${textColor}`}
              >
                {icon}
              </motion.div>
            </motion.div>
            
            <div className="flex-grow">
              <h3 className={`text-xl font-bold ${isHovered ? textColor : 'text-gray-900 dark:text-gray-100'} transition-colors duration-300`}>
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {technologies.length} technologies
              </p>
            </div>
            
            {/* Arrow icon with rotation animation */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-6 flex items-center justify-center ${isHovered ? textColor : 'text-gray-400'} transition-colors duration-300`}
            >
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Expandable content area */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Technology cards with staggered animation */}
            {technologies.map((tech, idx) => (
              <motion.a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                custom={idx}
                variants={techCardVariants}
                whileHover="hover"
                className={`group flex flex-col justify-between p-4 rounded-xl border ${borderColor} hover:border-transparent transition-all duration-300 bg-white dark:bg-slate-800`}
              >
                <div>
                  <h4 className={`font-medium group-hover:${textColor} transition-colors duration-300 text-gray-900 dark:text-white`}>
                    {tech.name}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {tech.description}
                  </p>
                </div>
                <div className={`mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 group-hover:${textColor} transition-colors duration-300`}>
                  <span>Learn more</span>
                  <svg className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 12.5L11.5 8L6.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}