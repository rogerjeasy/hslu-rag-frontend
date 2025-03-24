"use client";
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DifficultyLevel } from '@/types/practice-questions';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  // Define colors based on difficulty level
  const difficultyColors: Record<DifficultyLevel, { bg: string; text: string }> = {
    [DifficultyLevel.BASIC]: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300' },
    [DifficultyLevel.MEDIUM]: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300' },
    [DifficultyLevel.ADVANCED]: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-300' },
  };

  // Map difficulty level to display text
  const difficultyText: Record<DifficultyLevel, string> = {
    [DifficultyLevel.BASIC]: 'Basic',
    [DifficultyLevel.MEDIUM]: 'Medium',
    [DifficultyLevel.ADVANCED]: 'Advanced',
  };

  const { bg, text } = difficultyColors[difficulty];

  return (
    <Badge 
      variant="outline" 
      className={`${bg} ${text} border-0 font-medium ${className}`}
    >
      {difficultyText[difficulty]}
    </Badge>
  );
}