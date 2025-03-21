'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BookOpen, Plus, Search, Filter, Edit, ChevronDown, ChevronUp } from 'lucide-react'
import { useCourseContext } from './courses/CourseContext'
import { Course } from '@/types/course.types'
import { CourseTable } from './courses/CourseTable'
import { CourseForm } from './courses/CourseForm'
import { CourseDeleteDialog } from './courses/CourseDeleteDialog'
import { CourseSearchFilter } from './courses/CourseSearchFilter'
import { useToast } from "@/components/ui/toast-provider"
import { CourseSkeleton } from './courses/CourseSkeleton'
import { courseService } from '@/services/course.service'
import { CourseProvider } from './courses/CourseProvider'

// Main component that uses the CourseProvider
function CourseManagementContent() {
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [isEditingCourse, setIsEditingCourse] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { 
    setSearchTerm, 
    filteredCourses, 
    isLoading,
    refreshCourses,
    error
  } = useCourseContext()
  
  const { toast } = useToast()

  // Ensure courses are loaded when component mounts
  useEffect(() => {
    refreshCourses()
  }, [refreshCourses])

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const handleAddCourse = useCallback(() => {
    setIsAddingCourse(true)
    setCourseToEdit(null)
  }, [])

  const handleEditCourse = useCallback((course: Course) => {
    setCourseToEdit(course)
    setIsEditingCourse(true)
  }, [])

  const handleDeleteCourse = useCallback((courseId: string) => {
    setCourseToDelete(courseId)
  }, [])

  const handleCancelAdd = useCallback(() => {
    setIsAddingCourse(false)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setIsEditingCourse(false)
    setCourseToEdit(null)
  }, [])

  // For form submission, using the inferred type from CourseForm
  type CourseFormValues = {
    code: string;
    name: string;
    description: string;
    semester: string;
    credits: number;
    status: 'active' | 'inactive' | 'archived';
    instructor: string;
  }

  const handleCourseSubmit = useCallback(async (courseData: CourseFormValues, isEdit: boolean) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && courseToEdit) {
        // Update existing course
        await courseService.updateCourse(courseToEdit.id, courseData)
        toast({
          title: "Course updated",
          description: `"${courseData.name}" has been updated successfully.`,
        })
      } else {
        // Create new course
        await courseService.createCourse(courseData)
        toast({
          title: "Course added",
          description: `"${courseData.name}" has been added to the system.`,
        })
      }
      
      // Refresh the course list
      await refreshCourses()
      
      // Reset form state
      setIsAddingCourse(false)
      setIsEditingCourse(false)
      setCourseToEdit(null)
      
    } catch (error) {
      console.error('Course operation error:', error)
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "There was an error processing your request.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [courseToEdit, refreshCourses, toast])

  const handleConfirmDelete = useCallback(async () => {
    if (!courseToDelete) return
    
    try {
      setIsSubmitting(true)
      
      // Delete the course using the service
      await courseService.deleteCourse(courseToDelete)
      
      // Refresh the course list
      await refreshCourses()
      
      setCourseToDelete(null)
      
      toast({
        title: "Course deleted",
        description: "The course has been removed from the system.",
      })
    } catch (error) {
      console.error('Course deletion error:', error)
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "There was an error deleting the course.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [courseToDelete, refreshCourses, toast])

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [setSearchTerm])

  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="rounded-full bg-red-100 p-6 mb-4">
        <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold tracking-tight mb-2">Something went wrong</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {error || "We couldn't load your courses. Please try again later."}
      </p>
      <Button onClick={() => refreshCourses()}>
        Try Again
      </Button>
    </div>
  )

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div variants={cardVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
        <p className="text-muted-foreground mt-2">
          Add, edit, and manage courses for the RAG system.
        </p>
      </motion.div>

      {(isAddingCourse || isEditingCourse) ? (
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {isEditingCourse ? (
                  <>
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Course
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Course
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {isEditingCourse 
                  ? "Update course details for the RAG system." 
                  : "Create a new course for students to access materials and get assistance."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseForm 
                initialData={courseToEdit}
                onSubmit={(data) => handleCourseSubmit(data, isEditingCourse)}
                onCancel={isEditingCourse ? handleCancelEdit : handleCancelAdd}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Available Courses
                  </CardTitle>
                  <CardDescription>
                    Manage courses for the HSLU Data Science Exam Preparation system
                  </CardDescription>
                </div>
                <Button onClick={handleAddCourse}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search courses..."
                    className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    onChange={handleSearchChange}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:w-auto w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {showFilters ? (
                    <ChevronUp className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </div>
              
              {showFilters && (
                <CourseSearchFilter />
              )}
              
              {isLoading ? (
                <CourseSkeleton />
              ) : error ? (
                <ErrorState />
              ) : (
                <CourseTable 
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onAddCourse={handleAddCourse}
                />
              )}
            </CardContent>
            
            {!isLoading && !error && filteredCourses.length > 0 && (
              <CardFooter className="flex flex-col sm:flex-row justify-between border-t p-4 text-sm text-muted-foreground">
                <div>Showing courses that students can access via the RAG system</div>
                <div>Total: {filteredCourses.length} courses</div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      )}

      <CourseDeleteDialog 
        open={!!courseToDelete} 
        onOpenChange={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
      />
    </motion.div>
  )
}

// Main exported component that wraps with CourseProvider
export function CourseManagement() {
  return (
    <CourseProvider>
      <CourseManagementContent />
    </CourseProvider>
  )
}