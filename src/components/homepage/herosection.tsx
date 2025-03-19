'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function HeroSection() {
  // State to track if component is mounted (for animations)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter();
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  // Background pattern animation
  const patternVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.3,
      transition: { duration: 1.5, ease: "easeOut" }
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
      {/* Background pattern */}
      {isMounted && (
        <motion.div
          className="absolute inset-0 z-0 opacity-0"
          initial="hidden"
          animate="visible"
          variants={patternVariants}
        >
          <div className="absolute inset-0 bg-grid-pattern-blue opacity-20" />
        </motion.div>
      )}
      
      {/* Main content container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" aria-hidden="true"></span>
            HSLU MSc Applied Information and Data Science
          </motion.div>
          
          {/* Main headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-4xl"
          >
            <span className="block">HSLU Data Science</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Exam Preparation Assistant
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl"
          >
            Your intelligent study companion for mastering data science concepts and acing your exams.
            Get personalized assistance based on your course materials.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="group bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={() => router.push('/register')} 
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-200"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Learn More
            </Button>
          </motion.div>
          
          {/* Stats/indicators */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 text-center"
          >
            {[
              { label: 'Courses Supported', value: '12+' },
              { label: 'Questions Answered', value: '15,000+' },
              { label: 'Active Students', value: '500+' }
            ].map((stat, index) => (
              <div key={index} className="mx-auto">
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom wave pattern */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-auto text-white"
          viewBox="0 0 1440 100"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C150,20 350,0 500,20 C650,40 750,80 900,80 C1050,80 1200,50 1440,80 L1440,100 L0,100 Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}