import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TrueFalseQuestionType } from '@/types/practice-questions-responses.types';
import { cn } from '@/lib/utils';

interface TrueFalseQuestionProps {
  question: TrueFalseQuestionType;
  userAnswer?: string;
  onAnswer: (answer: string) => void;
  isReviewMode?: boolean;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  userAnswer,
  onAnswer,
  isReviewMode = false,
}) => {
  const handleChange = (value: string) => {
    if (!isReviewMode) {
      onAnswer(value);
    }
  };

  // Create default options if they don't exist or are not an array
  const defaultOptions = [
    { id: 'true', text: 'True', isCorrect: false },
    { id: 'false', text: 'False', isCorrect: false }
  ];
  
  // Use question.options if available, otherwise use defaults
  const options = question.options && Array.isArray(question.options) && question.options.length > 0
    ? question.options
    : defaultOptions;

  return (
    <RadioGroup
      value={userAnswer}
      onValueChange={handleChange}
      className="space-y-3 mt-3"
      disabled={isReviewMode}
    >
      {options.map((option) => {
        const isSelected = userAnswer === option.id;
        const showCorrectness = isReviewMode || userAnswer !== undefined;
        
        // Determine the styling for review mode
        let optionClassName = "border p-4 rounded-md";
        if (showCorrectness) {
          if (option.isCorrect) {
            optionClassName = cn(optionClassName, "bg-green-50 border-green-300");
          } else if (isSelected && !option.isCorrect) {
            optionClassName = cn(optionClassName, "bg-red-50 border-red-300");
          }
        } else if (isSelected) {
          optionClassName = cn(optionClassName, "bg-blue-50 border-blue-300");
        }

        return (
          <div 
            key={option.id} 
            className={cn(
              optionClassName,
              "flex items-center space-x-3 transition-colors duration-200"
            )}
          >
            <RadioGroupItem 
              value={option.id} 
              id={option.id}
              className="mt-0.5"
            />
            <Label 
              htmlFor={option.id} 
              className={cn(
                "text-base font-medium cursor-pointer",
                showCorrectness && option.isCorrect && "text-green-700"
              )}
            >
              {option.text}
              {showCorrectness && option.isCorrect && (
                <span className="ml-2 text-green-600">(Correct)</span>
              )}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};