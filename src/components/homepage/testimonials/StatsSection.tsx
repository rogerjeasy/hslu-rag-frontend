'use client'

import { motion } from 'framer-motion'
import { useStatisticsStore } from '@/store/statisticsStore'
import { useEffect, useState } from 'react'

interface StatItemProps {
  label: string
  value: string
  index: number
  isInView: boolean
}

export function StatItem({ label, value, index, isInView }: StatItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
      className="p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm"
    >
      <p className="text-2xl md:text-3xl font-bold text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </motion.div>
  )
}

interface StatsSectionProps {
  isInView: boolean
}

export function StatsSection({ isInView }: StatsSectionProps) {

  const [isMounted, setIsMounted] = useState(false)
  const { 
    publicStats, 
    fetchPublicStatistics, 
  } = useStatisticsStore()
  
  useEffect(() => {
    setIsMounted(true)
    
    // Fetch public statistics
    fetchPublicStatistics()
  
    
  }, [fetchPublicStatistics])

  const stats = [
    { label: 'Active Students', value: publicStats?.totalUsers ? `${publicStats.totalUsers.toLocaleString()}+` : '500+', },
    { label: 'Exam Success Rate', value: '94%' },
    { label: 'Average Rating', value: '4.8/5' },
    { label: 'Questions Answered', value: '150+' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
    >
      {isMounted && stats.map((stat, index) => (
        <StatItem 
          key={index}
          label={stat.label}
          value={stat.value}
          index={index}
          isInView={isInView}
        />
      ))}
    </motion.div>
  )
}