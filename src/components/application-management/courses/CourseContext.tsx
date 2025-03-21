// src/components/application-management/courses/CourseContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type CourseContextType = {
  courses: Course[]
  filteredCourses: Course[]
  isLoading: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedSemester: string | null
  setSelectedSemester: (semester: string | null) => void
  selectedStatus: string | null
  setSelectedStatus: (status: string | null) => void
  applyFilters: () => void
  resetFilters: () => void
}

export type Course = {
  id: string
  code: string
  name: string
  description: string
  semester: string
  credits: number
  status: 'active' | 'inactive' | 'archived'
  instructor: string
  materialsCount: number
  createdAt: string
  updatedAt: string
}

// Create a context with default values
const CourseContext = createContext<CourseContextType>({
  courses: [],
  filteredCourses: [],
  isLoading: true,
  searchTerm: '',
  setSearchTerm: () => {},
  selectedSemester: null,
  setSelectedSemester: () => {},
  selectedStatus: null,
  setSelectedStatus: () => {},
  applyFilters: () => {},
  resetFilters: () => {}
})

// Mock data for demonstration
const mockCourses: Course[] = [
  {
    id: '1',
    code: 'DS101',
    name: 'Introduction to Data Science',
    description: 'Foundational concepts and tools in data science with Python.',
    semester: 'Fall 2024',
    credits: 6,
    status: 'active',
    instructor: 'Dr. Anna Schmidt',
    materialsCount: 24,
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-02-20T14:15:00Z'
  },
  {
    id: '2',
    code: 'ML202',
    name: 'Machine Learning',
    description: 'Supervised and unsupervised learning algorithms and applications.',
    semester: 'Spring 2024',
    credits: 6,
    status: 'active',
    instructor: 'Prof. Michael Brown',
    materialsCount: 32,
    createdAt: '2023-11-10T11:45:00Z',
    updatedAt: '2024-03-05T16:20:00Z'
  },
  {
    id: '3',
    code: 'STAT301',
    name: 'Statistical Methods',
    description: 'Advanced statistical analysis for data science applications.',
    semester: 'Fall 2023',
    credits: 4,
    status: 'archived',
    instructor: 'Dr. Elena Rodriguez',
    materialsCount: 18,
    createdAt: '2023-08-22T10:00:00Z',
    updatedAt: '2023-12-15T09:10:00Z'
  },
  {
    id: '4',
    code: 'DB204',
    name: 'Database Systems',
    description: 'Relational and NoSQL database systems for data management.',
    semester: 'Spring 2024',
    credits: 5,
    status: 'active',
    instructor: 'Prof. David Chen',
    materialsCount: 22,
    createdAt: '2023-12-01T08:30:00Z',
    updatedAt: '2024-03-10T13:45:00Z'
  },
  {
    id: '5',
    code: 'BD405',
    name: 'Big Data Technologies',
    description: 'Tools and frameworks for processing large-scale data.',
    semester: 'Fall 2024',
    credits: 6,
    status: 'active',
    instructor: 'Dr. Sarah Johnson',
    materialsCount: 28,
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-02-28T11:30:00Z'
  },
  {
    id: '6',
    code: 'AI303',
    name: 'Artificial Intelligence',
    description: 'Principles and applications of artificial intelligence.',
    semester: 'Spring 2023',
    credits: 5,
    status: 'archived',
    instructor: 'Prof. James Wilson',
    materialsCount: 20,
    createdAt: '2022-12-10T09:15:00Z',
    updatedAt: '2023-06-20T15:40:00Z'
  },
  {
    id: '7',
    code: 'VIZ302',
    name: 'Data Visualization',
    description: 'Effective techniques for visualizing complex data.',
    semester: 'Fall 2023',
    credits: 4,
    status: 'inactive',
    instructor: 'Dr. Lisa Park',
    materialsCount: 15,
    createdAt: '2023-08-15T13:10:00Z',
    updatedAt: '2023-12-10T10:25:00Z'
  },
  {
    id: '8',
    code: 'NLP404',
    name: 'Natural Language Processing',
    description: 'Text analysis and language modeling techniques.',
    semester: 'Spring 2024',
    credits: 5,
    status: 'active',
    instructor: 'Prof. Robert Martin',
    materialsCount: 26,
    createdAt: '2023-12-05T10:30:00Z',
    updatedAt: '2024-03-12T14:50:00Z'
  },
  {
    id: '9',
    code: 'DM203',
    name: 'Data Mining',
    description: 'Techniques for discovering patterns in large datasets.',
    semester: 'Fall 2024',
    credits: 5,
    status: 'active',
    instructor: 'Dr. Thomas Lee',
    materialsCount: 23,
    createdAt: '2024-01-08T11:20:00Z',
    updatedAt: '2024-02-25T09:35:00Z'
  },
  {
    id: '10',
    code: 'CV405',
    name: 'Computer Vision',
    description: 'Image processing and visual data analysis.',
    semester: 'Spring 2023',
    credits: 6,
    status: 'archived',
    instructor: 'Prof. Karen White',
    materialsCount: 19,
    createdAt: '2022-12-15T08:45:00Z',
    updatedAt: '2023-06-10T16:15:00Z'
  },
  {
    id: '11',
    code: 'DE302',
    name: 'Data Engineering',
    description: 'Building robust data pipelines and infrastructure.',
    semester: 'Fall 2023',
    credits: 5,
    status: 'inactive',
    instructor: 'Dr. Alex Johnson',
    materialsCount: 21,
    createdAt: '2023-08-10T09:50:00Z',
    updatedAt: '2023-12-05T13:20:00Z'
  },
  {
    id: '12',
    code: 'RL404',
    name: 'Reinforcement Learning',
    description: 'Learning through interaction with environments.',
    semester: 'Spring 2024',
    credits: 5,
    status: 'active',
    instructor: 'Prof. Nicole Garcia',
    materialsCount: 24,
    createdAt: '2023-12-12T14:40:00Z',
    updatedAt: '2024-03-15T10:55:00Z'
  }
]

// Provider component
export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Simulate API fetch
        await new Promise(resolve => setTimeout(resolve, 1000))
        setCourses(mockCourses)
        setFilteredCourses(mockCourses)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Apply filters to courses
  const applyFilters = () => {
    let result = [...courses]
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        course => 
          course.name.toLowerCase().includes(lowerSearchTerm) ||
          course.code.toLowerCase().includes(lowerSearchTerm) ||
          course.description.toLowerCase().includes(lowerSearchTerm) ||
          course.instructor.toLowerCase().includes(lowerSearchTerm)
      )
    }
    
    // Apply semester filter
    if (selectedSemester) {
      result = result.filter(course => course.semester === selectedSemester)
    }
    
    // Apply status filter
    if (selectedStatus) {
      result = result.filter(course => course.status === selectedStatus)
    }
    
    setFilteredCourses(result)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedSemester(null)
    setSelectedStatus(null)
    setFilteredCourses(courses)
  }

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedSemester, selectedStatus, courses])

  const value = {
    courses,
    filteredCourses,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedSemester,
    setSelectedSemester,
    selectedStatus,
    setSelectedStatus,
    applyFilters,
    resetFilters
  }

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}

// Custom hook for using the context
export const useCourseContext = () => useContext(CourseContext)