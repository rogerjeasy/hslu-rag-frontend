"use client";

import React from 'react';
import { useQuestionSetAdapter, mapToQuestionSetSummary, StoreQuestionSet } from '@/hooks/useQuestionSetAdapter';
import QuestionSetHeader from './question-set/QuestionSetHeader';
import QuestionSetSearchBar from './question-set/QuestionSetSearchBar';
import { QuestionSetFilters } from './QuestionSetFilters';
import QuestionSetGrid from './question-set/QuestionSetGrid';
import QuestionSetEmptyState from './question-set/QuestionSetEmptyState';
import QuestionSetLoadingState from './question-set/QuestionSetLoadingState';
import QuestionSetErrorState from './question-set/QuestionSetErrorState';
import { QuestionSetSummary } from '@/types/practice-questions.types';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';

interface QuestionSetListProps {
  courses: { id: string; name: string; color: string }[];
}

export function QuestionSetList({ courses }: QuestionSetListProps) {
  // Use adapter to access store functionality
  const {
    questionSets,
    isLoading,
    error,
    fetchQuestionSets,
    clearError,
    courseFilter,
    difficultyFilter,
    typeFilter
  } = useQuestionSetAdapter();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [initialFetchDone, setInitialFetchDone] = React.useState(false);

  // Get direct access to the store for filtering
  const filterQuestionSets = usePracticeQuestionsStore(state => state.filterQuestionSets);

  // Stable reference to courses to prevent unnecessary re-renders
  const coursesRef = React.useRef(courses);
  React.useEffect(() => {
    coursesRef.current = courses;
  }, [courses]);

  // Memoize the course lookup function with a stable reference
  const getCourseInfo = React.useCallback((courseId?: string) => {
    if (!courseId) return null;
    return coursesRef.current.find(course => course.id === courseId) || null;
  }, []); // Empty dependency array since we're using ref

  // Initial data load - only runs once on component mount
  React.useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (!initialFetchDone && !isRefreshing) {
        try {
          setIsRefreshing(true);
          await fetchQuestionSets(courseFilter || undefined);
          if (isMounted) {
            setInitialFetchDone(true);
          }
        } catch (error) {
          if (isMounted) {
            console.error('Failed to fetch initial question sets:', error);
          }
        } finally {
          if (isMounted) {
            setIsRefreshing(false);
          }
        }
      }
    };
    
    loadInitialData();
    
    return () => {
      isMounted = false;
    };
  }, [fetchQuestionSets, initialFetchDone, isRefreshing, courseFilter]);

  React.useEffect(() => {
    // Only apply filters if we have data and the initial fetch is done
    if (initialFetchDone && questionSets.length > 0) {
      // Based on your store implementation, filterQuestionSets only accepts searchTerm and courseId
      filterQuestionSets(searchTerm, courseFilter || undefined);
      
      // If you need to filter by difficulty and type, you'll need to implement that here
      // or update your store's filterQuestionSets function to accept these arguments
    }
  }, [searchTerm, courseFilter, difficultyFilter, typeFilter, initialFetchDone, questionSets.length, filterQuestionSets]);
  
  // Handle refresh button click
  const handleRefresh = React.useCallback(async () => {
    // Set a timeout to ensure isRefreshing is reset even if the fetch operation fails
    let timeoutId: NodeJS.Timeout;
    
    setIsRefreshing(true);
    
    // Set a safety timeout to ensure the spinner stops after a maximum time
    timeoutId = setTimeout(() => {
      setIsRefreshing(false);
    }, 10000); // 10 seconds max for the refresh operation
    
    try {
      await fetchQuestionSets(courseFilter || undefined);
      
      // Clear the safety timeout if the fetch succeeds
      clearTimeout(timeoutId);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Error refreshing question sets:", error);
      
      // Clear the safety timeout if there's an error
      clearTimeout(timeoutId);
      setIsRefreshing(false);
      
      // Optionally show a toast or error message here
    }
  }, [fetchQuestionSets, courseFilter]);

  // Handle retry after error
  const handleRetry = React.useCallback(() => {
    clearError();
    setIsRefreshing(true);
    fetchQuestionSets(courseFilter || undefined)
      .finally(() => setIsRefreshing(false));
  }, [clearError, fetchQuestionSets, courseFilter]);

  // Handle search term changes
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Pre-map the question sets once to avoid repeated mapping in the render function
  const mappedQuestionSets = React.useMemo(() => {
    if (!Array.isArray(questionSets) || questionSets.length === 0) {
      return [];
    }
    
    return questionSets
      .filter(Boolean)
      .map(questionSet => {
        try {
          return mapToQuestionSetSummary(questionSet as StoreQuestionSet);
        } catch (err) {
          console.error("Error mapping question set:", err);
          return null;
        }
      })
      .filter(Boolean) as (QuestionSetSummary | null)[];
  }, [questionSets]);

  // Memoized props for child components to prevent unnecessary re-renders
  const errorStateProps = React.useMemo(() => ({
    courses,
    onRetry: handleRetry,
    onRefresh: handleRefresh,
    mappedQuestionSets,
    getCourseInfo
  }), [courses, handleRetry, handleRefresh, mappedQuestionSets, getCourseInfo]);

  const searchBarProps = React.useMemo(() => ({
    searchTerm,
    onSearchChange: handleSearchChange,
    onRefresh: handleRefresh,
    isRefreshing
  }), [searchTerm, handleSearchChange, handleRefresh, isRefreshing]);

  const emptyStateProps = React.useMemo(() => ({
    searchTerm,
    courseFilter,
    difficultyFilter,
    typeFilter
  }), [searchTerm, courseFilter, difficultyFilter, typeFilter]);

  // Render loading state
  if ((isLoading || !initialFetchDone) && !isRefreshing && (!questionSets || questionSets.length === 0)) {
    return <QuestionSetLoadingState courses={courses} />;
  }

  // Render error state
  if (error && !isRefreshing) {
    return (
      <QuestionSetErrorState 
        error={error}
        {...errorStateProps}
      />
    );
  }

  // Render main content
  return (
    <div className="space-y-6">
      {/* Header */}
      <QuestionSetHeader />
      
      {/* Search and filters */}
      <div className="space-y-6">
        <QuestionSetSearchBar {...searchBarProps} />
        <QuestionSetFilters courses={courses} />
      </div>
      
      {/* Display question sets or empty state */}
      {mappedQuestionSets.length > 0 ? (
        <QuestionSetGrid 
          questionSets={mappedQuestionSets}
          courseInfo={getCourseInfo}
        />
      ) : (
        <QuestionSetEmptyState {...emptyStateProps} />
      )}
    </div>
  );
}

export default React.memo(QuestionSetList);