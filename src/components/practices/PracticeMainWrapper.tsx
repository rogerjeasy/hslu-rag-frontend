'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PracticeMain from './PracticeMain'

export default function PracticeMainWrapper() {
  const searchParams = useSearchParams()
  const [courseId, setCourseId] = useState<string>('')
  
  useEffect(() => {
    // Get courseId from query parameters
    const courseIdParam = searchParams.get('courseId')
    setCourseId(courseIdParam || 'default-course')
  }, [searchParams])

  // Don't render until we have the courseId
  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <PracticeMain 
      params={{ courseId }} 
    />
  )
}