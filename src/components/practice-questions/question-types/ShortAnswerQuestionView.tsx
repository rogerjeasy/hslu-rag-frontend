"use client";
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ShortAnswerQuestionType } from '@/types/practice-questions.types';
import { BookOpen } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

interface ShortAnswerQuestionViewProps {
  question: ShortAnswerQuestionType;
  userAnswer: string | undefined;
  setUserAnswer: (value: string) => void;
  showResults?: boolean;
  result?: {
    is_correct?: boolean;
    correct_answer?: string;
    explanation?: string;
    requires_review?: boolean;
  };
  disabled?: boolean;
}

export function ShortAnswerQuestionView({
  question,
  userAnswer,
  setUserAnswer,
  showResults = false,
  result,
  disabled = false
}: ShortAnswerQuestionViewProps) {
  const [isAnswerVisible, setIsAnswerVisible] = React.useState(false);
  
  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
  };
  
  return (
    <div className="space-y-4">
      <Textarea
        value={userAnswer || ''}
        onChange={handleValueChange}
        placeholder="Enter your answer here..."
        className="min-h-[120px]"
        disabled={disabled}
      />
      {showResults && (
        <Collapsible
          open={isAnswerVisible}
          onOpenChange={setIsAnswerVisible}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                {isAnswerVisible ? 'Hide Sample Answer' : 'View Sample Answer'}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-3">
            <div className="p-4 rounded-md bg-muted">
              <h4 className="font-medium mb-2">Sample Answer:</h4>
              <div className="text-sm whitespace-pre-wrap">
                {question.sampleAnswer}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      {showResults && result?.requires_review && (
        <div className="p-4 rounded-md bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Requires Manual Review</h4>
          <p className="text-sm text-muted-foreground">
            Short answer questions require manual review. A sample answer has been provided for reference.
          </p>
        </div>
      )}
    </div>
  );
}