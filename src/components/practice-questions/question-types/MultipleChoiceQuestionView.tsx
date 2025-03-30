"use client";
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MultipleChoiceQuestionType } from '@/types/practice-questions.types';

interface MultipleChoiceQuestionViewProps {
  question: MultipleChoiceQuestionType;
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

export function MultipleChoiceQuestionView({
  question,
  userAnswer,
  setUserAnswer,
  showResults = false,
  result,
  disabled = false
}: MultipleChoiceQuestionViewProps) {
  const handleValueChange = (value: string) => {
    setUserAnswer(value);
  };
  
  return (
    <RadioGroup
      value={userAnswer}
      onValueChange={handleValueChange}
      className="space-y-3"
      disabled={disabled}
    >
      {question.options.map((option) => {
        // Determine if this option is the correct one when showing results
        const isCorrectOption = showResults && option.isCorrect;
       
        // Determine if this option was incorrectly selected by the user
        const isIncorrectSelection = showResults && userAnswer === option.id && !option.isCorrect;
       
        return (
          <div
            key={option.id}
            className={`flex items-start space-x-2 rounded-md border p-3 ${
              isCorrectOption
                ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                : isIncorrectSelection
                ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                : ''
            } ${
              userAnswer === option.id ? 'border-primary' : ''
            }`}
          >
            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
            <div className="flex-1">
              <Label
                htmlFor={option.id}
                className={`flex items-start ${disabled ? '' : 'cursor-pointer'}`}
              >
                <div className="flex-1">
                  {option.text}
                </div>
                {showResults && (
                  <div className="ml-2 flex-shrink-0">
                    {option.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : userAnswer === option.id ? (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : null}
                  </div>
                )}
              </Label>
             
              {/* Show explanation from the question when this is the correct option */}
              {showResults && option.isCorrect && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {question.explanation}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
}