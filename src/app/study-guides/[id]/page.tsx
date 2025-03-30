import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import StudyGuideDetailLayout from '@/components/study-guides/StudyGuideDetailLayout';

function LoadingSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      
      <Skeleton className="h-[400px] w-full rounded-lg" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Skeleton className="h-[180px] w-full rounded-lg" />
        <Skeleton className="h-[180px] w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <main className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Suspense fallback={<LoadingSkeleton />}>
        <StudyGuideDetailLayout />
      </Suspense>
    </main>
  );
}