'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  FileText, 
  BookOpen, 
  User, 
  Tag,
  Clock,
  Edit,
  Trash2,
  File,
  Loader2
} from 'lucide-react'
import { Course } from '@/types/course.types'
import { useCourseStore } from '@/store/courseStore'
import { formatDistanceToNow, format } from 'date-fns'

interface ViewCourseDetailProps {
  courseId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
}

export function ViewCourseDetail({ 
  courseId, 
  open, 
  onOpenChange,
  onEdit,
  onDelete
}: ViewCourseDetailProps) {
  // Use a ref to maintain state between renders
  const courseRef = useRef<Course | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Access the necessary parts of your course store
  const getCourse = useCourseStore(state => state.getCourse)
  const courses = useCourseStore(state => state.courses)
  
  // First check if the course exists in the current courses array
  useEffect(() => {
    if (courseId && open) {
      // Always set loading to true initially
      setLoading(true)
      setError(null)
      
      // Check if course already exists in the store
      const existingCourse = courses.find(c => c.id === courseId)
      if (existingCourse) {
        courseRef.current = existingCourse
        // Short delay to avoid flash of loading state
        setTimeout(() => setLoading(false), 300)
        return
      }
      
      // Otherwise, fetch the course
      const fetchCourse = async () => {
        try {
          console.log('Fetching course data for:', courseId)
          const courseData = await getCourse(courseId)
          courseRef.current = courseData
        } catch (err) {
          console.error('Error fetching course:', err)
          setError(err instanceof Error ? err.message : 'Failed to load course details')
        } finally {
          setLoading(false)
        }
      }
      
      fetchCourse()
    }
  }, [courseId, open, getCourse, courses])
  
  // Reset error state when dialog closes, but maintain course data
  useEffect(() => {
    if (!open) {
      setError(null)
    }
  }, [open])
  
  // Render status badge with appropriate color
  const renderStatusBadge = (status?: Course['status']) => {
    if (!status) return null
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case 'inactive':
        return <Badge variant="outline" className="text-amber-500 border-amber-500 hover:bg-amber-100">Inactive</Badge>
      case 'archived':
        return <Badge variant="secondary" className="bg-gray-200 text-gray-600 hover:bg-gray-300">Archived</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date'
    
    try {
      const date = new Date(dateString)
      return format(date, 'PPP')
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateString
    }
  }
  
  // Format relative time
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Unknown date'
    
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      console.error('Error formatting relative time:', error)
      return dateString
    }
  }

  // Access the current course from the ref
  const course = courseRef.current

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Loading course details...</p>
    </div>
  )
  
  // Error state
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="rounded-full bg-red-100 p-4 mb-4">
        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Course</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {error || "We couldn't load the course details. Please try again."}
      </p>
    </div>
  )

  // Course metadata element rendered outside of DialogDescription to avoid nesting a div in a p
  const CourseMetadata = () => (
    course?.code ? (
      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <span>{course.code}</span>
        {renderStatusBadge(course.status)}
      </div>
    ) : null
  );

  // The key part that ensures the Dialog remains stable
  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {/* Always include DialogHeader with DialogTitle for accessibility */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {course?.name || 'Course Details'}
          </DialogTitle>
          <DialogDescription>
            {loading ? "Loading course information..." : "Course information and details"}
          </DialogDescription>
          {!loading && course && <CourseMetadata />}
        </DialogHeader>
        
        {loading ? (
          // Show loading spinner when loading
          <LoadingSpinner />
        ) : error ? (
          // Show error state if there was an error
          <ErrorState />
        ) : course ? (
          // Show course content when loaded successfully
          <>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm">{course.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Instructor
                  </h3>
                  <p className="text-sm">{course.instructor}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Semester
                  </h3>
                  <p className="text-sm">{course.semester}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Course Materials
                  </h3>
                  <p className="text-sm">{course.materialsCount} {course.materialsCount === 1 ? 'item' : 'items'}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Credits
                  </h3>
                  <p className="text-sm">{course.credits}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Created: {formatDate(course.createdAt)} ({formatRelativeTime(course.createdAt)})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Last updated: {formatDate(course.updatedAt)} ({formatRelativeTime(course.updatedAt)})</span>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  onEdit(course)
                  onOpenChange(false)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>

              <Button
                variant="outline"
              >
                <File className="h-4 w-4 mr-2" />
                Materials
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(course.id)
                  onOpenChange(false)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Fallback state - should not happen but handle it just in case
          <div className="py-6 text-center text-muted-foreground">
            <LoadingSpinner />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}