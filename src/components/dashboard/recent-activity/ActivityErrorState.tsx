// src/components/dashboard/ActivityErrorState.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityErrorStateProps {
  message: string;
  onRetry: () => void;
}

/**
 * Component that renders an error state when activity data fetching fails
 */
const ActivityErrorState: React.FC<ActivityErrorStateProps> = ({ 
  message, 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
};

export default ActivityErrorState;