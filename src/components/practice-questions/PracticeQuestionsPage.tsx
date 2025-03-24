"use client";
import React from 'react';
import { PracticeQuestionsLayout } from '@/components/practice-questions/PracticeQuestionsLayout';
import { QuestionSetList } from '@/components/practice-questions/QuestionSetList';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { useSearchParams } from 'next/navigation';

// Mock course data - in a real app, you would fetch this from your API
const mockCourses = [
  { id: "course-1", name: "Data Science Fundamentals", color: "#4f46e5" },
  { id: "course-2", name: "Machine Learning", color: "#0891b2" },
  { id: "course-3", name: "Applied Statistics", color: "#16a34a" },
  { id: "course-4", name: "Information Visualization", color: "#ea580c" }
];

export default function PracticeQuestionsPage() {
  const { setCourseFilter } = usePracticeQuestionsStore();
  const searchParams = useSearchParams();
  
  // Get the course filter from the URL if present
  React.useEffect(() => {
    const courseId = searchParams.get('course');
    if (courseId) {
      setCourseFilter(courseId);
    }
  }, [searchParams, setCourseFilter]);
  
  return (
    <PracticeQuestionsLayout courses={mockCourses}>
      <QuestionSetList courses={mockCourses} />
    </PracticeQuestionsLayout>
  );
}