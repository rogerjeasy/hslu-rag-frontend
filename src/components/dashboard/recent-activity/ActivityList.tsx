// src/components/dashboard/ActivityList.tsx
import React from 'react';
import { Activity } from './ActivityTypes';
import ActivityItem from './ActivityItem';
import ActivityEmptyState from './ActivityEmptyState';

interface ActivityListProps {
  activities: Activity[];
}

/**
 * Component that renders a list of activities or an empty state
 */
const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  if (activities.length === 0) {
    return <ActivityEmptyState />;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityList;