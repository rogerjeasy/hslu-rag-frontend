"use client";
import React from 'react';
import { QuestionSetCard } from './QuestionSetCard';
import { Button } from '@/components/ui/button';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { Plus, RefreshCw, Search, AlertCircle, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { QuestionSetFilters } from './QuestionSetFilters';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QuestionSetListProps {
  courses: { id: string; name: string; color: string }[];
}

export function QuestionSetList({ courses }: QuestionSetListProps) {
  const {
    questionSets,
    isLoading,
    error,
    fetchQuestionSets,
    courseFilter,
    difficultyFilter,
    typeFilter,
    clearError
  } = usePracticeQuestionsStore();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Load question sets on component mount
  React.useEffect(() => {
    fetchQuestionSets(courseFilter || undefined);
  }, [fetchQuestionSets, courseFilter]);

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchQuestionSets(courseFilter || undefined);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle retry after error
  const handleRetry = () => {
    clearError();
    fetchQuestionSets(courseFilter || undefined);
  };

  // Filter the question sets based on search and filters
  const filteredQuestionSets = React.useMemo(() => {
    return questionSets.filter(set => {
      // Apply search filter
      if (searchTerm && !set.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply difficulty filter
      if (difficultyFilter && set.difficulty !== difficultyFilter) {
        return false;
      }
      
      // Apply question type filter
      if (typeFilter && !set.types.includes(typeFilter)) {
        return false;
      }
      
      return true;
    });
  }, [questionSets, searchTerm, difficultyFilter, typeFilter]);

  // Get the course info for each question set
  const getCourseInfo = (courseId: string) => {
    return courses.find(course => course.id === courseId) || null;
  };

  // Render loading skeletons
  if (isLoading && !isRefreshing && questionSets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Practice Questions</h2>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
        
        <QuestionSetFilters courses={courses} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle different error types with customized UI
  if (error && !isRefreshing) {
    const isAuthError = error.code === 401 || error.code === 403;
    const isNotFoundError = error.code === 404;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Practice Questions</h2>
          <Button asChild>
            <Link href="/practice-questions/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Link>
          </Button>
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
                  <Button variant="outline" size="sm" onClick={handleRetry}>
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
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/practice-questions/create">
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
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Still show filters in case they want to change them before retrying */}
        <QuestionSetFilters courses={courses} />
        
        {/* For 404 errors, still show any available question sets rather than hiding everything */}
        {isNotFoundError && questionSets.length > 0 && (
          <>
            <div className="mt-8 mb-4">
              <h3 className="text-lg font-medium">Available Question Sets</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuestionSets.map((questionSet) => (
                <QuestionSetCard
                  key={questionSet.id}
                  questionSet={questionSet}
                  courseInfo={getCourseInfo(questionSet.courseId)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Practice Questions</h2>
        <Button asChild>
          <Link href="/practice-questions/create">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Link>
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search practice questions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        
        <QuestionSetFilters courses={courses} />
      </div>
      
      {/* Display question sets or empty state */}
      {filteredQuestionSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestionSets.map((questionSet) => (
            <QuestionSetCard
              key={questionSet.id}
              questionSet={questionSet}
              courseInfo={getCourseInfo(questionSet.courseId)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Practice Questions Found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {searchTerm || courseFilter || difficultyFilter || typeFilter
              ? "No practice questions match your current filters. Try adjusting your search criteria."
              : "You haven't created any practice question sets yet."}
          </p>
          <Button asChild>
            <Link href="/practice-questions/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New Practice Questions
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}