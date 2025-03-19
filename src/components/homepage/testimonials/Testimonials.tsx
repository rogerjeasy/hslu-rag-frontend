'use client'

import { useState, useRef, useEffect, JSX } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Import our data and custom components
import { testimonials } from '@/data/testimonials'
import { TestimonialCard } from './TestimonialCard'
import { ProgressIndicator } from './ProgressIndicator'
import { StatsSection } from './StatsSection'

export function Testimonials(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [autoplay, ] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (autoplay && isInView && !isPaused && isMounted) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, isInView, isPaused, isMounted]);

  // Handle navigation
  const handlePrev = (): void => {
    setIsPaused(true); // Temporarily pause autoplay when manually navigating
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleNext = (): void => {
    setIsPaused(true); // Temporarily pause autoplay when manually navigating
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsPaused(false), 10000);
  };

  const visibleTestimonials = () => {
    // Display 1 on mobile, 2 on tablet, 3 on desktop
    const count = typeof window !== 'undefined' ? 
      window.innerWidth < 640 ? 1 : 
      window.innerWidth < 1024 ? 2 : 3 : 3;
    
    const items = [];
    for (let i = 0; i < count; i++) {
      const index = (activeIndex + i) % testimonials.length;
      items.push({ testimonial: testimonials[index], index: i });
    }
    
    return items;
  };
  
  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  
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
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(255, 255, 255, 1)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative bg-gradient-to-b from-white to-blue-50 py-20 md:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 right-0 w-96 h-96 rounded-full bg-blue-400 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-indigo-400 blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern-blue opacity-5" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={headingVariants}
          className="text-center mb-16"
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
            <Star className="mr-1.5 h-4 w-4 text-yellow-500" />
            Student Success Stories
          </motion.span>
          
          <motion.h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Student <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Experiences</span>
              <motion.span 
                className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-blue-400/40 to-indigo-400/40 rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </motion.h2>
          
          <motion.p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from MSc students who have used our platform to enhance their learning and excel in their exams.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Carousel navigation */}
          <div className="absolute -top-16 right-0 flex space-x-3">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-full border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </Button>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-full border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </Button>
            </motion.div>
          </div>

          {/* Testimonial cards */}
          <div className="overflow-hidden" ref={containerRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="wait">
                {isMounted && visibleTestimonials().map(({ testimonial, index }) => (
                  <TestimonialCard 
                    key={`${testimonial.id}-${index}`}
                    testimonial={testimonial}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mt-10 space-x-3">
            {testimonials.map((_, idx) => (
              <ProgressIndicator
                key={idx}
                index={idx}
                activeIndex={activeIndex}
                isInView={isInView}
                isPaused={isPaused}
                onClick={() => {
                  setIsPaused(true);
                  setActiveIndex(idx);
                  setTimeout(() => setIsPaused(false), 10000);
                }}
              />
            ))}
          </div>
          
          {/* Stats section */}
          <StatsSection isInView={isInView} />
        </div>
      </div>
    </motion.section>
  );
}