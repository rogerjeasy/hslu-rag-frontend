"use client";
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MatchingQuestionType } from '@/types/practice-questions.types';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface MatchingQuestionViewProps {
  question: MatchingQuestionType;
  userAnswer: Record<string, string> | undefined;
  setUserAnswer: (value: Record<string, string>) => void;
  showResults?: boolean;
  result?: {
    is_correct?: boolean;
    correct_answer?: Record<string, string>;
    explanation?: string;
  };
  disabled?: boolean;
}

export function MatchingQuestionView({
  question,
  userAnswer = {},
  setUserAnswer,
  showResults = false,
  // result,
  disabled = false
}: MatchingQuestionViewProps) {
  // Handle selection change for an item
  const handleSelectionChange = (leftId: string, rightId: string) => {
    setUserAnswer({
      ...userAnswer,
      [leftId]: rightId
    });
  };

  // Get all right options for select dropdowns - adapting to use the `pairs` property from MatchingQuestionType
  const rightOptions = question.pairs.map((pair, index) => ({
    id: index.toString(), // Generate an ID since pairs might not have unique IDs
    text: pair.right
  }));

  // Shuffle the right options to make it more challenging
  const shuffledRightOptions = React.useMemo(() => {
    return [...rightOptions].sort(() => Math.random() - 0.5);
  }, [rightOptions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Left Column - Fixed items */}
        <div className="space-y-4">
          <div className="font-medium text-center pb-2 border-b">Items</div>
          {question.pairs.map((pair, index) => (
            <div 
              key={`left-${index}`} 
              className="p-3 rounded-md border bg-muted/30"
            >
              {pair.left}
            </div>
          ))}
        </div>

        {/* Right Column - Matching items */}
        <div className="space-y-4">
          <div className="font-medium text-center pb-2 border-b">Matches</div>
          {question.pairs.map((pair, index) => {
            const leftId = pair.left; // Using left text as the key
            const selectedRightId = userAnswer[leftId];
            const isCorrect = showResults && selectedRightId === pair.right;
            const isIncorrect = showResults && selectedRightId && selectedRightId !== pair.right;
            
            return (
              <div 
                key={`match-${index}`}
                className={`p-3 rounded-md border ${
                  isCorrect 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                    : isIncorrect
                    ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <Select
                    value={selectedRightId}
                    onValueChange={(value) => handleSelectionChange(leftId, value)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a match..." />
                    </SelectTrigger>
                    <SelectContent>
                      {shuffledRightOptions.map((option) => (
                        <SelectItem key={option.id} value={option.text}>
                          {option.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {showResults && (
                    <div className="ml-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : selectedRightId ? (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showResults && (
        <div className="p-4 rounded-md bg-muted mt-4">
          <h4 className="font-medium mb-2">Correct Matches:</h4>
          <div className="space-y-3 mt-3">
            {question.pairs.map((pair, index) => (
              <div key={`answer-${index}`} className="flex items-center">
                <div className="flex-1">{pair.left}</div>
                <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">{pair.right}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}