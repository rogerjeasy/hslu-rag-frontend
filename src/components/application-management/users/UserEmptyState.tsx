'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { UserCircle, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserEmptyStateProps {
  isFiltered?: boolean
}

export function UserEmptyState({ isFiltered = false }: UserEmptyStateProps) {
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
            <Filter className="h-12 w-12 text-muted-foreground mx-auto" />
          ) : (
            <UserCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          )}
        </div>
      </div>

      <h3 className="text-xl font-medium tracking-tight mb-2">
        {isFiltered ? "No matching users found" : "No users available"}
      </h3>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {isFiltered
          ? "Try adjusting your filters or search criteria to find what you're looking for."
          : "There are no users registered in the system yet."}
      </p>
      
      {isFiltered && (
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset All Filters
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