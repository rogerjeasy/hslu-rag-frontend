"use client";

import { motion } from 'framer-motion'

export function AnimatedDots() {
  return (
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
  )
}