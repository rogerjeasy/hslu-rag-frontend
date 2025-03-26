"use client";
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity } from './ActivityTypes';

interface ActivityItemProps {
  activity: Activity;
}

/**
 * Component that renders a single activity item
 */
const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div 
      className="flex items-start px-2 py-2 rounded-lg hover:bg-muted transition-colors"
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${activity.color}`}>
        {activity.icon}
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium">{activity.title}</p>
          {activity.duration && (
            <Badge variant="outline" className="text-xs">
              {activity.duration}
            </Badge>
          )}
          {activity.score !== undefined && (
            <Badge variant="outline" className={`text-xs ${
              activity.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              activity.score >= 60 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              Score: {activity.score}%
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;