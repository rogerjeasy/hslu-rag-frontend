// src/components/application-management/courses/CourseSearchFilter.tsx
'use client'

import { useCourseContext } from './CourseContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { X, RotateCcw } from "lucide-react"

export function CourseSearchFilter() {
  const { 
    selectedSemester, 
    setSelectedSemester, 
    selectedStatus, 
    setSelectedStatus, 
    resetFilters,
    courses
  } = useCourseContext()
  
  // Extract unique semesters from courses
  const semesters = Array.from(new Set(courses.map(course => course.semester)))
  
  // Available statuses
  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'archived', label: 'Archived' },
  ]
  
  // Check if any filters are applied
  const hasActiveFilters = selectedSemester !== null || selectedStatus !== null

  return (
    <motion.div 
      className="border rounded-md p-4 bg-muted/40 space-y-4"
      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
      animate={{ 
        opacity: 1, 
        height: 'auto',
        transition: { duration: 0.3 }
      }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Filter Courses</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="semester-filter" className="text-sm font-medium">
            Semester
          </label>
          <div className="flex gap-2">
            <Select
              value={selectedSemester || "all"}
              onValueChange={(value) => setSelectedSemester(value === "all" ? null : value)}
            >
              <SelectTrigger id="semester-filter" className="w-full">
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSemester && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setSelectedSemester(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Status
          </label>
          <div className="flex gap-2">
            <Select
              value={selectedStatus || "all"}
              onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
            >
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStatus && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setSelectedStatus(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}