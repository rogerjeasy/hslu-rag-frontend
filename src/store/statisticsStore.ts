// src/store/statisticsStore.ts
import { create } from 'zustand';
import { 
  PublicStatistics, 
  PlatformStatistics, 
  CourseStatistics, 
  UserStatistics, 
  TimeSeriesStatistic 
} from '@/types/statistics.types';
import { statisticsService } from '@/services/statistics.service';

interface StatisticsState {
  // Public Statistics
  publicStats: PublicStatistics | null;
  
  // Platform Statistics (admin only)
  platformStats: PlatformStatistics | null;
  
  // Course Statistics
  courseStats: { [courseId: string]: CourseStatistics };
  
  // User Statistics
  myStats: UserStatistics | null;
  userStats: { [userId: string]: UserStatistics };
  
  // Time Series Statistics
  timeSeriesStats: { [metricName: string]: TimeSeriesStatistic };
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPublicStatistics: () => Promise<void>;
  fetchPlatformStatistics: () => Promise<void>;
  fetchCourseStatistics: (courseId: string) => Promise<CourseStatistics>;
  fetchMyStatistics: () => Promise<void>;
  fetchUserStatistics: (userId: string) => Promise<UserStatistics>;
  fetchTimeSeriesStatistics: (metricName: string) => Promise<TimeSeriesStatistic>;
  
  // Admin-only actions
  calculateStatistics: () => Promise<void>;
  
  // Utility
  reset: () => void;
}

export const useStatisticsStore = create<StatisticsState>((set) => ({
  // Initial state
  publicStats: null,
  platformStats: null,
  courseStats: {},
  myStats: null,
  userStats: {},
  timeSeriesStats: {},
  isLoading: false,
  error: null,
  
  // Fetch public statistics
  fetchPublicStatistics: async () => {
    set({ isLoading: true, error: null });
    try {
      const publicStats = await statisticsService.getPublicStatistics();
      set({ publicStats, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Fetch platform-wide statistics (admin only)
  fetchPlatformStatistics: async () => {
    set({ isLoading: true, error: null });
    try {
      const platformStats = await statisticsService.getPlatformStatistics();
      set({ platformStats, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Fetch course statistics
  fetchCourseStatistics: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const courseStats = await statisticsService.getCourseStatistics(courseId);
      set(state => ({
        courseStats: { 
          ...state.courseStats, 
          [courseId]: courseStats 
        },
        isLoading: false
      }));
      return courseStats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Fetch current user's statistics
  fetchMyStatistics: async () => {
    set({ isLoading: true, error: null });
    try {
      const myStats = await statisticsService.getMyStatistics();
      set({ myStats, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Fetch specific user's statistics
  fetchUserStatistics: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const userStats = await statisticsService.getUserStatistics(userId);
      set(state => ({
        userStats: { 
          ...state.userStats, 
          [userId]: userStats 
        },
        isLoading: false
      }));
      return userStats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Fetch time series statistics
  fetchTimeSeriesStatistics: async (metricName) => {
    set({ isLoading: true, error: null });
    try {
      const timeSeriesStats = await statisticsService.getTimeSeriesStatistics(metricName);
      set(state => ({
        timeSeriesStats: { 
          ...state.timeSeriesStats, 
          [metricName]: timeSeriesStats 
        },
        isLoading: false
      }));
      return timeSeriesStats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Manually calculate statistics (admin only)
  calculateStatistics: async () => {
    set({ isLoading: true, error: null });
    try {
      await statisticsService.calculateStatistics();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Reset all statistics
  reset: () => {
    set({
      publicStats: null,
      platformStats: null,
      courseStats: {},
      myStats: null,
      userStats: {},
      timeSeriesStats: {},
      isLoading: false,
      error: null
    });
  }
}));