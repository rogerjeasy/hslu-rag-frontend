// src/store/courseStore.ts
import { create } from 'zustand';
import { Course, CourseCreateDTO, CourseUpdateDTO } from '@/types/course.types';
import { courseService } from '@/services/course.service';

interface CourseState {
  // Data
  courses: Course[];
  filteredCourses: Course[];
  isLoading: boolean;
  error: string | null;
  
  // Filter state
  searchTerm: string;
  selectedSemester: string | null;
  selectedStatus: string | null;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedSemester: (semester: string | null) => void;
  setSelectedStatus: (status: string | null) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  
  // Data actions
  fetchCourses: () => Promise<void>;
  getCourse: (id: string) => Promise<Course>;
  addCourse: (course: CourseCreateDTO) => Promise<Course>;
  updateCourse: (id: string, data: CourseUpdateDTO) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
  enrollInCourse: (id: string) => Promise<void>;
  unenrollFromCourse: (id: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  // Initial state
  courses: [],
  filteredCourses: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedSemester: null,
  selectedStatus: null,
  
  // Filter setters
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },
  
  setSelectedSemester: (semester) => {
    set({ selectedSemester: semester });
    get().applyFilters();
  },
  
  setSelectedStatus: (status) => {
    set({ selectedStatus: status });
    get().applyFilters();
  },
  
  // Filter actions
  applyFilters: () => {
    const { courses, searchTerm, selectedSemester, selectedStatus } = get();
    let result = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        course => 
          course.name.toLowerCase().includes(lowerSearchTerm) ||
          course.code.toLowerCase().includes(lowerSearchTerm) ||
          course.description.toLowerCase().includes(lowerSearchTerm) ||
          course.instructor.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply semester filter
    if (selectedSemester) {
      result = result.filter(course => course.semester === selectedSemester);
    }
    
    // Apply status filter
    if (selectedStatus) {
      result = result.filter(course => course.status === selectedStatus);
    }
    
    set({ filteredCourses: result });
  },
  
  resetFilters: () => {
    set({ 
      searchTerm: '',
      selectedSemester: null,
      selectedStatus: null,
      filteredCourses: get().courses
    });
  },
  
  // Data actions
  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const courses = await courseService.getCourses();
      set({ 
        courses, 
        filteredCourses: courses, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  getCourse: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const course = await courseService.getCourse(id);
      return course;
    } catch (error) {
      console.error('Error fetching course:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  addCourse: async (courseData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newCourse = await courseService.createCourse(courseData);
      
      set(state => {
        const updatedCourses = [...state.courses, newCourse];
        return {
          courses: updatedCourses,
          filteredCourses: updatedCourses, // Reset to showing all courses with the new one
          isLoading: false
        };
      });
      
      // Re-apply any active filters
      get().applyFilters();
      
      return newCourse;
    } catch (error) {
      console.error('Error adding course:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateCourse: async (id, data) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedCourse = await courseService.updateCourse(id, data);
      
      set(state => {
        const updatedCourses = state.courses.map(course => 
          course.id === id ? updatedCourse : course
        );
        
        return {
          courses: updatedCourses,
          isLoading: false
        };
      });
      
      // Re-apply filters to update filteredCourses as well
      get().applyFilters();
      
      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteCourse: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await courseService.deleteCourse(id);
      
      set(state => {
        const updatedCourses = state.courses.filter(course => course.id !== id);
        
        return {
          courses: updatedCourses,
          isLoading: false
        };
      });
      
      // Re-apply filters to update filteredCourses as well
      get().applyFilters();
      
    } catch (error) {
      console.error('Error deleting course:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  enrollInCourse: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await courseService.enrollInCourse(id);
      // We might want to update the course status in the store here if enrollment changes any course properties
      set({ isLoading: false });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  unenrollFromCourse: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await courseService.unenrollFromCourse(id);
      // We might want to update the course status in the store here if unenrollment changes any course properties
      set({ isLoading: false });
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  }
}));