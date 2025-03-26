// src/components/dashboard/ActivityLoadingState.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityLoadingStateProps {
  count?: number;
}

/**
 * Component that renders a loading skeleton for activities
 */
const ActivityLoadingState: React.FC<ActivityLoadingStateProps> = ({ count = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start px-2 py-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-4 space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityLoadingState;