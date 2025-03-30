'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: string[];
  onJumpToQuestion: (index: number) => void;
}

export function QuestionProgress({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  onJumpToQuestion,
}: QuestionProgressProps) {
  // Calculate progress percentage
  const progressPercentage = Math.round((answeredQuestions.length / totalQuestions) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-600">
        <span>Progress: {answeredQuestions.length} of {totalQuestions} questions</span>
        <span>{progressPercentage}%</span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex flex-wrap gap-2 mt-4 max-w-full overflow-x-auto py-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          // Find if this question has been answered
          const questionId = `q${index + 1}`;
          const isAnswered = answeredQuestions.includes(questionId);
          const isCurrent = index === currentIndex;
          
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={cn(
                "min-w-8 h-8 px-0 rounded-full",
                isAnswered ? "border-green-500 bg-green-50 text-green-700" : "border-gray-300",
                isCurrent && !isAnswered ? "border-primary bg-primary/10" : "",
                isCurrent ? "ring-2 ring-primary/20" : ""
              )}
              onClick={() => onJumpToQuestion(index)}
            >
              {isAnswered ? (
                <CheckCircle className="h-4 w-4" />
              ) : isCurrent ? (
                <CircleDot className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              <span className="sr-only">Question {index + 1}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}