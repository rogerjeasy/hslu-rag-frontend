'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'

interface HeroButtonsProps {
  onGetStarted: () => void
  onLearnMore: () => void
}

export function HeroButtons({ onGetStarted, onLearnMore }: HeroButtonsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
      className="mt-8 flex flex-col sm:flex-row items-start gap-4"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto"
      >
        <Button 
          size="lg" 
          className="group relative bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden z-0 w-full sm:w-auto"
          onClick={onGetStarted}
        >
          <motion.span 
            className="absolute inset-0 w-full h-full bg-blue-700 z-0"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <span className="relative z-10 flex items-center justify-center">
            Get Started
            <motion.span
              className="ml-2 inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </span>
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto"
      >
        <Button 
          variant="outline" 
          size="lg" 
          className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-300 w-full sm:w-auto"
          onClick={onLearnMore}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Learn More
        </Button>
      </motion.div>
    </motion.div>
  )
}