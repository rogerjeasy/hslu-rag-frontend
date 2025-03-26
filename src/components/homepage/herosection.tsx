'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStatisticsStore } from '@/store/statisticsStore'

import { HeroTitle } from './hero/HeroTitle'
import { HeroBadge } from './hero/HeroBadge'
import { HeroDescription } from './hero/HeroDescription'
import { HeroButtons } from './hero/HeroButtons'
import { FeatureDisplay } from './hero/FeatureDisplay'
import { StatCounter } from './hero/StatCounter'
import { AnimatedDots } from './hero/AnimatedDots'
import { AnimatedWave } from './hero/AnimatedWave'

import {
  Brain, 
  Users, 
  MessageSquare,
  FileQuestion,
  BrainCircuit,
  Target,
  BookOpenCheck
} from 'lucide-react'

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const router = useRouter()

  const { 
    publicStats, 
    fetchPublicStatistics, 
  } = useStatisticsStore()
  
  useEffect(() => {
    setIsMounted(true)
    
    // Fetch public statistics
    fetchPublicStatistics()
    
    // Cycle through features automatically
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [fetchPublicStatistics])

  // App features with animations
  const features = [
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
  const stats = [
    { 
      icon: <Brain className="w-5 h-5 text-blue-500" />,
      label: 'Courses Supported', 
      value: publicStats?.totalCourses ? `${publicStats.totalCourses}+` : '12+',
      delay: 0.6,
      increment: 1,
      duration: 3
    },
    { 
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      label: 'Questions Answered', 
      value: '15,000+',
      delay: 0.7,
      increment: 500,
      duration: 3 
    },
    { 
      icon: <Users className="w-5 h-5 text-blue-500" />,
      label: 'Active Students', 
      value: publicStats?.totalUsers ? `${publicStats.totalUsers.toLocaleString()}+` : '500+',
      delay: 0.8,
      increment: 25,
      duration: 3
    }
  ]

  const handleGetStarted = () => {
    router.push('/register')
  }

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 min-h-screen flex items-center">
      {/* Full page background image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/hslu.png" 
          alt="HSLU Campus" 
          fill 
          className="object-cover object-right-bottom opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-blue-50/70"></div>
      </div>
      
      {/* Animated background dots */}
      {isMounted && <AnimatedDots />}
      
      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left side: Content */}
        <div className="flex flex-col max-w-2xl">
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
              className="grid grid-cols-3 gap-4 bg-white/80 rounded-xl p-4 shadow-sm border border-blue-50"
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
          >
            {/* Feature selector tabs */}
            <div className="flex overflow-x-auto scrollbar-hide p-2 bg-gray-50 border-b border-gray-100">
              {features.map((feature, index) => (
                <motion.button
                  key={feature.title}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg mr-2 whitespace-nowrap ${
                    activeFeature === index 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveFeature(index)}
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
          </motion.div>
        </div>
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

// Animation Components for Features
function FeatureQAAnimation() {
  return (
    <div className="relative h-full w-full">
      <motion.div 
        className="absolute top-0 left-0 p-3 bg-gray-100 rounded-lg w-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-2 w-3/4 bg-blue-200 rounded-full mb-2"></div>
        <div className="h-2 w-1/2 bg-blue-200 rounded-full"></div>
      </motion.div>
      
      <motion.div 
        className="absolute top-12 left-4 right-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="h-2 w-full bg-blue-200 rounded-full mb-2"></div>
        <div className="h-2 w-5/6 bg-blue-200 rounded-full mb-2"></div>
        <div className="h-2 w-4/6 bg-blue-200 rounded-full"></div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-3 right-3 text-xs text-blue-400 bg-blue-50 px-2 py-1 rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Source: Lecture 3, slide 12
      </motion.div>
    </div>
  )
}

function FeatureSummaryAnimation() {
  return (
    <div className="relative h-full w-full">
      <motion.div 
        className="absolute top-2 left-0 right-0 p-2 bg-indigo-50 rounded-lg"
        animate={{ 
          x: [0, 5, 0],
          boxShadow: [
            "0px 0px 0px rgba(79, 70, 229, 0.2)", 
            "0px 4px 10px rgba(79, 70, 229, 0.3)", 
            "0px 0px 0px rgba(79, 70, 229, 0.2)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
          <div className="h-2 w-24 bg-indigo-200 rounded-full"></div>
        </div>
        <div className="h-1.5 w-full bg-indigo-100 rounded-full mb-1.5"></div>
        <div className="h-1.5 w-full bg-indigo-100 rounded-full mb-1.5"></div>
        <div className="h-1.5 w-2/3 bg-indigo-100 rounded-full"></div>
      </motion.div>
      
      <motion.div 
        className="absolute top-24 left-3 right-3 p-2 bg-indigo-50/80 rounded-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex gap-2 mb-2">
          <motion.div 
            className="h-3 w-3 rounded-full bg-indigo-300"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          />
          <div className="h-2 w-40 mt-0.5 bg-indigo-200 rounded-full"></div>
        </div>
        <div className="flex gap-2">
          <motion.div 
            className="h-3 w-3 rounded-full bg-indigo-300"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1, delay: 0.3 }}
          />
          <div className="h-2 w-32 mt-0.5 bg-indigo-200 rounded-full"></div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-0 left-4 right-0 h-6 bg-indigo-100 rounded-full"
        initial={{ width: "30%" }}
        animate={{ width: "80%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-full w-full bg-indigo-400 rounded-full relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-indigo-200"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  )
}

function FeatureQuizAnimation() {
  return (
    <div className="relative h-full w-full">
      <motion.div 
        className="absolute top-0 left-0 right-0 p-3 bg-purple-50 rounded-lg"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-2 w-5/6 bg-purple-200 rounded-full mb-3"></div>
        
        <div className="flex space-x-2 mb-2">
          <motion.div 
            className="h-4 w-4 rounded-full border-2 border-purple-300"
            animate={{ borderColor: ["#d8b4fe", "#a855f7", "#d8b4fe"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="h-2 w-24 bg-purple-200 rounded-full mt-1"></div>
        </div>
        
        <div className="flex space-x-2 mb-2">
          <motion.div 
            className="h-4 w-4 rounded-full border-2 border-purple-300"
            animate={{ borderColor: ["#d8b4fe", "#a855f7", "#d8b4fe"] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <div className="h-2 w-32 bg-purple-200 rounded-full mt-1"></div>
        </div>
        
        <div className="flex space-x-2">
          <motion.div 
            className="h-4 w-4 rounded-full border-2 border-purple-300"
            animate={{ borderColor: ["#d8b4fe", "#a855f7", "#d8b4fe"] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <div className="h-2 w-28 bg-purple-200 rounded-full mt-1"></div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-4 right-4 px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-medium"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.3, type: "spring" }}
      >
        Submit
      </motion.div>

      <motion.div 
        className="absolute bottom-4 left-4 flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="w-2 h-2 bg-purple-300 rounded-full"/>
        <div className="w-2 h-2 bg-purple-500 rounded-full"/>
        <div className="w-2 h-2 bg-purple-300 rounded-full"/>
        <div className="w-2 h-2 bg-purple-300 rounded-full"/>
      </motion.div>
    </div>
  )
}

function FeatureConceptAnimation() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div 
        className="absolute top-0 left-0 right-0 p-2 bg-cyan-50 rounded-lg flex flex-col space-y-2"
      >
        <div className="flex items-center">
          <div className="h-4 w-4 rounded-md bg-cyan-400 mr-2"></div>
          <div className="h-2 w-20 bg-cyan-200 rounded-full"></div>
        </div>
        
        <motion.div 
          className="h-2 w-full bg-gradient-to-r from-cyan-200 to-cyan-400 rounded-full"
          animate={{ 
            width: ["60%", "100%", "60%"],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="p-1.5 bg-white rounded border border-cyan-200 flex"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-6 rounded bg-cyan-100 mr-2 flex-shrink-0"></div>
          <div className="space-y-1 flex-grow">
            <div className="h-1.5 w-full bg-cyan-100 rounded-full"></div>
            <div className="h-1.5 w-3/4 bg-cyan-100 rounded-full"></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="p-1.5 bg-white rounded border border-cyan-200 flex"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-6 h-6 rounded bg-cyan-100 mr-2 flex-shrink-0"></div>
          <div className="space-y-1 flex-grow">
            <div className="h-1.5 w-full bg-cyan-100 rounded-full"></div>
            <div className="h-1.5 w-2/3 bg-cyan-100 rounded-full"></div>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-3 right-3 h-16 w-16 bg-cyan-500/10 rounded-lg overflow-hidden flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
      >
        <motion.div 
          className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  )
}

function FeatureGapAnimation() {
  return (
    <div className="relative h-full w-full">
      <motion.div 
        className="absolute top-1 left-0 right-0 p-2 bg-green-50 rounded-lg"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="h-2 w-20 bg-green-200 rounded-full"></div>
          <div className="h-2 w-8 bg-green-200 rounded-full"></div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <motion.div 
              className="h-3 bg-green-200 rounded-full mr-2"
              initial={{ width: "30%" }}
              animate={{ width: "90%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <div className="text-xs text-green-600 font-medium">90%</div>
          </div>
          
          <div className="flex items-center">
            <motion.div 
              className="h-3 bg-green-200 rounded-full mr-2"
              initial={{ width: "30%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.3 }}
            />
            <div className="text-xs text-green-600 font-medium">75%</div>
          </div>
          
          <div className="flex items-center">
            <motion.div 
              className="h-3 bg-red-200 rounded-full mr-2"
              initial={{ width: "30%" }}
              animate={{ width: "45%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.6 }}
            />
            <motion.div 
              className="text-xs text-red-500 font-medium"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              45%
            </motion.div>
          </div>
          
          <div className="flex items-center">
            <motion.div 
              className="h-3 bg-green-200 rounded-full mr-2"
              initial={{ width: "30%" }}
              animate={{ width: "60%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.9 }}
            />
            <div className="text-xs text-green-600 font-medium">60%</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-3 right-3 flex items-center gap-1 bg-green-100 px-2 py-1 rounded text-xs text-green-700"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <motion.div 
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        Recommended topic
      </motion.div>
    </div>
  )
}