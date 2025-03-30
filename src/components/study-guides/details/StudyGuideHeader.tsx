'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, BookIcon, SchoolIcon } from 'lucide-react';
import { DetailLevel, StudyGuideFormat } from '@/types/study-guide.types';
import { FormatBadge } from './FormatBadge';
// Correctly import the DetailLevelBadge component
import DetailLevelBadge from './DetailLevelBadge';

interface StudyGuideHeaderProps {
  title: string;
  format: StudyGuideFormat;
  detailLevel: DetailLevel;
  createdAt: string;
  courseId?: string;
}

export function StudyGuideHeader({
  title,
  format,
  detailLevel,
  createdAt,
  courseId
}: StudyGuideHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{createdAt}</span>
          {courseId && (
            <>
              <span className="mx-1">•</span>
              <SchoolIcon className="h-4 w-4" />
              <span className="font-medium truncate">{courseId}</span>
            </>
          )}
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <FormatBadge format={format} />
        <DetailLevelBadge level={detailLevel} />
        <Badge variant="outline" className="flex items-center">
          <BookIcon className="h-3.5 w-3.5 mr-1" />
          Study Guide
        </Badge>
      </div>
    </div>
  );
}

// Also export as default to ensure it can be imported either way
export default StudyGuideHeader;