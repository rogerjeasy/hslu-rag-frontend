// src/components/application-management/files/CourseSelector.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useFileUpload } from './FileUploadContext'
import { Book } from 'lucide-react'

// Course data type
interface Course {
  id: string
  code: string
  title: string
}

export function CourseSelector() {
  const { setSelectedCourse, selectedCourseId } = useFileUpload()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/courses')
        // const data = await response.json()
        // setCourses(data)
        
        // For demo, we'll use mock data
        setTimeout(() => {
          const mockCourses = [
            { id: '1', code: 'DS-101', title: 'Introduction to Data Science' },
            { id: '2', code: 'ML-201', title: 'Machine Learning' },
            { id: '3', code: 'STAT-301', title: 'Statistical Methods' },
            { id: '4', code: 'DB-401', title: 'Database Systems' },
            { id: '5', code: 'BIG-501', title: 'Big Data Technologies' },
            { id: '6', code: 'VIZ-601', title: 'Data Visualization' },
          ]
          setCourses(mockCourses)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Handle course selection
  const handleCourseChange = (value: string) => {
    const selectedCourse = courses.find(course => course.id === value)
    
    if (selectedCourse) {
      setSelectedCourse(selectedCourse.id, `${selectedCourse.code}: ${selectedCourse.title}`)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Book className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium">Select Course</p>
      </div>
      
      <Select 
        value={selectedCourseId} 
        onValueChange={handleCourseChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a course for these materials" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              <span className="font-medium">{course.code}:</span> {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground">
        The materials will be associated with this course and used for RAG system responses.
      </p>
    </div>
  )
}