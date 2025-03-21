// src/store/courseStore.ts
import { create } from 'zustand'
import { Course } from '@/components/application-management/courses/CourseContext'

interface CourseStore {
  courses: Course[]
  isLoading: boolean
  fetchCourses: () => Promise<void>
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'materialsCount'>) => Promise<Course>
  updateCourse: (id: string, data: Partial<Course>) => Promise<Course>
  deleteCourse: (id: string) => Promise<void>
}

// Mock data - this would normally come from an API
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
  // Additional courses would be here
]

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  isLoading: false,
  
  fetchCourses: async () => {
    set({ isLoading: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set({ 
        courses: mockCourses,
        isLoading: false
      })
    } catch (error) {
      console.error('Error fetching courses:', error)
      set({ isLoading: false })
    }
  },
  
  addCourse: async (courseData) => {
    set({ isLoading: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCourse: Course = {
        id: Date.now().toString(),
        ...courseData,
        materialsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      set(state => ({
        courses: [...state.courses, newCourse],
        isLoading: false
      }))
      
      return newCourse
    } catch (error) {
      console.error('Error adding course:', error)
      set({ isLoading: false })
      throw error
    }
  },
  
  updateCourse: async (id, data) => {
    set({ isLoading: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedCourses = get().courses.map(course => 
        course.id === id 
          ? { 
              ...course, 
              ...data, 
              updatedAt: new Date().toISOString() 
            } 
          : course
      )
      
      set({ 
        courses: updatedCourses,
        isLoading: false
      })
      
      return updatedCourses.find(course => course.id === id) as Course
    } catch (error) {
      console.error('Error updating course:', error)
      set({ isLoading: false })
      throw error
    }
  },
  
  deleteCourse: async (id) => {
    set({ isLoading: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(state => ({
        courses: state.courses.filter(course => course.id !== id),
        isLoading: false
      }))
    } catch (error) {
      console.error('Error deleting course:', error)
      set({ isLoading: false })
      throw error
    }
  }
}))