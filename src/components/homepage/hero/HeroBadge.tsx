'use client'

import { motion } from 'framer-motion'

export function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-4 shadow-sm hover:shadow transform hover:-translate-y-1 transition-all duration-300 self-start"
    >
      <motion.span 
        className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"
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
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        HSLU MSc Applied Information and Data Science
      </motion.span>
    </motion.div>
  )
}