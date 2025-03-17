'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  LogIn, 
  BookOpen, 
  MessageSquare, 
  GraduationCap,
  CheckCircle,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepProps {
  number: number
  title: string
  description: string
  icon: React.ReactNode
  delay: number
  isLastStep?: boolean
  accentColor: string
}

const Step = ({ 
  number, 
  title, 
  description, 
  icon, 
  delay, 
  isLastStep = false,
  accentColor
}: StepProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" })
  const [isHovered, setIsHovered] = useState(false)
  
  // Color maps for different accent colors
  const bgMap = {
    blue: 'bg-blue-50 hover:bg-blue-100',
    indigo: 'bg-indigo-50 hover:bg-indigo-100',
    purple: 'bg-purple-50 hover:bg-purple-100',
    teal: 'bg-teal-50 hover:bg-teal-100'
  }
  
  const borderMap = {
    blue: 'border-blue-200',
    indigo: 'border-indigo-200',
    purple: 'border-purple-200',
    teal: 'border-teal-200'
  }
  
  const textMap = {
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    teal: 'text-teal-600'
  }
  
  const gradientMap = {
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    teal: 'from-teal-500 to-teal-600'
  }
  
  const bgColor = bgMap[accentColor as keyof typeof bgMap] || bgMap.blue
  const borderColor = borderMap[accentColor as keyof typeof borderMap] || borderMap.blue
  const textColor = textMap[accentColor as keyof typeof textMap] || textMap.blue
  const gradient = gradientMap[accentColor as keyof typeof gradientMap] || gradientMap.blue
  
  // Step container animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay,
        ease: "easeOut" 
      }
    },
    hover: {
      y: -5,
      transition: { 
        duration: 0.3,
        ease: "easeOut" 
      }
    }
  }
  
  // Circle animations
  const circleVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.4, 
        delay: delay + 0.2,
        ease: "easeOut" 
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.3,
        ease: "easeOut" 
      }
    }
  }

  // Badge animations
  const badgeVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 20,
        delay: delay + 0.3
      }
    },
    hover: {
      scale: 1.1,
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      }
    }
  }

  // Icon animations
  const iconVariants = {
    hidden: { 
      rotate: -10, 
      opacity: 0 
    },
    visible: { 
      rotate: 0, 
      opacity: 1,
      transition: { 
        duration: 0.4, 
        delay: delay + 0.4,
        ease: "easeOut" 
      }
    },
    hover: {
      rotate: [0, -5, 5, 0],
      scale: 1.1,
      transition: { 
        rotate: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
        },
        scale: {
          duration: 0.2,
        }
      }
    }
  }
  
  // Content animation variants
  const contentVariants = {
    hidden: { 
      opacity: 0, 
      x: -10 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4, 
        delay: delay + 0.5,
        ease: "easeOut" 
      }
    }
  }
  
  // Connector line animation
  const connectorVariants = {
    hidden: { 
      scaleX: 0, 
      originX: 0 
    },
    visible: { 
      scaleX: 1,
      transition: { 
        duration: 0.8, 
        delay: delay + 0.6,
        ease: "easeOut" 
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col items-center md:items-start p-6 rounded-xl",
        "transition-all duration-300 border backdrop-blur-sm hover:shadow-lg",
        "bg-white/50 hover:bg-white/80",
        borderColor
      )}
    >
      {/* Step number with icon */}
      <div className="relative mb-6">
        <motion.div
          variants={circleVariants}
          className={cn(
            "flex items-center justify-center w-20 h-20 rounded-full",
            bgColor,
            "transition-all duration-300"
          )}
        >
          <motion.span
            variants={badgeVariants}
            className={cn(
              "absolute -top-3 -right-3 flex items-center justify-center",
              "w-8 h-8 rounded-full bg-gradient-to-r", gradient, 
              "text-white text-sm font-bold shadow-md"
            )}
          >
            {number}
          </motion.span>
          
          <motion.div
            variants={iconVariants}
            className={cn(
              "h-8 w-8",
              textColor
            )}
          >
            {icon}
          </motion.div>
        </motion.div>
        
        {/* Animated connector line */}
        {!isLastStep && (
          <motion.div 
            className={cn(
              "hidden md:block absolute top-10 left-20",
              "h-0.5 w-[calc(100%-2rem)]",
              "bg-gradient-to-r", gradient, "opacity-20"
            )}
            variants={connectorVariants}
          >
            <motion.div
              animate={{
                x: [0, 100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className={cn(
                "absolute top-0 left-0 h-full w-20",
                "bg-gradient-to-r", gradient, "opacity-30 rounded-full blur-sm"
              )}
            />
          </motion.div>
        )}
      </div>
      
      {/* Step content with glow effect on hover */}
      <div className="relative z-10 text-center md:text-left md:ml-2 w-full">
        {/* Glow effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute -inset-4 rounded-xl opacity-0",
                "bg-gradient-to-r", gradient, "opacity-5 blur-xl -z-10"
              )}
            />
          )}
        </AnimatePresence>
        
        <motion.h3 
          variants={contentVariants}
          className={cn(
            "text-xl font-semibold mb-3",
            "transition-colors duration-300",
            isHovered ? textColor : "text-gray-900"
          )}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          variants={contentVariants}
          className="text-gray-600 text-sm leading-relaxed"
        >
          {description}
        </motion.p>
        
        {/* "Learn more" text that appears on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mt-4 flex items-center gap-1",
                "text-sm font-medium", textColor
              )}
            >
              <span>Learn more</span>
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function HowItWorks() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" })
  const [isHovered, setIsHovered] = useState(false)

  // Define the steps with different accent colors
  const steps = [
    {
      number: 1,
      title: "Login with your university credentials",
      description: "Access the platform securely using your HSLU student account or university single sign-on.",
      icon: <LogIn className="h-8 w-8" />,
      delay: 0.1,
      accentColor: "blue"
    },
    {
      number: 2,
      title: "Select your courses and topics",
      description: "Choose from available courses or specific topics you want to study and prepare for.",
      icon: <BookOpen className="h-8 w-8" />,
      delay: 0.2,
      accentColor: "indigo"
    },
    {
      number: 3,
      title: "Ask questions or generate study materials",
      description: "Get instant answers to your questions or create custom study guides based on your course materials.",
      icon: <MessageSquare className="h-8 w-8" />,
      delay: 0.3,
      accentColor: "purple"
    },
    {
      number: 4,
      title: "Practice with generated questions",
      description: "Test your knowledge with AI-generated practice questions based on your course content.",
      icon: <GraduationCap className="h-8 w-8" />,
      delay: 0.4,
      accentColor: "teal"
    }
  ]

  // Section animations
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }
  
  // Animated background elements
  const bgElementVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 0.15, 
      scale: 1,
      transition: { 
        duration: 1
      }
    }
  }

  // Section heading animations
  const headingVariants = {
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
  
  // CTA card animations
  const ctaVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.section 
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
        <motion.div 
          variants={bgElementVariants}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 blur-3xl"
        />
        <motion.div 
          variants={bgElementVariants}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern-blue opacity-5" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          variants={headingVariants}
          className="mx-auto max-w-3xl text-center mb-20"
        >
          <motion.span
            className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-800 mb-6 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 25
            }}
          >
            <CheckCircle className="mr-1.5 h-4 w-4" />
            Simple 4-Step Process
          </motion.span>
          
          <motion.h2 
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4"
          >
            How It <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Works</span>
              <motion.span 
                className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-blue-400/40 to-indigo-400/40 rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-xl text-gray-600 leading-relaxed"
          >
            Get started in minutes with our simple, intuitive process designed 
            specifically for HSLU students.
          </motion.p>
        </motion.div>
        
        {/* Steps layout - changes to vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-6 mb-20">
          {steps.map((step, index) => (
            <Step
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              delay={step.delay}
              isLastStep={index === steps.length - 1}
              accentColor={step.accentColor}
            />
          ))}
        </div>
        
        {/* CTA card at the bottom */}
        <motion.div
          variants={ctaVariants}
          whileHover="hover"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl overflow-hidden"
        >
          {/* Animated background elements on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 -z-10"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                  className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 md:p-14">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Ready to enhance your learning experience?
                </h3>
                <p className="text-lg text-blue-100">
                  Start using our AI-powered study assistant today and maximize your exam preparation.
                </p>
              </div>
              <div className="mt-6 sm:mt-0 sm:ml-6 flex flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center rounded-lg border border-transparent bg-white px-5 py-4 text-base font-medium text-blue-700 shadow-md hover:bg-blue-50 transition-colors"
                >
                  <span>Get Started</span>
                  <motion.div
                    animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
                    transition={{ 
                      duration: 1,
                      repeat: isHovered ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                  >
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}