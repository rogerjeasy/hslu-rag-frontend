'use client'

import { JSX, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { headingVariants } from '@/constants/animationVariants'

interface SectionHeadingProps {
  badge: {
    text: string;
    icon: ReactNode;
  };
  title: string;
  highlightedWord: string;
  description: string;
  isInView: boolean;
}

/**
 * Reusable section heading component with animations
 */
export function SectionHeading({ 
  badge,
  title, 
  highlightedWord, 
  description,
  isInView
}: SectionHeadingProps): JSX.Element {
  return (
    <motion.div 
      variants={headingVariants}
      className="text-center mb-12"
    >
      <motion.span
        className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-800 mb-6 shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 500,
          damping: 25
        }}
      >
        <span className="mr-1.5">{badge.icon}</span>
        {badge.text}
      </motion.span>

      <motion.h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
        {title} <span className="relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {highlightedWord}
          </span>
          <motion.span 
            className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-blue-400/40 to-indigo-400/40 rounded-full"
            initial={{ scaleX: 0, originX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </span>
      </motion.h2>
      
      <motion.p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
        {description}
      </motion.p>
    </motion.div>
  );
}