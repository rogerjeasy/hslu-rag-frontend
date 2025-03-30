"use client";

import React, { useEffect, useMemo, useCallback } from 'react';
import { PracticeQuestionsLayout } from '@/components/practice-questions/PracticeQuestionsLayout';
import { QuestionSetList } from '@/components/practice-questions/QuestionSetList';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { useCourseStore } from '@/store/courseStore';
import { useSearchParams } from 'next/navigation';
import { CourseColor } from '@/types/course.types';

export default function PracticeQuestionsHomePage() {
  const { fetchQuestionSets, filterQuestionSets } = usePracticeQuestionsStore();
  const { courses, fetchCourses, isLoading: coursesLoading } = useCourseStore();
  const searchParams = useSearchParams();

  // Helper function to get color with proper typing
  // Moved outside of render to prevent recreation on each render
  const getColorForCourse = useCallback((color: CourseColor): string => {
    const colorMap: Record<CourseColor, string> = {
      slate: "#64748b",
      gray: "#6b7280",
      zinc: "#71717a",
      neutral: "#737373",
      stone: "#78716c",
      red: "#dc2626",
      orange: "#ea580c",
      amber: "#d97706",
      yellow: "#ca8a04",
      lime: "#65a30d",
      green: "#16a34a",
      emerald: "#059669",
      teal: "#0d9488",
      cyan: "#0891b2",
      sky: "#0284c7",
      blue: "#2563eb",
      indigo: "#4f46e5",
      violet: "#7c3aed",
      purple: "#9333ea",
      fuchsia: "#c026d3",
      pink: "#db2777",
      rose: "#e11d48"
    };
    
    return colorMap[color] || "#6b7280";
  }, []);
  
  // Map courses to the expected format for the components
  // Using useMemo to prevent recreation on each render
  const formattedCourses = useMemo(() => {
    return courses.map(course => ({
      id: course.id,
      name: course.name,
      color: course.color ? getColorForCourse(course.color) : "#6b7280"
    }));
  }, [courses, getColorForCourse]);

  // Fetch all required data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using Promise.all to fetch both data sets concurrently
        await Promise.all([
          fetchCourses(),
          fetchQuestionSets()
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    
    fetchData();
  }, [fetchCourses, fetchQuestionSets]);

  // Apply course filter from URL if present
  useEffect(() => {
    const courseId = searchParams.get('course');
    if (courseId) {
      filterQuestionSets('', courseId); // Empty search term, filter by course only
    }
  }, [searchParams, filterQuestionSets]);

  return (
    <PracticeQuestionsLayout courses={formattedCourses}>
      <QuestionSetList courses={formattedCourses} />
    </PracticeQuestionsLayout>
  );
}