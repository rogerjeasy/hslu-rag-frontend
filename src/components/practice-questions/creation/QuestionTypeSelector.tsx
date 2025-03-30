import React from 'react';
import { QuestionTypeEnum } from '@/types/practice-questions.types';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Type definitions for props
interface QuestionTypeSelectorProps {
  selectedTypes: QuestionTypeEnum[];
  onToggle: (type: QuestionTypeEnum) => void;
  error?: boolean;
}

// Question type info with icons and descriptions
const questionTypeInfo = [
  {
    type: QuestionTypeEnum.MULTIPLE_CHOICE,
    label: 'Multiple Choice',
    description: 'Select one correct answer from several options.',
    icon: 'M9 9a3 3 0 100-6 3 3 0 000 6z M17.625 9a3 3 0 100-6 3 3 0 000 6z M9 16.5a3 3 0 100-6 3 3 0 000 6z M17.625 16.5a3 3 0 100-6 3 3 0 000 6z',
  },
  {
    type: QuestionTypeEnum.SHORT_ANSWER,
    label: 'Short Answer',
    description: 'Write a brief text answer to demonstrate understanding.',
    icon: 'M3.75 9h16.5m-16.5 6.75h16.5',
  },
  {
    type: QuestionTypeEnum.TRUE_FALSE,
    label: 'True/False',
    description: 'Determine if a statement is true or false.',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    type: QuestionTypeEnum.FILL_IN_BLANK,
    label: 'Fill in the Blank',
    description: 'Complete sentences by filling in missing words.',
    icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
  },
  {
    type: QuestionTypeEnum.MATCHING,
    label: 'Matching',
    description: 'Match items from two different columns.',
    icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
  },
];

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  selectedTypes,
  onToggle,
  error
}) => {
  return (
    <div className={cn(
      "grid gap-3 sm:grid-cols-2",
      error ? "border-destructive" : "border-border"
    )}>
      {questionTypeInfo.map(({ type, label, description, icon }) => (
        <div
          key={type}
          className={cn(
            "flex items-start space-x-3 rounded-md border p-3 transition-colors",
            selectedTypes.includes(type)
              ? "border-primary bg-primary/5"
              : "border-muted hover:bg-muted/50"
          )}
        >
          <Checkbox
            id={`question-type-${type}`}
            checked={selectedTypes.includes(type)}
            onCheckedChange={() => onToggle(type)}
            className="mt-0.5"
          />
          <div className="grid gap-1.5">
            <label
              htmlFor={`question-type-${type}`}
              className="flex items-center gap-2 font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              {label}
            </label>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionTypeSelector;