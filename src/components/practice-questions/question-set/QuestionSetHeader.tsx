"use client";

"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface QuestionSetHeaderProps {
  title?: string;
  createButtonDisabled?: boolean;
  createUrl?: string;
}

export const QuestionSetHeader: React.FC<QuestionSetHeaderProps> = ({
  title = "Practice Questions",
  createButtonDisabled = false,
  createUrl = "/practice-questions/create"
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      
      {createButtonDisabled ? (
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      ) : (
        <Button asChild>
          <Link href={createUrl}>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Link>
        </Button>
      )}
    </div>
  );
};

export default QuestionSetHeader;