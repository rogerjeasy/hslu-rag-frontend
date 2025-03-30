'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

interface PracticeSessionControlsProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  canSubmit: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function PracticeSessionControls({
  isFirstQuestion,
  isLastQuestion,
  canSubmit,
  onPrevious,
  onNext,
  onSubmit,
}: PracticeSessionControlsProps) {
  return (
    <div className="flex justify-between items-center pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <div className="flex-1 flex justify-center">
        {canSubmit && (
          <Button
            onClick={onSubmit}
            className="flex items-center gap-2 mx-2"
          >
            <Send className="h-4 w-4" />
            Submit Answer
          </Button>
        )}
      </div>
      
      <Button
        onClick={onNext}
        disabled={isLastQuestion}
        className="flex items-center gap-2"
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}