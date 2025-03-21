// src/services/course.service.ts
import { api, handleError } from '@/helpers/api';
import { Course, CourseCreateDTO, CourseUpdateDTO } from '@/types/course.types';

class CourseService {
  /**
   * Fetch all courses available to the current user
   */
  async getCourses(): Promise<Course[]> {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch courses: ${errorMessage}`);
    }
  }

  /**
   * Fetch a specific course by ID
   */
  async getCourse(courseId: string): Promise<Course> {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch course details: ${errorMessage}`);
    }
  }

  /**
   * Create a new course
   */
  async createCourse(courseData: CourseCreateDTO): Promise<Course> {
    try {
      const response = await api.post('/courses/', courseData);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to create course: ${errorMessage}`);
    }
  }

  /**
   * Update an existing course
   */
  async updateCourse(courseId: string, courseData: CourseUpdateDTO): Promise<Course> {
    try {
      const response = await api.put(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to update course: ${errorMessage}`);
    }
  }

  /**
   * Delete a course
   */
  async deleteCourse(courseId: string): Promise<void> {
    try {
      await api.delete(`/courses/${courseId}`);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete course: ${errorMessage}`);
    }
  }

  /**
   * Enroll the current user in a course
   */
  async enrollInCourse(courseId: string): Promise<void> {
    try {
      await api.post(`/courses/${courseId}/enroll`);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to enroll in course: ${errorMessage}`);
    }
  }

  /**
   * Unenroll the current user from a course
   */
  async unenrollFromCourse(courseId: string): Promise<void> {
    try {
      await api.post(`/courses/${courseId}/unenroll`);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to unenroll from course: ${errorMessage}`);
    }
  }
  
  /**
   * Get all available semesters for filtering
   */
  async getSemesters(): Promise<string[]> {
    try {
      const response = await api.get('/courses/semesters');
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch semesters: ${errorMessage}`);
    }
  }
  
  /**
   * Get course statistics
   */
  async getCourseStats(): Promise<{
    totalCourses: number;
    activeCourses: number; 
    archivedCourses: number;
    averageCredits: number;
  }> {
    try {
      const response = await api.get('/courses/stats');
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch course statistics: ${errorMessage}`);
    }
  }
}

// Export a singleton instance
export const courseService = new CourseService();