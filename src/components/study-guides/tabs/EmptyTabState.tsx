// /components/study-guides/tabs/EmptyTabState.tsx
'use client';

import { BookOpen } from 'lucide-react';

interface EmptyTabStateProps {
  title: string;
  description: string;
}

export const EmptyTabState = ({ title, description }: EmptyTabStateProps) => {
  return (
    <div className="text-center py-12 px-4 border border-dashed rounded-lg bg-blue-50/30 w-full">
      <BookOpen className="mx-auto h-12 w-12 text-blue-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">{description}</p>
    </div>
  );
};

export default EmptyTabState;