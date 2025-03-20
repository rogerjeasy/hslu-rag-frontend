'use client'

import { motion } from 'framer-motion'

export function HeroTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4"
    >
      <span className="block">HSLU Data Science</span>
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
        Exam Preparation
      </span>
    </motion.h1>
  )
}