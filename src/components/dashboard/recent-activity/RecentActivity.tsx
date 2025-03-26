"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ActivityCard from './ActivityCard';
import ActivityList from './ActivityList';
import ActivityLoadingState from './ActivityLoadingState';
import ActivityErrorState from './ActivityErrorState';
import { useActivityData } from './useActivityData';

/**
 * Main component that displays the user's recent activities
 */
export default function RecentActivity() {
  // Use custom hook to fetch and manage activity data
  const { activities, isLoading, error, refetch } = useActivityData(5);
  
  // Action button for the card header
  const actionButton = (
    <Button variant="ghost" size="sm" className="text-xs">
      View All
    </Button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ActivityCard 
        title="Recent Activity" 
        action={actionButton}
      >
        {isLoading ? (
          <ActivityLoadingState count={4} />
        ) : error ? (
          <ActivityErrorState 
            message={error} 
            onRetry={refetch} 
          />
        ) : (
          <ActivityList activities={activities} />
        )}
      </ActivityCard>
    </motion.div>
  );
}