"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { History } from 'lucide-react';

export function HistoryLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 className="text-2xl font-bold tracking-tight">Practice History</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>
      
      {/* Tabs skeleton */}
      <div className="w-full max-w-md overflow-hidden">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      
      {/* Filters skeleton */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-[180px] rounded-md" />
          <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
        </div>
      </div>
      
      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-8 w-12 rounded-full" />
            </div>
            
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            
            <div className="flex justify-between pt-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}