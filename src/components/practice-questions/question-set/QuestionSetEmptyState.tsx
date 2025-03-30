"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { DifficultyLevel, QuestionTypeEnum } from '@/types/practice-questions.types';

interface QuestionSetEmptyStateProps {
  searchTerm?: string;
  courseFilter?: string | null;
  difficultyFilter?: DifficultyLevel | null;
  typeFilter?: QuestionTypeEnum | null;
  createUrl?: string;
}

export const QuestionSetEmptyState: React.FC<QuestionSetEmptyStateProps> = ({
  searchTerm,
  courseFilter,
  difficultyFilter,
  typeFilter,
  createUrl = "/practice-questions/create"
}) => {
  const hasFilters = !!searchTerm || !!courseFilter || !!difficultyFilter || !!typeFilter;
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Practice Questions Found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {hasFilters
          ? "No practice questions match your current filters. Try adjusting your search criteria."
          : "You haven't created any practice question sets yet."}
      </p>
      <Button asChild>
        <Link href={createUrl}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Practice Questions
        </Link>
      </Button>
    </div>
  );
};

export default QuestionSetEmptyState;