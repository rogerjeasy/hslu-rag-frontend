'use client'

import { FC, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TechBackgroundEffectsProps {
  className?: string
}

export const TechBackgroundEffects: FC<TechBackgroundEffectsProps> = ({ className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <div 
      ref={ref} 
      className={`absolute top-0 left-0 w-full h-full overflow-hidden opacity-50 pointer-events-none ${className}`}
    >
      {/* Top right gradient bubble */}
      <motion.div 
        className="absolute top-0 right-0 transform"
        initial={{ opacity: 0, x: 50 }}
        animate={{ 
          opacity: isInView ? 0.3 : 0,
          x: isInView ? 0 : 50
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div 
          className="w-96 h-96 bg-blue-500/30 dark:bg-blue-500/20 rounded-full blur-3xl"
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

      {/* Bottom left gradient bubble */}
      <motion.div 
        className="absolute bottom-0 left-0 transform"
        initial={{ opacity: 0, x: -50 }}
        animate={{ 
          opacity: isInView ? 0.3 : 0,
          x: isInView ? 0 : -50
        }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      >
        <motion.div 
          className="w-96 h-96 bg-violet-500/30 dark:bg-violet-500/20 rounded-full blur-3xl"
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

      {/* Center accent */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isInView ? 0.1 : 0
        }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
      >
        <motion.div 
          className="w-64 h-64 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-3xl"
          animate={{ 
            rotate: 360,
            scale: [0.8, 1, 0.8],
          }} 
          transition={{ 
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        />
      </motion.div>
    </div>
  )
}