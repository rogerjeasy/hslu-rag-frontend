"use client";

import React from 'react';
import { QuestionSetCard } from '../QuestionSetCard';
import { QuestionSetSummary } from '@/types/practice-questions.types';
import { ScrollArea } from '@/components/ui/scroll-area'; // Use your fixed ScrollArea component

interface QuestionSetGridProps {
  questionSets: (QuestionSetSummary | null)[];
  courseInfo: (courseId?: string) => { id: string; name: string; color: string } | null;
  maxHeight?: string;
}

export const QuestionSetGrid: React.FC<QuestionSetGridProps> = React.memo(({
  questionSets,
  courseInfo,
  maxHeight
}) => {
  if (!questionSets || questionSets.length === 0) {
    return null;
  }
  
  // Check if we need scrolling (only apply ScrollArea if maxHeight is provided)
  const needsScrolling = !!maxHeight && questionSets.length > 3;
  
  // Memoize the cards to prevent unnecessary re-renders
  const cards = React.useMemo(() => {
    return questionSets.map((questionSet, index) => {
      if (!questionSet) return null;
      
      return (
        <QuestionSetCard
          key={questionSet.id || `question-set-${index}`}
          questionSet={questionSet}
          courseInfo={courseInfo(questionSet.courseId)}
        />
      );
    });
  }, [questionSets, courseInfo]);
  
  // Render the grid with or without ScrollArea
  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards}
    </div>
  );
  
  // Only use ScrollArea when needed
  if (needsScrolling) {
    return (
      <div className="relative" style={{ maxHeight }}>
        <ScrollArea className="h-full w-full">
          {content}
        </ScrollArea>
      </div>
    );
  }
  
  return content;
});

QuestionSetGrid.displayName = 'QuestionSetGrid';

export default QuestionSetGrid;