"use client";
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TrueFalseQuestionType } from '@/types/practice-questions.types';

interface TrueFalseQuestionViewProps {
  question: TrueFalseQuestionType;
  userAnswer: boolean | undefined;
  setUserAnswer: (value: boolean) => void;
  showResults?: boolean;
  result?: {
    is_correct?: boolean;
    correct_answer?: boolean;
    explanation?: string;
  };
  disabled?: boolean;
}

export function TrueFalseQuestionView({
  question,
  userAnswer,
  setUserAnswer,
  showResults = false,
  // result,
  disabled = false
}: TrueFalseQuestionViewProps) {
  const handleValueChange = (value: string) => {
    setUserAnswer(value === 'true');
  };

  const options = [
    { id: 'true', label: 'True', value: true },
    { id: 'false', label: 'False', value: false }
  ];

  // Find the correct option based on the TrueFalseQuestionType structure
  // TrueFalseQuestionType has options array where one option has isCorrect = true
  const correctOption = question.options.find(opt => opt.isCorrect);
  const correctAnswer = correctOption?.text.toLowerCase() === 'true';

  return (
    <RadioGroup
      value={userAnswer !== undefined ? String(userAnswer) : undefined}
      onValueChange={handleValueChange}
      className="space-y-3"
      disabled={disabled}
    >
      {options.map((option) => {
        // Determine if this option is the correct one when showing results
        const isCorrectOption = showResults && option.value === correctAnswer;
        
        // Determine if this option was incorrectly selected by the user
        const isIncorrectSelection = showResults && userAnswer === option.value && option.value !== correctAnswer;
       
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
              userAnswer === option.value ? 'border-primary' : ''
            }`}
          >
            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
            <div className="flex-1">
              <Label
                htmlFor={option.id}
                className={`flex items-start ${disabled ? '' : 'cursor-pointer'}`}
              >
                <div className="flex-1">
                  {option.label}
                </div>
                {showResults && (
                  <div className="ml-2 flex-shrink-0">
                    {option.value === correctAnswer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : userAnswer === option.value ? (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : null}
                  </div>
                )}
              </Label>
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
}