'use client';

import React from 'react';
import PracticeQuestionsPage from './PracticeQuestionsPage';
import { useParams } from 'next/navigation';

export default function SimplePracticeQuestions() {
  // Get the id parameter from the URL
  const params = useParams();
  const id = params?.id as string;

  // If no id is found, provide a fallback behavior
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>No question set ID provided. Please select a practice question set.</p>
        </div>
      </div>
    );
  }

  // Pass the id to the PracticeQuestionSetPage component
  return <PracticeQuestionsPage params={{ id }} />;
}