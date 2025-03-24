'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Search, ChevronLeft, ChevronRight, Info, Lightbulb, Rocket, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'

// Feature showcase data
const features = [
  {
    id: 1,
    title: "Study Materials",
    description: "Access comprehensive study materials for all HSLU MSc courses, organized by module and topic.",
    icon: <Lightbulb className="h-10 w-10 text-amber-500" />,
  },
  {
    id: 2,
    title: "AI-Powered Assistance",
    description: "Get instant answers to your questions using our RAG system that references your actual course materials.",
    icon: <Rocket className="h-10 w-10 text-purple-500" />,
  },
  {
    id: 3,
    title: "Exam Preparation",
    description: "Generate custom study guides and practice questions for targeted exam preparation.",
    icon: <Star className="h-10 w-10 text-blue-500" />,
  },
  {
    id: 4,
    title: "Knowledge Graph",
    description: "Explore connections between concepts across different courses with our interactive knowledge graph.",
    icon: <Info className="h-10 w-10 text-green-500" />,
  },
]

export default function NotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [countdown, setCountdown] = useState(30) // Extended countdown for feature showcase
  const [currentFeature, setCurrentFeature] = useState(0)
  const [showSearchTip, setShowSearchTip] = useState(false)

  // Auto redirect to home after countdown
  useEffect(() => {
    if (countdown <= 0) {
      router.push('/')
      return
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  // Rotate through features every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Show search tip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSearchTip(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Handle search query submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const nextFeature = () => {
    setCurrentFeature(prev => (prev + 1) % features.length)
  }

  const prevFeature = () => {
    setCurrentFeature(prev => (prev - 1 + features.length) % features.length)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, 15, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, -15, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut" 
          }}
        />
        
        {/* Additional floating elements */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full blur-2xl opacity-30"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -20, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-2xl opacity-30"
          animate={{ 
            x: [0, -25, 0], 
            y: [0, 25, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
        />
      </div>
      
      <motion.div 
        className="w-full max-w-xl lg:max-w-2xl xl:max-w-3xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border shadow-xl bg-white/90 backdrop-blur-md dark:bg-gray-950/90 overflow-hidden">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.1 
              }}
            >
              <CardTitle className="text-6xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400">
                404
              </CardTitle>
              <CardDescription className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Page Not Found
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="text-center px-6 sm:px-8 lg:px-10">
            {/* 404 Illustration */}
            <motion.div 
              className="h-44 mb-4 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <svg
                className="w-full max-w-xs"
                viewBox="0 0 200 150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M40 70c0-11 9-20 20-20h80c11 0 20 9 20 20v40c0 11-9 20-20 20H60c-11 0-20-9-20-20V70z"
                  className="text-gray-300 dark:text-gray-700"
                />
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  fill="currentColor"
                  d="M50 75h100v30H50z"
                  className="text-gray-200 dark:text-gray-800"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 1.3 }}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M65 90l15 10m0 0l15-10"
                  className="text-blue-500 dark:text-blue-400"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M115 90l15 10m0 0l15-10"
                  className="text-blue-500 dark:text-blue-400"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 1.7 }}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M60 120l80 0"
                  className="text-red-500 dark:text-red-400"
                />
                <motion.path
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  fill="currentColor"
                  d="M170 110c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5 5 2.24 5 5z"
                  className="text-green-500 dark:text-green-400"
                />
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 2.2 }}
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="3,2"
                  strokeLinecap="round"
                  d="M30 50c20-25 120-25 140 0"
                  className="text-gray-400 dark:text-gray-600"
                />
              </svg>
            </motion.div>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              We couldn&apos;t find the page you&apos;re looking for. It might be under construction or doesn&apos;t exist.
            </motion.p>
            
            {/* Feature Showcase */}
            <motion.div 
              className="mb-6 relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ maxWidth: "100%" }}
            >
              <div className="p-4 min-h-[180px] lg:min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-4"
                  >
                    <div className="p-2 mb-3 lg:mb-0 rounded-full bg-gray-100 dark:bg-gray-800 lg:flex-shrink-0">
                      {features[currentFeature].icon}
                    </div>
                    <div className="lg:text-left">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center lg:text-left">
                        {features[currentFeature].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-800 p-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={prevFeature}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex gap-1">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentFeature 
                          ? "w-4 bg-blue-500 dark:bg-blue-400" 
                          : "w-2 bg-gray-300 dark:bg-gray-700"
                      }`}
                      aria-label={`Go to feature ${index + 1}`}
                    />
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={nextFeature}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
            
            {/* Search bar with animation */}
            <motion.form 
              onSubmit={handleSearch} 
              className="flex gap-2 mb-4 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Input
                type="text"
                placeholder="Search for content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 pr-8"
              />
              <Button type="submit" size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
              
              {/* Search tip tooltip */}
              <AnimatePresence>
                {showSearchTip && searchQuery.length === 0 && (
                  <motion.div 
                    className="absolute -top-12 left-0 right-0 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 p-2 rounded text-xs text-center"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    Try searching for a topic like &quot;machine learning&quot; or &quot;statistics&quot;
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
            
            {/* Countdown timer with animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center items-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Redirecting to home in 
                <motion.span 
                  key={countdown}
                  initial={{ scale: 1.3, color: "#3b82f6" }}
                  animate={{ scale: 1, color: "#2563eb" }}
                  className="inline-block mx-1 font-medium min-w-6 text-center"
                >
                  {countdown}
                </motion.span> 
                seconds
              </p>
            </motion.div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                variant="default"
                size="sm"
                asChild
                className="flex items-center gap-1"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}