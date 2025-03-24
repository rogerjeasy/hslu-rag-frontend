import { Suspense } from 'react';
import { Metadata } from 'next';
import KnowledgeGapDetailClientWrapper from '@/components/knowledge-gap/KnowledgeGapDetailClientWrapper';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Knowledge Gap Assessment',
  description: 'View knowledge gap assessment details',
};

function LoadingSkeleton() {
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-start mb-6">
        <Skeleton className="h-10 w-40" />
      </div>
      
      <Skeleton className="h-[600px] w-full rounded-lg" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <KnowledgeGapDetailClientWrapper />
    </Suspense>
  );
}