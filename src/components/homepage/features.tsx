'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  Lightbulb,
  Zap,
  BookMarked,
  LineChart
} from 'lucide-react'
import Link from 'next/link'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
  accentColor?: string
  href?: string
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0,
  accentColor = 'blue',
  href
}: FeatureCardProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })
  const [isHovered, setIsHovered] = useState(false)
  
  const gradientMap = {
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600'
  }
  
  const bgMap = {
    blue: 'bg-blue-50',
    indigo: 'bg-indigo-50',
    purple: 'bg-purple-50',
    cyan: 'bg-cyan-50'
  }
  
  const borderMap = {
    blue: 'border-blue-100',
    indigo: 'border-indigo-100',
    purple: 'border-purple-100',
    cyan: 'border-cyan-100'
  }
  
  const textMap = {
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    cyan: 'text-cyan-600'
  }
  
  const gradient = gradientMap[accentColor as keyof typeof gradientMap] || gradientMap.blue
  const bgColor = bgMap[accentColor as keyof typeof bgMap] || bgMap.blue
  const borderColor = borderMap[accentColor as keyof typeof borderMap] || borderMap.blue
  const textColor = textMap[accentColor as keyof typeof textMap] || textMap.blue

  // Card animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: delay 
      }
    },
    hover: {
      y: -8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  }

  // Icon container animation variants
  const iconContainerVariants = {
    initial: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.15,
      rotate: [0, -5, 5, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2.5,
        },
        scale: {
          duration: 0.3,
        }
      }
    }
  }

  // Glow effect animation
  const glowVariants = {
    initial: { 
      opacity: 0,
      scale: 0.8
    },
    hover: { 
      opacity: 0.8,
      scale: 1.1,
      transition: {
        duration: 0.4
      }
    }
  }

  // Render learn more content
  const renderLearnMore = () => {
    if (!href) return null;

    return (
      <motion.div
        className="mt-4 pt-2 border-t border-dashed border-gray-200"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          height: isHovered ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <Link href={href} passHref>
          <motion.span 
            className={`text-xs font-medium ${textColor} flex items-center gap-1 cursor-pointer hover:underline`}
            initial={{ x: -10, opacity: 0 }}
            animate={{ 
              x: isHovered ? 0 : -10,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Learn more
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </motion.span>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "visible" : "initial"}
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative flex flex-col h-full rounded-2xl border ${borderColor} ${bgColor} p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
    >
      {/* Glow effect that appears on hover */}
      <motion.div 
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 blur-xl z-0`}
        variants={glowVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
      />
      
      {/* Card content with relative z-index to stay above glow */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-5">
          <motion.span 
            className={`inline-flex items-center justify-center rounded-xl p-3 ${bgColor} bg-opacity-70`}
            variants={iconContainerVariants}
          >
            <motion.div
              className={`h-6 w-6 ${textColor}`}
            >
              {icon}
            </motion.div>
          </motion.span>
        </div>
        
        <div className="flex-grow">
          <motion.h3
            className={`text-lg font-semibold mb-2 transition-colors duration-300 ${isHovered ? textColor : 'text-gray-900'}`}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className="text-gray-600 text-sm leading-relaxed"
            animate={{ 
              color: isHovered ? '#4B5563' : '#6B7280',
            }}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.p>
        </div>
        
        {/* Clickable Learn more section */}
        {renderLearnMore()}
      </div>
    </motion.div>
  )
}


export function Features() {
  const [isMounted, setIsMounted] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" })
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const features = [
    {
      icon: <MessageSquare />,
      title: "AI Study Assistant",
      description: "Get instant, accurate answers to your questions based on your specific HSLU course materials and textbooks.",
      accentColor: "blue",
      href: "features/ai-chat-assistant"
    },
    {
      icon: <BookMarked />,
      title: "Study Guide Generator",
      description: "Generate comprehensive study guides and concise summaries organized by importance and relevance to exams.",
      accentColor: "indigo",
      href: "features/study-guides"
    },
    {
      icon: <GraduationCap />,
      title: "Practice Questions",
      description: "Test your knowledge with course-specific practice questions that reference specific lectures and concepts.",
      accentColor: "purple",
      href: "features/practice-questions"
    },
    {
      icon: <Zap />,
      title: "Knowledge Gap Identification",
      description: "Identify areas where you need additional focus and get recommended materials to review before exams.",
      accentColor: "blue",
      href: "features/knowledge-gaps"
    }
  ]

  const extraFeatures = [
    
    {
      icon: <LineChart />,
      title: "Progress Tracking",
      description: "Monitor your learning progress across different topics and courses to optimize your study time.",
      accentColor: "indigo"
    },
    {
      icon: <BookOpen />,
      title: "Study Guides",
      description: "Generate customized study materials that align perfectly with your course syllabus and learning objectives.",
      accentColor: "purple"
    },
    {
      icon: <Lightbulb />,
      title: "Concept Clarification",
      description: "Understand complex data science concepts with detailed explanations and practical examples from your labs.",
      accentColor: "cyan"
    }
  ]
  
  // Animation variants for the section header
  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // If not mounted yet, prevent animations from running
  if (!isMounted) {
    return (
      <section ref={sectionRef} className="relative py-16 md:py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powerful Features for<br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Better Learning</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our intelligent study assistant provides everything you need to succeed in your 
              HSLU Data Science courses with AI-enhanced learning tools.
            </p>
          </div>
          
          {/* Static feature grids without animations */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className={`relative flex flex-col h-full rounded-2xl border border-${feature.accentColor}-100 bg-${feature.accentColor}-50 p-6 shadow-sm overflow-hidden`}
              >
                {/* Simple static content for server-side rendering */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-5">
                    <span className={`inline-flex items-center justify-center rounded-xl p-3 bg-${feature.accentColor}-50 bg-opacity-70`}>
                      <div className={`h-6 w-6 text-${feature.accentColor}-600`}>
                        {feature.icon}
                      </div>
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className={`text-lg font-semibold mb-2 text-gray-900`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Secondary features */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-center mb-8 text-gray-900">
              Additional Learning Support
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {extraFeatures.map((feature) => (
                <div 
                  key={feature.title}
                  className={`relative flex flex-col h-full rounded-2xl border border-${feature.accentColor}-100 bg-${feature.accentColor}-50 p-6 shadow-sm overflow-hidden`}
                >
                  {/* Simple static content for server-side rendering */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-5">
                      <span className={`inline-flex items-center justify-center rounded-xl p-3 bg-${feature.accentColor}-50 bg-opacity-70`}>
                        <div className={`h-6 w-6 text-${feature.accentColor}-600`}>
                          {feature.icon}
                        </div>
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className={`text-lg font-semibold mb-2 text-gray-900`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Background design elements with animations */}
      <motion.div 
        className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 transform opacity-0"
        animate={{ 
          opacity: isInView ? 0.1 : 0,
          x: isInView ? 0 : 50
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div 
          className="w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 blur-3xl"
          animate={{ 
            scale: [1, 1.05, 1],
          }} 
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
      
      <motion.div 
        className="hidden lg:block absolute left-0 bottom-0 transform opacity-0"
        animate={{ 
          opacity: isInView ? 0.1 : 0,
          x: isInView ? 0 : -50
        }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      >
        <motion.div 
          className="w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
          }} 
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
      </motion.div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header with animations */}
        <motion.div 
          className="mx-auto max-w-3xl text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Features <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">for Better Learning</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our intelligent study assistant provides everything you need to succeed in your 
            HSLU Data Science courses with AI-enhanced learning tools.
          </p>
        </motion.div>
        
        {/* Primary features grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 * index}
              accentColor={feature.accentColor}
              href={feature.href}
            />
          ))}
        </div>
        
        {/* Secondary features (optional) */}
        <div className="mt-16">
          <motion.h3 
            className="text-xl font-semibold text-center mb-8 text-gray-900"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Additional Learning Support
          </motion.h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {extraFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0.6 + (0.1 * index)}
                accentColor={feature.accentColor}
                // href={feature.href}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}