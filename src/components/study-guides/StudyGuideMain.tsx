'use client'

import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCourseStore } from '@/store/courseStore'

// Import components
import { StudyGuideHeader } from './StudyGuideHeader'
import { StudyGuideFilters } from './StudyGuideFilters'
import { StudyGuideList } from './StudyGuideList'
import { StudyGuideTips } from './StudyGuideTips'
import { StudyGuideEmptyState } from './StudyGuideEmptyState'
import { StudyGuideLoader } from './StudyGuideLoader'

export function StudyGuidesMain() {
  const router = useRouter()
 
  // State for guide type filter
  const [selectedGuideType, setSelectedGuideType] = useState<string>('all')
 
  // State for sorting options
  const [sortOption, setSortOption] = useState<string>('recent')
 
  // Get courses from store
  const {
    // courses,
    filteredCourses,
    isLoading,
    error,
    fetchCourses,
    searchTerm,
    setSearchTerm
  } = useCourseStore()

  useEffect(() => {
    // Fetch courses when component mounts
    fetchCourses()
  }, [fetchCourses])

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
    router.push(`/study-guides/${courseId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <StudyGuideHeader />
       
        {/* Main content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar with filters and tips */}
          <div className="space-y-6">
            {/* Filters */}
            <StudyGuideFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedGuideType={selectedGuideType}
              onGuideTypeChange={setSelectedGuideType}
              sortOption={sortOption}
              onSortOptionChange={setSortOption}
            />
           
            {/* Study tips and strategies */}
            <StudyGuideTips />
          </div>
         
          {/* Main content area with course list */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <StudyGuideLoader />
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-6 text-red-800">
                <h3 className="text-lg font-medium">Error loading study guides</h3>
                <p className="mt-2">{error}</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <StudyGuideEmptyState />
            ) : (
              <StudyGuideList
                courses={filteredCourses}
                onCourseSelect={handleCourseSelect}
                selectedGuideType={selectedGuideType}
                sortOption={sortOption}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}