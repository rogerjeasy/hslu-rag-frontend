'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  delay: number
  index: number
}

export function HeroFeatureCard({ icon, title, description, delay, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100
        ${index % 2 === 0 ? 'transform -rotate-1' : 'transform rotate-1'}`}
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -5, 0] }}
        transition={{ duration: 0.5 }}
        className="mb-4 p-3 bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center text-blue-600"
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}