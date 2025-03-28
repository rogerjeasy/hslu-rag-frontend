'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, ReactNode, JSX } from 'react'

// Define types for feature objects
interface Feature {
  title: string;
  description: string;
  animation: () => JSX.Element;
  icon: ReactNode;
  color: string;
}

interface FeatureDisplayProps {
  features: Feature[];
  activeFeature: number;
}

/**
 * FeatureDisplay - Component to display feature animations
 * 
 * @param props - Component props
 * @param props.features - Array of feature objects
 * @param props.activeFeature - Index of the currently active feature
 * @returns React component
 */
export function FeatureDisplay({ features, activeFeature }: FeatureDisplayProps): JSX.Element {
  return (
    <div className="p-4 h-56 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {features[activeFeature].title}
            </h3>
            <p className="text-sm text-gray-600">
              {features[activeFeature].description}
            </p>
          </div>
          
          {/* Render the animation component */}
          <div className="h-32 relative">
            {/* Call the animation function directly without conditional check */}
            {features[activeFeature].animation()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

interface AnimatedFeatureCarouselProps {
  features: Feature[];
  interval?: number;
  showControls?: boolean;
}

/**
 * AnimatedFeatureCarousel - A self-cycling carousel of feature animations
 * 
 * @param props - Component props
 * @param props.features - Array of feature objects with animation components
 * @param props.interval - Time in ms between transitions (default: 5000ms)
 * @param props.showControls - Whether to show navigation controls (default: true)
 * @returns React component
 */
export function AnimatedFeatureCarousel({ 
  features, 
  interval = 5000, 
  showControls = true 
}: AnimatedFeatureCarouselProps): JSX.Element {
  const [activeFeature, setActiveFeature] = useState<number>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true)
  
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const timer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, interval)
    
    return () => clearInterval(timer)
  }, [features.length, interval, isAutoPlaying])
  
  const nextFeature = (): void => {
    setActiveFeature(prev => (prev + 1) % features.length)
    setIsAutoPlaying(false)
  }
  
  const prevFeature = (): void => {
    setActiveFeature(prev => (prev - 1 + features.length) % features.length)
    setIsAutoPlaying(false)
  }
  
  const goToFeature = (index: number): void => {
    setActiveFeature(index)
    setIsAutoPlaying(false)
  }
  
  const resumeAutoPlay = (): void => setIsAutoPlaying(true)
  
  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden">
      {/* Feature tabs */}
      <div className="flex overflow-x-auto scrollbar-hide p-2 bg-gray-50 border-b border-gray-100">
        {features.map((feature, index) => (
          <motion.button
            key={feature.title}
            className={`flex items-center px-3 py-2 text-sm rounded-lg mr-2 whitespace-nowrap ${
              activeFeature === index 
                ? 'bg-blue-50 text-blue-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => goToFeature(index)}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={resumeAutoPlay}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
              activeFeature === index ? feature.color + ' text-white' : 'bg-gray-200'
            }`}>
              {feature.icon}
            </span>
            <span className="hidden sm:inline">{feature.title.split(' ')[0]}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Feature content */}
      <FeatureDisplay 
        features={features} 
        activeFeature={activeFeature} 
      />
      
      {/* Navigation controls */}
      {showControls && (
        <div className="absolute bottom-3 right-3 flex space-x-1">
          <button 
            onClick={prevFeature}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={resumeAutoPlay}
            className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
            aria-label="Previous feature"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={nextFeature}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={resumeAutoPlay}
            className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
            aria-label="Next feature"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Pagination dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => goToFeature(index)}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={resumeAutoPlay}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeFeature === index ? 'bg-blue-500 w-4' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to feature ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}