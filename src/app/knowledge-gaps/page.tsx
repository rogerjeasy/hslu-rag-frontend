import { Suspense } from 'react';
import { Metadata } from 'next';
import KnowledgeGapDashboardWrapper from '@/components/knowledge-gap/KnowledgeGapDashboardWrapper';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Knowledge Gap Assessments',
  description: 'View and manage your knowledge gap assessments',
};

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

export default function KnowledgeGapsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <KnowledgeGapDashboardWrapper />
    </Suspense>
  );
}