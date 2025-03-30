'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TrueFalseQuestionType } from '@/types/practice-questions.types';
import { cn } from '@/lib/utils';

interface TrueFalseQuestionProps {
  question: TrueFalseQuestionType;
  onSubmit?: (questionId: string, answer: string) => void;
  userAnswer?: string;
  showCorrectAnswer?: boolean;
  disabled?: boolean;
}

export function TrueFalseQuestion({
  question,
  onSubmit,
  userAnswer,
  showCorrectAnswer = false,
  disabled = false,
}: TrueFalseQuestionProps) {
  const [selected, setSelected] = useState<string | undefined>(userAnswer);
  const [submitted, setSubmitted] = useState<boolean>(!!userAnswer);
  
  // Find the correct option
  const correctOption = question.options.find(option => option.isCorrect)?.id;
  
  const handleSelect = (optionId: string) => {
    if (submitted || disabled) return;
    setSelected(optionId);
    
    // Auto-submit for true/false questions (optional)
    if (onSubmit) {
      setSubmitted(true);
      onSubmit(question.id, optionId);
    }
  };
  
  // Determine if user answer is correct
  const isCorrect = userAnswer === correctOption;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {question.options.map((option) => {
          // Determine styling based on state
          const isSelected = selected === option.id;
          const isCorrectOption = option.id === correctOption;
          const isIncorrectSelection = isSelected && !option.isCorrect && (submitted || showCorrectAnswer);
          
          let buttonVariant: "default" | "outline" | "secondary" | "destructive" | "ghost" = "outline";
          let additionalClasses = "";
          
          if ((submitted || showCorrectAnswer) && isCorrectOption) {
            buttonVariant = "default";
            additionalClasses = "bg-green-600 hover:bg-green-700 text-white border-green-600";
          } else if (isIncorrectSelection) {
            buttonVariant = "destructive";
          } else if (isSelected) {
            buttonVariant = "secondary";
          }
          
          return (
            <Button
              key={option.id}
              variant={buttonVariant}
              className={cn(
                "flex-1 text-lg h-16 font-medium relative",
                additionalClasses
              )}
              onClick={() => handleSelect(option.id)}
              disabled={submitted || disabled}
            >
              {option.text}
              
              {/* Result indicators */}
              {(submitted || showCorrectAnswer) && isCorrectOption && (
                <CheckCircle2 className="h-5 w-5 absolute top-2 right-2 text-green-500" />
              )}
              
              {isIncorrectSelection && (
                <XCircle className="h-5 w-5 absolute top-2 right-2 text-red-500" />
              )}
            </Button>
          );
        })}
      </div>
      
      {(submitted || showCorrectAnswer) && (
        <div className={cn(
          "mt-4 p-3 rounded-md border",
          isCorrect 
            ? "border-green-200 bg-green-50 text-green-700" 
            : "border-red-200 bg-red-50 text-red-700"
        )}>
          <div className="flex items-center gap-2 font-medium">
            {isCorrect 
              ? <CheckCircle2 className="h-5 w-5" /> 
              : <XCircle className="h-5 w-5" />
            }
            <span>{isCorrect ? "Correct!" : "Incorrect"}</span>
          </div>
          {!isCorrect && correctOption && (
            <p className="mt-1 text-sm">
              The correct answer is: {question.options.find(opt => opt.id === correctOption)?.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}