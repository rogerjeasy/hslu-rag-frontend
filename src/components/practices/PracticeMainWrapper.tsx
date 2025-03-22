'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PracticeMain from './PracticeMain'

// Loading component to display while waiting
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

// Component that uses search params
function PracticeMainInner() {
  const searchParams = useSearchParams()
  const [courseId, setCourseId] = useState<string>('')
  
  useEffect(() => {
    // Get courseId from query parameters
    const courseIdParam = searchParams.get('courseId')
    setCourseId(courseIdParam || 'default-course')
  }, [searchParams])

  // Don't render until we have the courseId
  if (!courseId) {
    return <LoadingState />
  }

  return (
    <PracticeMain 
      params={{ courseId }} 
    />
  )
}

// Main wrapper with Suspense boundary
export default function PracticeMainWrapper() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PracticeMainInner />
    </Suspense>
  )
}