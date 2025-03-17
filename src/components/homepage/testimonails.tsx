'use client'

import { useState, useRef, useEffect, JSX } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Define the testimonial type
interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  avatar: string;
  course: string;
  rating: number;
}

// Sample testimonial data
const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "The exam preparation assistant has been invaluable. I was struggling with complex data structures, but the personalized explanations based on our course materials helped me grasp the concepts quickly.",
    author: "Lisa Meyer",
    role: "MSc Student, 2nd Semester",
    avatar: "/avatars/lisa.jpg",
    course: "Machine Learning",
    rating: 5
  },
  {
    id: 2,
    content: "This tool helped me identify knowledge gaps in my understanding of statistical methods. The practice questions were challenging and relevant to our curriculum, which made a huge difference in my exam results.",
    author: "Michael Brunner",
    role: "MSc Student, 3rd Semester",
    avatar: "/avatars/michael.jpg", 
    course: "Statistical Methods",
    rating: 5
  },
  {
    id: 3,
    content: "As a working professional, finding time to study effectively was challenging. This platform allowed me to focus on exactly what I needed to learn, with explanations tailored to our course materials.",
    author: "Sarah Weber",
    role: "MSc Student, Part-time",
    avatar: "/avatars/sarah.jpg",
    course: "Big Data",
    rating: 4
  },
  {
    id: 4,
    content: "The concept clarification feature is outstanding. Being able to get complex data science theories explained with examples from our own lab exercises made abstract concepts much more approachable.",
    author: "David Keller",
    role: "MSc Student, 2nd Semester",
    avatar: "/avatars/david.jpg",
    course: "Data Visualization",
    rating: 5
  },
  {
    id: 5,
    content: "I was skeptical about using an AI tool for exam preparation, but this system exceeded my expectations. It helped me organize complex information from multiple courses in a way that made studying more efficient.",
    author: "Thomas Schubert",
    role: "MSc Student, 3rd Semester",
    avatar: "/avatars/thomas.jpg",
    course: "Machine Learning",
    rating: 5
  },
  {
    id: 6,
    content: "The personalized study guides saved me so much time. Instead of trying to review everything, the system helped me focus on my weak areas first. My exam confidence improved significantly.",
    author: "Nina Lombardi",
    role: "MSc Student, 1st Semester",
    avatar: "/avatars/nina.jpg",
    course: "Programming for Data Science",
    rating: 4
  },
  {
    id: 7,
    content: "I especially appreciated how the system connected concepts across different courses. It helped me see the bigger picture of data science rather than studying topics in isolation.",
    author: "Marc Zimmermann",
    role: "MSc Student, Part-time",
    avatar: "/avatars/marc.jpg",
    course: "Statistical Methods",
    rating: 5
  },
  {
    id: 8,
    content: "The practice question generation feature is brilliant. It created challenging questions that really tested my understanding, not just my memorization. This was key to my exam success.",
    author: "Julia Braun",
    role: "MSc Student, 2nd Semester",
    avatar: "/avatars/julia.jpg",
    course: "Cloud Computing",
    rating: 5
  },
  {
    id: 9,
    content: "As an international student, I sometimes struggled with technical terminology. This system explained complex concepts in clear language and provided examples that made difficult topics accessible.",
    author: "Ravi Patel",
    role: "MSc Student, 1st Semester",
    avatar: "/avatars/ravi.jpg",
    course: "Big Data",
    rating: 4
  },
  {
    id: 10,
    content: "The way this system handled my questions about advanced algorithms was impressive. I could explore topics beyond the lecture materials, which really helped for my research project.",
    author: "Sophia Keller",
    role: "MSc Student, Final Semester",
    avatar: "/avatars/sophia.jpg",
    course: "Advanced Algorithms",
    rating: 5
  }
];

export function Testimonials(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [autoplay, setAutoplay] = useState<boolean>(true);
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
    
    if (autoplay && isInView && !isPaused) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, isInView, isPaused]);

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

  const visibleTestimonials = (): Testimonial[] => {
    // Display 1 on mobile, 2 on tablet, 3 on desktop
    const count = typeof window !== 'undefined' ? 
      window.innerWidth < 640 ? 1 : 
      window.innerWidth < 1024 ? 2 : 3 : 3;
    
    const items: Testimonial[] = [];
    for (let i = 0; i < count; i++) {
      const index = (activeIndex + i) % testimonials.length;
      items.push(testimonials[index]);
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
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2
      }
    }
  };
  
  const quoteVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { 
      opacity: 0.7, 
      scale: 1,
      transition: { 
        duration: 0.4,
        delay: 0.2
      }
    }
  };
  
  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.3
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

  const progressVariants = (_index: number) => ({
    inactive: {
      width: "100%",
      scaleX: 0,
      backgroundColor: "rgba(219, 234, 254, 0.7)"
    },
    active: {
      scaleX: 1,
      backgroundColor: "rgba(37, 99, 235, 1)",
      transition: {
        duration: 5, // Match this with autoplay interval
        ease: "linear"
      }
    }
  });

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
                {isMounted && visibleTestimonials().map((testimonial, idx) => (
                  <motion.div
                    key={`${testimonial.id}-${idx}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover="hover"
                    custom={idx}
                    layout
                  >
                    <Card className="h-full border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                      {/* Gradient border effect */}
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
                      
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex-grow">
                          <motion.div
                            variants={quoteVariants}
                            className="mb-3 flex justify-between items-start"
                          >
                            <Quote className="h-8 w-8 text-blue-400 opacity-70" />
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "h-4 w-4",
                                    i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                                  )} 
                                />
                              ))}
                            </div>
                          </motion.div>
                          <p className="text-gray-700 mb-4 relative z-10">
                            "{testimonial.content}"
                          </p>
                        </div>
                        <div className="flex items-center mt-6 pt-4 border-t border-gray-100">
                          <motion.div
                            variants={avatarVariants}
                          >
                            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                              <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 font-medium">
                                {testimonial.author.split(' ').map(name => name[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-xs text-gray-500">{testimonial.role}</p>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs font-medium text-blue-600">{testimonial.course}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mt-10 space-x-3">
            {testimonials.map((_, idx) => (
              <div 
                key={idx}
                className="h-1 rounded-full bg-blue-100 w-12 overflow-hidden"
              >
                <motion.div
                  className="h-full origin-left"
                  variants={progressVariants(idx)}
                  initial="inactive"
                  animate={idx === activeIndex && isInView && !isPaused ? "active" : "inactive"}
                  key={`progress-${activeIndex}-${idx}`}
                  onClick={() => {
                    setIsPaused(true);
                    setActiveIndex(idx);
                    setTimeout(() => setIsPaused(false), 10000);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
          
          {/* Stats section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { label: 'Active Students', value: '500+' },
              { label: 'Exam Success Rate', value: '94%' },
              { label: 'Average Rating', value: '4.8/5' },
              { label: 'Questions Answered', value: '15,000+' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.7 + (idx * 0.1) }}
                className="p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm"
              >
                <p className="text-2xl md:text-3xl font-bold text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}