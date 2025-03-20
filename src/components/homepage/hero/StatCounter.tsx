"use client";

import { useState, useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface StatCounterProps {
  icon: ReactNode
  label: string
  value: string
  index: number
  increment: number
  duration: number
}

export function StatCounter({ icon, label, value, index, duration }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const numericValue = parseInt(value.replace(/\D/g, ''))
  
  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * numericValue))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }
    
    animationFrame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrame)
  }, [numericValue, duration])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
      className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Background pattern element */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20px 20px, rgba(37, 99, 235, 0.15) 4px, transparent 0)",
          backgroundSize: "24px 24px"
        }}
        animate={isHovered ? { opacity: 0.2, scale: 1.05 } : { opacity: 0.1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Highlight effect on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-transparent opacity-0"
        animate={isHovered ? { opacity: 0.2 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="flex flex-col items-center text-center relative z-10">
        <motion.div 
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-80 mb-3 shadow-sm"
          animate={isHovered ? { scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.95)" } : { scale: 1, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={isHovered ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="text-blue-600"
          >
            {icon}
          </motion.div>
        </motion.div>
        
        <motion.p
          className="text-3xl font-bold text-blue-700 mb-1"
          animate={{ 
            scale: isHovered ? 1.1 : [1, 1.05, 1],
            textShadow: isHovered ? "0 1px 2px rgba(0,0,0,0.1)" : "none" 
          }}
          transition={isHovered ? 
            { duration: 0.3 } : 
            { duration: 2, delay: 1 + (index * 0.2), repeat: Infinity, repeatDelay: 5 }
          }
        >
          {count}{value.includes('+') ? '+' : ''}
        </motion.p>
        
        <motion.p 
          className="text-sm font-medium text-gray-600"
          animate={isHovered ? { color: "rgb(37 99 235)" } : { color: "rgb(75 85 99)" }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  )
}