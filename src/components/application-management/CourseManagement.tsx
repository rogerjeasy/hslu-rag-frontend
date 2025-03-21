// src/components/application-management/CourseManagement.tsx
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
import { CourseProvider, useCourseContext, Course } from './courses/CourseContext'
import { CourseTable } from './courses/CourseTable'
import { CourseForm } from './courses/CourseForm'
import { CourseDeleteDialog } from './courses/CourseDeleteDialog'
import { CourseSearchFilter } from './courses/CourseSearchFilter'
import { useToast } from "@/components/ui/toast-provider"
import { CourseSkeleton } from './courses/CourseSkeleton'
// import type { z } from 'zod'

// Create a wrapper component to access the CourseContext
// This is needed because we can only use the context hook inside a component that's a child of the provider
function CourseManagementContent() {
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [isEditingCourse, setIsEditingCourse] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  const { setSearchTerm, filteredCourses } = useCourseContext()
  const { toast } = useToast()

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

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
      setIsLoading(true)
      
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsAddingCourse(false)
      setIsEditingCourse(false)
      setCourseToEdit(null)
      
      toast({
        title: `Course ${isEdit ? 'updated' : 'added'} successfully`,
        description: `"${courseData.name}" has been ${isEdit ? 'updated' : 'added'} to the system.`,
      })
    } catch (error) {
      console.error('Course operation error:', error)
      toast({
        title: "Operation Failed",
        description: "There was an error processing your request.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const handleConfirmDelete = useCallback(async () => {
    if (!courseToDelete) return
    
    try {
      setIsLoading(true)
      
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCourseToDelete(null)
      
      toast({
        title: "Course deleted",
        description: "The course has been removed from the system.",
      })
    } catch (error) {
      console.error('Course deletion error:', error)
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the course.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [courseToDelete, toast])

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [setSearchTerm])

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
                isSubmitting={isLoading}
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
              ) : (
                <CourseTable 
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                />
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t p-4 text-sm text-muted-foreground">
              <div>Showing courses that students can access via the RAG system</div>
              <div>Total: {filteredCourses.length} courses</div>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      <CourseDeleteDialog 
        open={!!courseToDelete} 
        onOpenChange={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isLoading}
      />
    </motion.div>
  )
}

// Main exported component that wraps the content with the provider
export function CourseManagement() {
  return (
    <CourseProvider>
      <CourseManagementContent />
    </CourseProvider>
  )
}