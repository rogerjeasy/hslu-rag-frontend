// src/components/application-management/courses/CourseProvider.tsx
'use client'

import React, { ReactNode, useEffect } from 'react'
import { useCourseStore } from '@/store/courseStore'

type CourseProviderProps = {
  children: ReactNode
}

export function CourseProvider({ children }: CourseProviderProps) {
  const fetchCourses = useCourseStore(state => state.fetchCourses)
  
  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

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