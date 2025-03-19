'use client'

import { motion } from 'framer-motion'

export function HeroDescription() {
  return (
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      className="mt-6 text-lg text-gray-600 max-w-xl leading-relaxed"
    >
      Your intelligent study companion for mastering data science concepts and acing your exams.
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="block mt-2"
      >
        Get personalized assistance based on your course materials.
      </motion.span>
    </motion.p>
  )
}