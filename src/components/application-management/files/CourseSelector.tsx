'use client'

import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useFileUpload } from './FileUploadContext'
import { Book } from 'lucide-react'
import { useCourseStore } from '@/store/courseStore'

export function CourseSelector() {
  const { setSelectedCourse, selectedCourseId } = useFileUpload()
  const { courses, isLoading, error, fetchCourses } = useCourseStore()

  // Fetch courses from the API using the course store
  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // Handle course selection
  const handleCourseChange = (value: string) => {
    const selectedCourse = courses.find(course => course.id === value)
   
    if (selectedCourse) {
      setSelectedCourse(selectedCourse.id, `${selectedCourse.code}: ${selectedCourse.name}`)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Book className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium">Select Course</p>
      </div>
     
      <Select
        value={selectedCourseId || ""}
        onValueChange={handleCourseChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a course for these materials" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              <span className="font-medium">{course.code}:</span> {course.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-xs text-red-500">
          Error loading courses. Please try again.
        </p>
      )}
     
      <p className="text-xs text-muted-foreground">
        The materials will be associated with this course and used for RAG system responses.
      </p>
    </div>
  )
}