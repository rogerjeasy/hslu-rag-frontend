'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  BookOpen, 
  Brain, 
  GraduationCap, 
  Users, 
  MessageSquare,
  FileQuestion,
  BrainCircuit,
  Target,
  BookOpenCheck
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const router = useRouter()
  
  useEffect(() => {
    setIsMounted(true)
    
    // Cycle through features automatically
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // App features with animations
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Course-Specific Question Answering",
      description: "Get answers based on your course materials",
      color: "bg-blue-500",
      animation: (
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
        </div>
      )
    },
    {
      icon: <BookOpenCheck className="h-6 w-6" />,
      title: "Exam Preparation Summaries",
      description: "Generate study guides and topic summaries",
      color: "bg-indigo-500",
      animation: (
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
    },
    {
      icon: <FileQuestion className="h-6 w-6" />,
      title: "Practice Question Generation",
      description: "Test your knowledge with auto-generated questions",
      color: "bg-purple-500",
      animation: (
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
        </div>
      )
    },
    {
      icon: <BrainCircuit className="h-6 w-6" />,
      title: "Concept Clarification",
      description: "Understand complex data science concepts with examples",
      color: "bg-cyan-500",
      animation: (
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
        </div>
      )
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Knowledge Gap Identification",
      description: "Identify areas that need additional focus",
      color: "bg-green-500",
      animation: (
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
        </div>
      )
    }
  ]

  // Stats
  const stats = [
    { 
      icon: <Brain className="w-5 h-5 text-blue-500" />,
      label: 'Courses Supported', 
      value: '12+',
      delay: 0.6 
    },
    { 
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      label: 'Questions Answered', 
      value: '15,000+',
      delay: 0.7 
    },
    { 
      icon: <Users className="w-5 h-5 text-blue-500" />,
      label: 'Active Students', 
      value: '500+',
      delay: 0.8 
    }
  ]

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
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-blue-50/70 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Animated background dots */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {Array(12).fill(0).map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute rounded-full bg-blue-500"
              style={{ 
                width: 4 + (i % 6), 
                height: 4 + (i % 6),
                left: `${(i * 8.33) % 100}%`,
                top: `${(i * 7.7) % 100}%`,
                opacity: 0.1
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 10 + (i % 10),
                repeat: Infinity,
                delay: i % 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left side: Content */}
        <div className="flex flex-col max-w-2xl">
          {/* Badge */}
          {isMounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center self-start rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-4 shadow-sm"
            >
              <motion.span 
                className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                aria-hidden="true"
              />
              HSLU MSc Applied Information and Data Science
            </motion.div>
          )}
          
          {/* Title */}
          {isMounted && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4"
            >
              <span className="block">HSLU Data Science</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Exam Preparation
              </span>
            </motion.h1>
          )}
          
          {/* Description */}
          {isMounted && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg text-gray-600 mb-8"
            >
              Your intelligent study companion for mastering data science concepts and acing your exams.
              <span className="block mt-2">Get personalized assistance based on your course materials.</span>
            </motion.p>
          )}
          
          {/* CTA Buttons */}
          {isMounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button 
                size="lg" 
                className="group bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
                onClick={() => router.push('/register')}
              >
                Get Started
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                  }}
                  className="ml-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-200 w-full sm:w-auto"
                onClick={() => {
                  const featuresSection = document.getElementById('features')
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </motion.div>
          )}
          
          {/* Stats */}
          {isMounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-2">
                    {stat.icon}
                  </div>
                  <motion.p
                    className="text-2xl font-bold text-blue-600"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, delay: 1 + (i * 0.2), repeat: Infinity, repeatDelay: 5 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
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
            className="bg-white rounded-xl shadow-xl overflow-hidden"
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
                    activeFeature === index ? feature.color.replace('bg-', 'bg-') + ' text-white' : 'bg-gray-200'
                  }`}>
                    {feature.icon}
                  </span>
                  <span className="hidden sm:inline">{feature.title.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
            
            {/* Feature content */}
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
                    {features[activeFeature].animation}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          className="w-full h-auto text-white"
          viewBox="0 0 1440 120"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
            d="M0,64 C288,88 480,8 720,8 C960,8 1200,88 1440,56 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
      
      {/* Features section anchor */}
      <div id="features" className="absolute bottom-0"></div>
    </section>
  )
}