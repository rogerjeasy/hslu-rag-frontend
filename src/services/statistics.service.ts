// src/services/statistics.service.ts
import { api, handleError } from '@/helpers/api';
import { 
  PublicStatistics, 
  PlatformStatistics, 
  CourseStatistics, 
  UserStatistics, 
  TimeSeriesStatistic 
} from '@/types/statistics.types';

class StatisticsService {
  /**
   * Fetch public platform statistics
   */
  async getPublicStatistics(): Promise<PublicStatistics> {
    try {
      const response = await api.get('/statistics/public');
      return response.data.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch public statistics: ${errorMessage}`);
    }
  }

  /**
   * Fetch comprehensive platform-wide statistics (admin only)
   */
  async getPlatformStatistics(): Promise<PlatformStatistics> {
    try {
      const response = await api.get('/statistics/platform');
      return response.data.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch platform statistics: ${errorMessage}`);
    }
  }

  /**
   * Fetch statistics for a specific course (admin/instructor only)
   */
  async getCourseStatistics(courseId: string): Promise<CourseStatistics> {
    try {
      const response = await api.get(`/statistics/course/${courseId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch course statistics: ${errorMessage}`);
    }
  }

  /**
   * Fetch statistics for the current user
   */
  async getMyStatistics(): Promise<UserStatistics> {
    try {
      const response = await api.get('/statistics/user');
      return response.data.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch user statistics: ${errorMessage}`);
    }
  }

  /**
   * Fetch statistics for a specific user (admin only)
   */
  async getUserStatistics(userId: string): Promise<UserStatistics> {
    try {
      const response = await api.get(`/statistics/user/${userId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch user statistics: ${errorMessage}`);
    }
  }

  /**
   * Fetch time series statistics for a specific metric (admin only)
   */
  async getTimeSeriesStatistics(metricName: string): Promise<TimeSeriesStatistic> {
    try {
      const response = await api.get(`/statistics/timeseries/${metricName}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch time series statistics: ${errorMessage}`);
    }
  }

  /**
   * Manually trigger statistics calculation (admin only)
   */
  async calculateStatistics(): Promise<void> {
    try {
      await api.post('/statistics/calculate');
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to calculate statistics: ${errorMessage}`);
    }
  }
}

// Export a singleton instance
export const statisticsService = new StatisticsService();