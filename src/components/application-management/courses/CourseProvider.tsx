'use client'

import React, { ReactNode, useEffect } from 'react'
import { useCourseStore } from '@/store/courseStore'

type CourseProviderProps = {
  children: ReactNode
}

export function CourseProvider({ children }: CourseProviderProps) {
  const fetchCourses = useCourseStore(state => state.fetchCourses)
  const isLoading = useCourseStore(state => state.isLoading)
  const courses = useCourseStore(state => state.courses)
 
  // Fetch courses on component mount
  useEffect(() => {
    // Only fetch if we don't already have courses and aren't currently loading
    if (courses.length === 0 && !isLoading) {
      fetchCourses()
    }
  }, [fetchCourses, courses.length, isLoading])

  return <>{children}</>
}

// Custom hook for convenience and backward compatibility
export const useCourseContext = () => {
  const {
    filteredCourses,
    courses,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedSemester,
    setSelectedSemester,
    selectedStatus,
    setSelectedStatus,
    applyFilters,
    resetFilters,
    fetchCourses: refreshCourses
  } = useCourseStore()

  return {
    filteredCourses,
    courses,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedSemester,
    setSelectedSemester,
    selectedStatus,
    setSelectedStatus,
    applyFilters,
    resetFilters,
    refreshCourses
  }
}