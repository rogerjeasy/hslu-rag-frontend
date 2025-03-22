// src/components/study-guides/StudyGuideHeader.tsx
'use client'

import { motion } from 'framer-motion'
import { Lightbulb, BookOpen, GraduationCap } from 'lucide-react'

export const StudyGuideHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="flex justify-center mb-3">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="bg-blue-100 text-blue-600 p-3 rounded-full"
          >
            <BookOpen className="h-8 w-8" />
          </motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="absolute -top-1 -right-1 bg-green-100 text-green-600 p-1.5 rounded-full border-2 border-white"
          >
            <Lightbulb className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
      
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
      >
        Study Guides
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto"
      >
        Personalized study guides to help you ace your exams. 
        These guides are intelligently generated from your course materials and tailored to your learning progress.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-wrap justify-center gap-4 mt-6"
      >
        <FeatureTag icon={<GraduationCap size={16} />} text="Exam-focused" color="blue" />
        <FeatureTag icon={<Lightbulb size={16} />} text="Personalized" color="green" />
        <FeatureTag icon={<BookOpen size={16} />} text="Comprehensive" color="indigo" />
      </motion.div>
    </motion.div>
  )
}

interface FeatureTagProps {
  icon: React.ReactNode
  text: string
  color: 'blue' | 'green' | 'indigo' | 'purple'
}

const FeatureTag = ({ icon, text, color }: FeatureTagProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  }
  
  return (
    <div className={`flex items-center px-3 py-1.5 rounded-full border ${colorClasses[color]}`}>
      <span className="mr-1.5">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}