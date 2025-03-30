"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  ListTreeIcon, 
  ClipboardListIcon, 
  StickyNoteIcon,
  NetworkIcon,
  BookTextIcon
} from 'lucide-react';
import { StudyGuideFormat } from '@/types/study-guide.types';

interface FormatBadgeProps {
  format: StudyGuideFormat;
}

export function FormatBadge({ format }: FormatBadgeProps) {
  const formatInfo = {
    [StudyGuideFormat.OUTLINE]: {
      label: 'Outline',
      icon: ListTreeIcon,
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    },
    [StudyGuideFormat.NOTES]: {
      label: 'Notes',
      icon: ClipboardListIcon,
      color: 'bg-green-100 text-green-800 hover:bg-green-200'
    },
    [StudyGuideFormat.FLASHCARDS]: {
      label: 'Flashcards',
      icon: StickyNoteIcon,
      color: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
    },
    [StudyGuideFormat.MIND_MAP]: {
      label: 'Mind Map',
      icon: NetworkIcon,
      color: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
    },
    [StudyGuideFormat.SUMMARY]: {
      label: 'Summary',
      icon: BookTextIcon,
      color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
    }
  };

  const { label, icon: Icon, color } = formatInfo[format] || formatInfo[StudyGuideFormat.OUTLINE];

  return (
    <Badge variant="secondary" className={`${color} flex items-center`}>
      <Icon className="h-3.5 w-3.5 mr-1" />
      {label}
    </Badge>
  );
}