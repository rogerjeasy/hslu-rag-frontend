"use client";

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, RefreshCw, History } from 'lucide-react';
import Link from 'next/link';

interface HistoryErrorProps {
  error: { 
    message: string; 
    code: number; 
    detail?: string 
  };
  onRetry: () => void;
}

export function HistoryError({ error, onRetry }: HistoryErrorProps) {
  const isAuthError = error.code === 401 || error.code === 403;
  const isNotFoundError = error.code === 404;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 className="text-2xl font-bold tracking-tight">Practice History</h2>
        </div>
      </div>
      
      {/* Auth Error UI */}
      {isAuthError && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Authentication Error
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                <p className="mb-4">{error.message}</p>
                {process.env.NODE_ENV === 'development' && error.detail && (
                  <p className="text-sm opacity-80 mb-4">Details: {error.detail}</p>
                )}
                <Button variant="outline" size="sm" onClick={onRetry} className="bg-white dark:bg-yellow-900">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 404 Not Found Error UI */}
      {isNotFoundError && (
        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                History Not Available
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                <p className="mb-4">
                  {error.message || "The practice history could not be loaded."}
                </p>
                <p className="mb-4">This might happen if there was a synchronization issue with the server.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={onRetry} className="bg-white dark:bg-blue-900">
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" asChild className="bg-white dark:bg-blue-900">
                    <Link href="/practice-questions">
                      Back to Question Sets
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Other Errors UI */}
      {!isAuthError && !isNotFoundError && (
        <Alert variant="destructive" className="animate-in fade-in-50 duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Practice History</AlertTitle>
          <AlertDescription>
            <p className="mb-4">{error.message}</p>
            {process.env.NODE_ENV === 'development' && error.detail && (
              <p className="text-sm opacity-80 mb-4">Details: {error.detail}</p>
            )}
            <Button variant="outline" size="sm" onClick={onRetry} className="bg-white/10">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}