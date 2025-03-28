'use client'

import { useState, useEffect, ReactNode, JSX } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStatisticsStore } from '@/store/statisticsStore'

import { HeroTitle } from './hero/HeroTitle'
import { HeroBadge } from './hero/HeroBadge'
import { HeroDescription } from './hero/HeroDescription'
import { HeroButtons } from './hero/HeroButtons'
import { AnimatedDots } from './hero/AnimatedDots'
import { AnimatedWave } from './hero/AnimatedWave'
import { AnimatedFeatureCarousel } from './hero/FeatureDisplay'
import { StatCounter } from './hero/StatCounter'

// Import feature animation components
import {
  FeatureQAAnimation,
  FeatureSummaryAnimation,
  FeatureQuizAnimation,
  FeatureConceptAnimation,
  FeatureGapAnimation
} from './hero/FeatureAnimations'

import {
  Brain, 
  Users, 
  MessageSquare,
  FileQuestion,
  BrainCircuit,
  Target,
  BookOpenCheck
} from 'lucide-react'

// Define types
interface BackgroundImage {
  url: string;
  alt: string;
}

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  animation: () => JSX.Element;
}

interface Stat {
  icon: ReactNode;
  label: string;
  value: string;
  delay: number;
  increment: number;
  duration: number;
}

// Background images from remote sources - with original colors, no transformations
const backgroundImages: BackgroundImage[] = [
  {
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "University campus with students"
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
    alt: "Modern university lecture hall"
  },
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    alt: "Students working on computers"
  }
]

export function HeroSection(): JSX.Element {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [currentBgIndex, setCurrentBgIndex] = useState<number>(0)
  const router = useRouter()

  const { 
    publicStats, 
    fetchPublicStatistics, 
  } = useStatisticsStore()
  
  useEffect(() => {
    setIsMounted(true)
    
    // Fetch public statistics
    fetchPublicStatistics()
    
    // Cycle through background images
    const bgInterval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % backgroundImages.length)
    }, 8000)
    
    return () => {
      clearInterval(bgInterval)
    }
  }, [fetchPublicStatistics])

  // App features with animations
  const features: Feature[] = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Course-Specific Question Answering",
      description: "Get precise answers based on your HSLU course materials, with citations to source lectures and readings.",
      color: "bg-blue-500",
      animation: FeatureQAAnimation
    },
    {
      icon: <BookOpenCheck className="h-6 w-6" />,
      title: "Exam Preparation Summaries",
      description: "Generate comprehensive study guides organized by topic importance and exam relevance.",
      color: "bg-indigo-500",
      animation: FeatureSummaryAnimation
    },
    {
      icon: <FileQuestion className="h-6 w-6" />,
      title: "Practice Question Generation",
      description: "Test your knowledge with auto-generated questions based on course content difficulty.",
      color: "bg-purple-500",
      animation: FeatureQuizAnimation
    },
    {
      icon: <BrainCircuit className="h-6 w-6" />,
      title: "Concept Clarification",
      description: "Understand complex data science concepts with visual examples and practical applications.",
      color: "bg-cyan-500",
      animation: FeatureConceptAnimation
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Knowledge Gap Identification",
      description: "Identify weak areas in your understanding with personalized learning recommendations.",
      color: "bg-green-500",
      animation: FeatureGapAnimation
    }
  ]

  // Stats with animations
  const stats: Stat[] = [
    { 
      icon: <Brain className="w-5 h-5 text-blue-500" />,
      label: 'Courses Supported', 
      value: publicStats?.totalCourses ? `${publicStats.totalCourses}+` : '3+',
      delay: 0.6,
      increment: 1,
      duration: 3
    },
    { 
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      label: 'Questions Answered', 
      value: '15000+',
      delay: 0.7,
      increment: 500,
      duration: 3 
    },
    { 
      icon: <Users className="w-5 h-5 text-blue-500" />,
      label: 'Active Students', 
      value: publicStats?.totalUsers ? `${publicStats.totalUsers.toLocaleString()}+` : '4+',
      delay: 0.8,
      increment: 25,
      duration: 3
    }
  ]

  const handleGetStarted = (): void => {
    router.push('/register')
  }

  const scrollToFeatures = (): void => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animated background images - No opacity, filters or transformations */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          {backgroundImages.map((image, index) => (
            index === currentBgIndex && (
              <motion.div 
                key={image.url} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <Image 
                  src={image.url}
                  alt={image.alt}
                  fill 
                  className="object-cover object-center" // No opacity, showing original colors
                  priority={index === 0}
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
      
      {/* Content overlay to ensure text readability */}
      <div className="absolute inset-0 z-5 bg-transparent pointer-events-none"></div>
      
      {/* Animated background dots */}
      {isMounted && <AnimatedDots />}
      
      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left side: Content */}
        <div className="flex flex-col max-w-2xl bg-white/80 p-6 rounded-xl">
          {/* Badge */}
          {isMounted && <HeroBadge />}
          
          {/* Title */}
          {isMounted && <HeroTitle />}
          
          {/* Description */}
          {isMounted && <HeroDescription />}
          
          {/* CTA Buttons */}
          {isMounted && (
            <HeroButtons 
              onGetStarted={handleGetStarted} 
              onLearnMore={scrollToFeatures} 
            />
          )}
          
          {/* Stats */}
          {isMounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 bg-white rounded-xl p-4 shadow-sm border border-blue-100 mt-6"
            >
              {stats.map((stat, i) => (
                <StatCounter 
                  key={stat.label}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  index={i}
                  increment={stat.increment}
                  duration={stat.duration}
                />
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Right side: Animated Features */}
        <div className="w-full max-w-md">
          {isMounted && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <AnimatedFeatureCarousel 
                features={features}
                interval={5000}
                showControls={true}
              />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Background image pagination dots */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBgIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentBgIndex === index ? 'bg-blue-500 w-4' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Background image ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <AnimatedWave />
      </div>
      
      {/* Features section anchor */}
      <div id="features" className="absolute bottom-0"></div>
    </section>
  )
}