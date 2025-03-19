'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Quote, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Testimonial } from '@/data/testimonials'

interface TestimonialCardProps {
  testimonial: Testimonial
  index: number
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.1 // Use index for staggered animation
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

  return (
    <motion.div
      key={`${testimonial.id}-${index}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
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
            &quot;{testimonial.content}&quot;
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
  )
}