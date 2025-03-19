'use client'

import { motion } from 'framer-motion'

export function HeroHeadline() {
  const wordAnimation = {
    hidden: {},
    visible: {},
  }

  const characterAnimation = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3 + (i * 0.05),
        ease: "easeOut"
      }
    })
  }

  const firstLine = "HSLU Data Science"
  const secondLine = "Exam Preparation Assistant"

  return (
    <motion.h1 
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-3xl mb-4"
      initial="hidden"
      animate="visible"
      variants={wordAnimation}
      aria-label={`${firstLine} ${secondLine}`}
    >
      <span className="block mb-2 relative overflow-hidden">
        {firstLine.split("").map((char, i) => (
          <motion.span
            key={`first-${i}`}
            className="inline-block"
            custom={i}
            variants={characterAnimation}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
      <span className="relative block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
        {secondLine.split("").map((char, i) => (
          <motion.span
            key={`second-${i}`}
            className="inline-block"
            custom={i}
            variants={characterAnimation}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  )
}