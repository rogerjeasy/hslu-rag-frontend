'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CourseEmptyStateProps {
  onAddCourse: () => void
  isFiltered?: boolean
}

export function CourseEmptyState({ onAddCourse, isFiltered = false }: CourseEmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl opacity-50"></div>
        <div className="relative bg-background border border-border/30 shadow-sm rounded-full p-6 mb-6">
          {isFiltered ? (
            <svg
              className="h-12 w-12 text-muted-foreground mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          ) : (
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          )}
        </div>
      </div>

      <h3 className="text-xl font-medium tracking-tight mb-2">
        {isFiltered ? "No matching courses found" : "No courses available"}
      </h3>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {isFiltered
          ? "Try adjusting your filters or search criteria to find what you're looking for."
          : "Get started by adding your first course to the system."}
      </p>
      
      {isFiltered ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset All Filters
          </Button>
          <Button onClick={onAddCourse}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        </div>
      ) : (
        <Button 
          size="lg" 
          onClick={onAddCourse}
          className="px-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Course
        </Button>
      )}

      {/* Decorative elements */}
      <div className="hidden md:block absolute -z-10">
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/3 transform -translate-x-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
      </div>
    </motion.div>
  )
}