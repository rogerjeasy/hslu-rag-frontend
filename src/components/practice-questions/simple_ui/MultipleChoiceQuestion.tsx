// components/practice-questions/question-types/MultipleChoiceQuestion.tsx
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MultipleChoiceQuestionType } from '@/types/practice-questions-responses.types';
import { cn } from '@/lib/utils';

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionType;
  userAnswer?: string;
  onAnswer: (answer: string) => void;
  isReviewMode?: boolean;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
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

  return (
    <RadioGroup
      value={userAnswer}
      onValueChange={handleChange}
      className="space-y-3 mt-3"
      disabled={isReviewMode}
    >
      {question.options.map((option) => {
        const isSelected = userAnswer === option.id;
        const showCorrectness = isReviewMode || userAnswer !== undefined;
        
        // Determine the styling for review mode
        let optionClassName = "border p-3 rounded-md";
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
              "flex items-start space-x-2 transition-colors duration-200"
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
                "flex-grow text-base font-normal cursor-pointer",
                showCorrectness && option.isCorrect && "font-medium"
              )}
            >
              {option.text}
              {showCorrectness && option.isCorrect && (
                <span className="ml-2 text-green-600 font-medium">(Correct)</span>
              )}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};