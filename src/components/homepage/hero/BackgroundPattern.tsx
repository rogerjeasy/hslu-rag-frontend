'use client'

import { motion } from 'framer-motion'

export function BackgroundPattern() {
  // Floating dots animation
  const floatingDots = Array(15).fill(null).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }))

  return (
    <>
      {/* Main background pattern */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] bg-repeat opacity-20" />
      </motion.div>

      {/* Floating dots for dynamic effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {floatingDots.map(dot => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-blue-500"
            style={{ 
              width: dot.size, 
              height: dot.size,
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              opacity: 0.1
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-blue-50/30 opacity-0 z-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
      />
    </>
  )
}