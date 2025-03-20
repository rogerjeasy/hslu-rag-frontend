"use client";

import { motion, AnimatePresence } from 'framer-motion'
import { JSX, ReactNode } from 'react'

interface Feature {
  icon: ReactNode
  title: string
  description: string
  color: string
  animation: () => JSX.Element
}

interface FeatureDisplayProps {
  features: Feature[]
  activeFeature: number
}

export function FeatureDisplay({ features, activeFeature }: FeatureDisplayProps) {
  return (
    <div className="p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <div className="flex items-center mb-3">
            <div className={`w-8 h-8 rounded-full ${features[activeFeature].color} flex items-center justify-center text-white mr-3`}>
              {features[activeFeature].icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900">{features[activeFeature].title}</h3>
          </div>
          
          <p className="text-gray-600 mb-4">{features[activeFeature].description}</p>
          
          {/* Animation container */}
          <div className="h-48 bg-gray-50 rounded-lg overflow-hidden relative">
            {features[activeFeature].animation()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}