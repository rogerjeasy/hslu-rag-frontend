'use client'

import { motion } from 'framer-motion'

export function HeroDescription() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="text-lg text-gray-600 mb-8"
    >
      Your intelligent study companion for mastering data science concepts and acing your exams.
      <span className="block mt-2">Get personalized assistance based on your course materials.</span>
    </motion.p>
  )
}
