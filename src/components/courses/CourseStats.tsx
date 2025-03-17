'use client'

import { motion } from 'framer-motion'
import { BookOpen, Lightbulb, BrainCircuit, Code } from 'lucide-react'
import { statsVariants, statItemVariants } from '@/constants/animationVariants'
import { JSX } from 'react';

/**
 * Statistics data structure
 */
interface StatItem {
  label: string;
  value: string;
  icon: JSX.Element;
}

/**
 * Component displaying statistics about courses
 */
export function CourseStats(): JSX.Element {
  // Statistics data
  const stats: StatItem[] = [
    { 
      label: 'Available Courses', 
      value: '12+', 
      icon: <BookOpen className="h-6 w-6 text-blue-500" /> 
    },
    { 
      label: 'Topics Covered', 
      value: '250+', 
      icon: <Lightbulb className="h-6 w-6 text-amber-500" /> 
    },
    { 
      label: 'Practice Questions', 
      value: '3,000+', 
      icon: <BrainCircuit className="h-6 w-6 text-purple-500" /> 
    },
    { 
      label: 'Learning Resources', 
      value: '1,500+', 
      icon: <Code className="h-6 w-6 text-red-500" /> 
    }
  ];

  return (
    <motion.div
      variants={statsVariants}
      initial="hidden"
      animate="visible"
      className="mt-20 pt-10 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
    >
      {stats.map((stat, idx) => (
        <motion.div 
          key={idx}
          custom={idx}
          variants={statItemVariants}
          className="p-6 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm flex flex-col items-center"
        >
          <div className="mb-3">
            {stat.icon}
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
          <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}