// src/components/dashboard/useActivityData.ts
import { useState, useEffect, useCallback } from 'react';
import { Activity } from './ActivityTypes';
import { statisticsService } from '@/services/statistics.service';
import { generateActivitiesFromStats, sortActivitiesByTime } from './ActivityUtils';

/**
 * Custom hook to fetch and manage activity data
 */
export const useActivityData = (limit: number = 5) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch user statistics directly from the API service
      const userStats = await statisticsService.getMyStatistics();
      
      // Generate activities from API data
      const generatedActivities = generateActivitiesFromStats(userStats);
      
      // Filter out any undefined or null activities (defensive programming)
      const validActivities = generatedActivities.filter(activity => 
        activity && activity.id && activity.title
      );
      
      // Sort activities by time (most recent first)
      const sortedActivities = sortActivitiesByTime(validActivities);
      
      // Take only the most recent activities
      setActivities(sortedActivities.slice(0, limit));
      
      // Log if no activities found
      if (validActivities.length === 0) {
        console.log('No activity data available for this user');
      }
    } catch (err) {
      console.error('Failed to load activity data:', err);
      setError('Unable to load your recent activity. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    error,
    refetch: fetchActivities
  };
};