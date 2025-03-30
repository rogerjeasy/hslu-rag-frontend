"use client";
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { QuestionTypeEnum } from '@/types/practice-questions.types';
import { CheckSquare, FileText, ToggleLeft, AlignJustify, PenTool } from 'lucide-react';

interface QuestionTypeBadgeProps {
  type: QuestionTypeEnum;
  className?: string;
  showIcon?: boolean;
}

export function QuestionTypeBadge({
  type,
  className = '',
  showIcon = true
}: QuestionTypeBadgeProps) {
  // Define display text and icons for each question type
  const typeInfo: Record<QuestionTypeEnum, { text: string; icon: React.ReactNode; color: string }> = {
    [QuestionTypeEnum.MULTIPLE_CHOICE]: {
      text: 'Multiple Choice',
      icon: <CheckSquare className="h-3.5 w-3.5 mr-1" />,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    },
    [QuestionTypeEnum.SHORT_ANSWER]: {
      text: 'Short Answer',
      icon: <FileText className="h-3.5 w-3.5 mr-1" />,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    },
    [QuestionTypeEnum.TRUE_FALSE]: {
      text: 'True/False',
      icon: <ToggleLeft className="h-3.5 w-3.5 mr-1" />,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    },
    [QuestionTypeEnum.FILL_IN_BLANK]: {
      text: 'Fill-in-Blank',
      icon: <PenTool className="h-3.5 w-3.5 mr-1" />,
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    },
    [QuestionTypeEnum.MATCHING]: {
      text: 'Matching',
      icon: <AlignJustify className="h-3.5 w-3.5 mr-1" />,
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    },
  };

  const { text, icon, color } = typeInfo[type];
  
  return (
    <Badge variant="outline" className={`${color} border-0 ${className}`}>
      {showIcon && icon}
      {text}
    </Badge>
  );
}