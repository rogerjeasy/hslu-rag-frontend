'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'

interface HeroButtonsProps {
  onGetStarted: () => void
  onLearnMore: () => void
}

export function HeroButtons({ onGetStarted, onLearnMore }: HeroButtonsProps) {
  const [hoverPrimary, setHoverPrimary] = useState(false)
  const [hoverSecondary, setHoverSecondary] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto"
    >
      <motion.div
        className="w-full sm:w-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          size="lg"
          className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 shadow-md hover:shadow-xl w-full font-medium relative overflow-hidden"
          onClick={onGetStarted}
          onMouseEnter={() => setHoverPrimary(true)}
          onMouseLeave={() => setHoverPrimary(false)}
        >
          <motion.span
            className="relative z-10 flex items-center justify-center"
            animate={hoverPrimary ? { x: -4 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            Get Started
            <motion.div
              className="ml-2 flex items-center"
              animate={hoverPrimary ? 
                { x: 8, opacity: 1 } : 
                { x: 0, opacity: 1 }
              }
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.span>
          <motion.div 
            className="absolute inset-0 bg-blue-800 opacity-0"
            animate={hoverPrimary ? { opacity: 0.3 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </Button>
      </motion.div>
      
      <motion.div
        className="w-full sm:w-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant="outline"
          size="lg"
          className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-300 w-full relative overflow-hidden"
          onClick={onLearnMore}
          onMouseEnter={() => setHoverSecondary(true)}
          onMouseLeave={() => setHoverSecondary(false)}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={hoverSecondary ? { y: -2 } : { y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={hoverSecondary ? 
                { rotate: 15, scale: 1.1 } : 
                { rotate: 0, scale: 1 }
              }
              transition={{ duration: 0.2 }}
              className="mr-2"
            >
              <BookOpen className="h-4 w-4" />
            </motion.div>
            Learn More
          </motion.div>
          <motion.div 
            className="absolute inset-0 bg-blue-100 opacity-0"
            animate={hoverSecondary ? { opacity: 0.5 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </Button>
      </motion.div>
    </motion.div>
  )
}