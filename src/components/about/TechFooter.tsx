'use client'

import { FC, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TechFooterProps {
  text?: string
}

export const TechFooter: FC<TechFooterProps> = ({ 
  text = "Trust in code quality and performance" 
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-16 text-center"
    >
      <div className="inline-flex items-center justify-center p-1 rounded-full bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
        <div className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 text-sm font-medium shadow-sm">
          {text}
        </div>
      </div>
    </motion.div>
  )
}