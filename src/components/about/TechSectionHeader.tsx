'use client'

import { FC, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TechSectionHeaderProps {
  title: string
  subtitle: string
}

export const TechSectionHeader: FC<TechSectionHeaderProps> = ({ title, subtitle }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  // Animation variants for the section header
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Animation variants for the badge
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  }

  return (
    <div ref={ref} className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-20">
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl"
      >
        <motion.span 
          className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-3"
          variants={badgeVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          Cutting-Edge Stack
        </motion.span>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
          {title}
        </h2>
        
        <p className="mt-4 max-w-[800px] mx-auto text-slate-700 dark:text-slate-400 text-lg md:text-xl">
          {subtitle}
        </p>
      </motion.div>
    </div>
  )
}