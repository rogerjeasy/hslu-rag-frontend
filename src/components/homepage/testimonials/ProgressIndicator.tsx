'use client'

import { motion } from 'framer-motion'

interface ProgressIndicatorProps {
  index: number
  activeIndex: number
  isInView: boolean
  isPaused: boolean
  onClick: () => void
}

export function ProgressIndicator({ 
  index, 
  activeIndex, 
  isInView, 
  isPaused, 
  onClick 
}: ProgressIndicatorProps) {
  
  const progressVariants = {
    inactive: {
      width: "100%",
      scaleX: 0,
      backgroundColor: "rgba(219, 234, 254, 0.7)"
    },
    active: {
      scaleX: 1,
      backgroundColor: "rgba(37, 99, 235, 1)",
      transition: {
        duration: 5, // Match this with autoplay interval
        ease: "linear"
      }
    }
  };

  return (
    <div 
      className="h-1 rounded-full bg-blue-100 w-12 overflow-hidden"
      onClick={onClick}
    >
      <motion.div
        className="h-full origin-left"
        variants={progressVariants}
        initial="inactive"
        animate={index === activeIndex && isInView && !isPaused ? "active" : "inactive"}
        key={`progress-${activeIndex}-${index}`}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )
}