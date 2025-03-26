// src/components/dashboard/ActivityEmptyState.tsx
import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Component that renders an empty state when no activities are available
 */
const ActivityEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Clock className="h-10 w-10 text-muted-foreground mb-3" />
      <p className="text-sm font-medium mb-1">No activity recorded yet</p>
      <p className="text-xs text-muted-foreground">
        Your learning activities will appear here as you use the platform
      </p>
    </div>
  );
};

export default ActivityEmptyState;