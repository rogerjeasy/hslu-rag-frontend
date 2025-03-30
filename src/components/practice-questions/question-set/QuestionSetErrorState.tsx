"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { QuestionSetFilters } from '../QuestionSetFilters';
import QuestionSetHeader from './QuestionSetHeader';
import QuestionSetGrid from './QuestionSetGrid';
import { QuestionSetSummary } from '@/types/practice-questions.types';

interface FormattedError {
  code?: number;
  message: string;
  detail?: string;
}

interface QuestionSetErrorStateProps {
  error: FormattedError;
  courses: { id: string; name: string; color: string }[];
  onRetry: () => void;
  onRefresh: () => void;
  createUrl?: string;
  // Update: now accepts null values in the array
  mappedQuestionSets?: (QuestionSetSummary | null)[];
  getCourseInfo: (courseId?: string) => { id: string; name: string; color: string } | null;
}

export const QuestionSetErrorState: React.FC<QuestionSetErrorStateProps> = ({
  error,
  courses,
  onRetry,
  onRefresh,
  createUrl = "/practice-questions/create",
  mappedQuestionSets = [],
  getCourseInfo
}) => {
  const isAuthError = error.code === 401 || error.code === 403;
  const isNotFoundError = error.code === 404;
  
  return (
    <div className="space-y-6">
      <QuestionSetHeader createUrl={createUrl} />
      
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
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 404 Not Found Error UI - More friendly, non-destructive styling */}
      {isNotFoundError && (
        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Resource Not Available
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                <p className="mb-4">
                  {error.message || "The requested practice questions could not be found."}
                </p>
                <p className="mb-4">This might happen if the resource was recently deleted or if there was a synchronization issue.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={createUrl}>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Create New
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Other Errors UI - Destructive styling */}
      {!isAuthError && !isNotFoundError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Practice Questions</AlertTitle>
          <AlertDescription>
            <p className="mb-4">{error.message}</p>
            {process.env.NODE_ENV === 'development' && error.detail && (
              <p className="text-sm opacity-80 mb-4">Details: {error.detail}</p>
            )}
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Still show filters in case they want to change them before retrying */}
      <QuestionSetFilters courses={courses} />
      
      {/* For 404 errors, still show any available question sets rather than hiding everything */}
      {isNotFoundError && mappedQuestionSets.length > 0 && (
        <>
          <div className="mt-8 mb-4">
            <h3 className="text-lg font-medium">Available Question Sets</h3>
          </div>
          <QuestionSetGrid 
            questionSets={mappedQuestionSets}
            courseInfo={getCourseInfo}
          />
        </>
      )}
    </div>
  );
};

export default QuestionSetErrorState;