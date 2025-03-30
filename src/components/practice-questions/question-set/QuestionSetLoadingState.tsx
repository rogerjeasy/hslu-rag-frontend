"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import QuestionSetHeader from './QuestionSetHeader';
import { QuestionSetFilters } from '../QuestionSetFilters';

interface QuestionSetLoadingStateProps {
  courses: { id: string; name: string; color: string }[];
  skeletonCount?: number;
}

export const QuestionSetLoadingState: React.FC<QuestionSetLoadingStateProps> = ({
  courses,
  skeletonCount = 6
}) => {
  // Generate loading skeletons
  const loadingSkeletons = React.useMemo(() => {
    return Array.from({ length: skeletonCount }).map((_, index) => (
      <div key={`skeleton-${index}`} className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    ));
  }, [skeletonCount]);

  return (
    <div className="space-y-6">
      <QuestionSetHeader createButtonDisabled={true} />
      <QuestionSetFilters courses={courses} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingSkeletons}
      </div>
    </div>
  );
};

export default QuestionSetLoadingState;