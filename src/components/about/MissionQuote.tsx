'use client'

import { FC, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { LightbulbIcon, BookOpenIcon, GraduationCapIcon } from 'lucide-react'

const MissionQuote: FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.7,
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative rounded-2xl overflow-hidden shadow-xl"
      style={{ aspectRatio: "4/3" }}
    >
      {/* Background with gradient and animated pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
        {/* Animated dot pattern */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 40,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 6px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Floating icons */}
      <motion.div
        className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <LightbulbIcon className="h-6 w-6 text-white" />
      </motion.div>

      <motion.div
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <GraduationCapIcon className="h-6 w-6 text-white" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <BookOpenIcon className="h-6 w-6 text-white" />
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-8 text-white">
        <div className="space-y-6 text-center max-w-md">
          <motion.h3 
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight"
          >
            &quot;Education is not preparation for life; education is life itself.&quot;
          </motion.h3>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl opacity-90"
          >
            — John Dewey
          </motion.p>
         
          <motion.div 
            variants={itemVariants}
            className="flex justify-center pt-4"
          >
            <span className="px-5 py-2.5 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              Empowering Students Since 2024
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default MissionQuote