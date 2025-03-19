'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface StatItem {
  icon: ReactNode
  label: string
  value: string
  delay: number
}

interface HeroStatsProps {
  stats: StatItem[]
}

export function HeroStats({ stats }: HeroStatsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm"
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: stat.delay,
            ease: "easeOut" 
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 } 
          }}
          className="flex justify-center group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
              {stat.icon}
            </div>
            <div>
              <motion.p 
                className="text-2xl md:text-3xl font-bold text-blue-600"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  delay: stat.delay + 0.5,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
              >
                {stat.value}
              </motion.p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}