'use client';

import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { MultipleChoiceQuestionType } from '@/types/practice-questions.types';
import { cn } from '@/lib/utils';

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionType;
  onSubmit?: (questionId: string, answer: string) => void;
  userAnswer?: string;
  showCorrectAnswer?: boolean;
  disabled?: boolean;
  autoSubmit?: boolean;
}

export function MultipleChoiceQuestion({
  question,
  onSubmit,
  userAnswer,
  showCorrectAnswer = false,
  disabled = false,
  autoSubmit = false,
}: MultipleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userAnswer);
  const [submitted, setSubmitted] = useState<boolean>(!!userAnswer);
  const [attemptedSubmitWithoutSelection, setAttemptedSubmitWithoutSelection] = useState<boolean>(false);
  
  // Find the correct option
  const correctOption = question.options.find(option => option.isCorrect)?.id;
  
  // Update selected option if userAnswer changes externally
  useEffect(() => {
    if (userAnswer && userAnswer !== selectedOption) {
      setSelectedOption(userAnswer);
      setSubmitted(true);
    }
  }, [userAnswer]);
  
  const handleSelectionChange = (value: string) => {
    if (submitted || disabled) return;
    
    setSelectedOption(value);
    setAttemptedSubmitWithoutSelection(false);
    
    // Auto-submit if enabled
    if (autoSubmit && onSubmit) {
      setSubmitted(true);
      onSubmit(question.id, value);
    }
  };
  
  const handleSubmit = () => {
    if (!selectedOption) {
      setAttemptedSubmitWithoutSelection(true);
      return;
    }
    
    if (submitted || disabled) return;
    
    setSubmitted(true);
    onSubmit?.(question.id, selectedOption);
  };
  
  // Keyboard shortcut for submitting with Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedOption && !submitted && !disabled) {
      handleSubmit();
    }
  };
  
  // Determine if the user's answer is correct
  const isCorrect = userAnswer === correctOption;
  
  // Determine the visual feedback for each option
  const getOptionStyles = (optionId: string) => {
    if (!submitted && !showCorrectAnswer) {
      return selectedOption === optionId 
        ? 'border-primary bg-primary/5' 
        : 'border-input hover:bg-slate-50 hover:border-slate-300';
    }
    
    // When showing results
    if (showCorrectAnswer || submitted) {
      // Correct answer
      if (optionId === correctOption) {
        return 'border-green-500 bg-green-50 text-green-700';
      }
      
      // User selected wrong answer
      if (userAnswer === optionId && userAnswer !== correctOption) {
        return 'border-red-500 bg-red-50 text-red-700';
      }
      
      // Unselected non-correct options
      return 'border-input opacity-70';
    }
    
    return 'border-input';
  };
  
  return (
    <div className="space-y-4" onKeyDown={handleKeyDown}>
      <fieldset disabled={submitted || disabled} aria-disabled={submitted || disabled}>
        <legend className="sr-only">Select one option</legend>
        <RadioGroup 
          className="space-y-2"
          value={selectedOption}
          onValueChange={handleSelectionChange}
          disabled={submitted || disabled}
          aria-required="true"
          aria-invalid={attemptedSubmitWithoutSelection}
          aria-describedby={attemptedSubmitWithoutSelection ? `${question.id}-error` : undefined}
        >
          {question.options.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-md border transition-all relative",
                getOptionStyles(option.id)
              )}
            >
              <RadioGroupItem
                value={option.id}
                id={`option-${question.id}-${option.id}`}
                disabled={submitted || disabled}
                className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
              />
              <Label
                htmlFor={`option-${question.id}-${option.id}`}
                className="flex-grow cursor-pointer font-normal"
              >
                {option.text}
              </Label>
              
              {/* Result indicators */}
              {(submitted || showCorrectAnswer) && option.id === correctOption && (
                <CheckCircle2 className="h-5 w-5 text-green-600 absolute right-3" />
              )}
              
              {(submitted || showCorrectAnswer) && userAnswer === option.id && !option.isCorrect && (
                <XCircle className="h-5 w-5 text-red-600 absolute right-3" />
              )}
            </div>
          ))}
        </RadioGroup>
      </fieldset>
      
      {attemptedSubmitWithoutSelection && (
        <div 
          className="text-red-500 text-sm flex items-center gap-2"
          id={`${question.id}-error`}
          aria-live="polite"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Please select an option before submitting.</span>
        </div>
      )}
      
      {!autoSubmit && !submitted && !disabled && (
        <Button 
          onClick={handleSubmit} 
          className="mt-4"
          aria-disabled={!selectedOption}
        >
          Submit Answer
        </Button>
      )}
      
      {(submitted || showCorrectAnswer) && (
        <div 
          className={cn(
            "mt-4 p-3 rounded-md border",
            isCorrect 
              ? "border-green-200 bg-green-50 text-green-700" 
              : "border-red-200 bg-red-50 text-red-700"
          )}
          aria-live="polite"
        >
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