'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function HeroBadge() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inline-flex items-center self-start rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-1.5 text-sm font-medium text-blue-800 mb-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.03,
        y: -2,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className="relative flex items-center"
      >
        <motion.span
          className="flex h-2.5 w-2.5 rounded-full bg-blue-600 mr-2.5 relative"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
          aria-hidden="true"
        >
          <motion.span 
            className="absolute inset-0 rounded-full bg-blue-400 opacity-60"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </motion.span>
        
        <motion.span
          animate={isHovered ? { letterSpacing: "0.025em" } : { letterSpacing: "0" }}
          transition={{ duration: 0.3 }}
          className="font-semibold"
        >
          HSLU MSc Applied Information and Data Science
        </motion.span>
      </motion.div>
      
      <motion.div
        className="ml-2 bg-blue-200 h-4 w-px opacity-0"
        animate={isHovered ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      
      <motion.div
        className="ml-2 text-blue-600 font-semibold opacity-0 scale-90"
        animate={isHovered ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.9, x: -5 }}
        transition={{ duration: 0.2 }}
      >
        2025
      </motion.div>
    </motion.div>
  )
}