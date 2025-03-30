"use client";

import React from 'react';
import { usePracticeQuestionsStore } from "@/store/usePracticeQuestionsStore";
import { DifficultyLevel, QuestionTypeEnum, QuestionSetSummary } from '@/types/practice-questions.types';

// Helper type for mapping store question set to QuestionSetSummary
export interface StoreQuestionSet {
  id: string;
  topic: string;
  difficulty: DifficultyLevel;
  description?: string;
  courseId?: string;
  createdAt: number;
  questionCount: number;
  questions: Array<{ type: string }>;
}

// Interface for the error that might come from the store
export interface StoreError {
  code?: number;
  message?: string;
  detail?: string;
}

// Formatted error for consistent handling
export interface FormattedError {
  code?: number;
  message: string;
  detail?: string;
}

// Interface for the store returned by usePracticeQuestionsStore
interface PracticeQuestionsStore {
  questionSets: StoreQuestionSet[];
  filteredSets?: StoreQuestionSet[];
  isLoading: boolean;
  error: string | StoreError | null;
  fetchQuestionSets: (courseId?: string) => Promise<void>;
  clearError?: () => void;
  courseFilter?: string | null;
  difficultyFilter?: DifficultyLevel | null;
  typeFilter?: QuestionTypeEnum | null;
}

/**
 * Maps a store question set to the QuestionSetSummary type expected by QuestionSetCard
 */
export const mapToQuestionSetSummary = (questionSet: StoreQuestionSet): QuestionSetSummary => {
  if (!questionSet) {
    return {
      id: '',
      title: '',
      description: '',
      difficulty: DifficultyLevel.BASIC,
      courseId: '',
      createdAt: Date.now(),
      questionCount: 0,
      types: []
    };
  }
  
  const questions = questionSet?.questions || [];
  // Extract unique question types from questions
  const uniqueTypes = Array.from(new Set(
    questions.map(q => (q && q.type) || '')
  )).filter(type => type !== '');
  
  return {
    id: questionSet.id,
    title: questionSet.topic,
    description: questionSet.description || '', 
    difficulty: questionSet?.difficulty || DifficultyLevel.BASIC,
    courseId: questionSet.courseId || '', 
    createdAt: questionSet?.createdAt || Date.now(), 
    questionCount: questionSet?.questionCount || questions.length,
    types: uniqueTypes.map(typeStr => {
      return typeStr as unknown as QuestionTypeEnum;
    })
  };
};

/**
 * Custom hook that adapts the practice questions store for use in components
 */
export function useQuestionSetAdapter() {
  const store = usePracticeQuestionsStore() as PracticeQuestionsStore;
  
  // Get values from the store
  const {
    questionSets,
    filteredSets,
    isLoading,
    error,
    fetchQuestionSets: storeMethod
  } = store;

  // Format error to ensure consistent structure
  const formattedError = React.useMemo(() => {
    if (!error) return null;
    
    return (typeof error === 'object' && error !== null)
      ? {
          code: 'code' in error ? (error as any).code : undefined,
          message: 'message' in error 
            ? (error as any).message 
            : (typeof error === 'string' ? error : 'An error occurred'),
          detail: 'detail' in error ? (error as any).detail : undefined
        }
      : { message: String(error) };
  }, [error]);

  // Fetch question sets with proper error handling
  const fetchQuestionSets = React.useCallback(async (courseId?: string) => {
    try {
      await storeMethod(courseId);
    } catch (err) {
      console.error('Error in adapter fetchQuestionSets:', err);
    }
  }, [storeMethod]);

  // Clear error in the store if it has a clearError method
  const clearError = React.useCallback(() => {
    if (store && 'clearError' in store && typeof store.clearError === 'function') {
      store.clearError();
    }
  }, [store]);

  // Access typed properties with safe defaults
  const courseFilter = store.courseFilter || null;
  const difficultyFilter = store.difficultyFilter || null;
  const typeFilter = store.typeFilter || null;

  // Use memoized values to prevent infinite loops
  const safeQuestionSets = React.useMemo(() => 
    (filteredSets && filteredSets.length > 0 ? filteredSets : questionSets) || [],
  [filteredSets, questionSets]);

  return {
    questionSets: safeQuestionSets,
    isLoading,
    error: formattedError,
    fetchQuestionSets,
    clearError,
    courseFilter,
    difficultyFilter,
    typeFilter
  };
}

export default useQuestionSetAdapter;