"use client";

import React from 'react';
import { DifficultyLevel } from '@/types/practice-questions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (value: DifficultyLevel) => void;
}

const difficultyOptions = [
  {
    value: DifficultyLevel.BASIC,
    label: 'Basic',
    description: 'Fundamental concepts and straightforward questions',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  {
    value: DifficultyLevel.MEDIUM,
    label: 'Medium',
    description: 'More complex concepts requiring deeper understanding',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    value: DifficultyLevel.ADVANCED,
    label: 'Advanced',
    description: 'Challenging questions that test comprehensive knowledge',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ value, onChange }) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as DifficultyLevel)}
      className="grid gap-3"
    >
      {difficultyOptions.map((option) => (
        <div
          key={option.value}
          className={cn(
            "flex items-start space-x-3 rounded-md border p-3 transition-colors",
            value === option.value
              ? "border-primary"
              : "border-muted hover:bg-muted/50"
          )}
        >
          <RadioGroupItem 
            value={option.value} 
            id={`difficulty-${option.value}`}
            className="mt-0.5"
          />
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2">
              <Label
                htmlFor={`difficulty-${option.value}`}
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.label}
              </Label>
              <Badge className={cn("ml-1 text-xs", option.color)}>
                {option.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {option.description}
            </p>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
};

export default DifficultySelector;