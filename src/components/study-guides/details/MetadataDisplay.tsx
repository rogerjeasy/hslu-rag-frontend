"use client";

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  SchoolIcon, 
  ClockIcon, 
  BarChart2Icon,
  CalendarIcon,
  InfoIcon,
  TargetIcon
} from 'lucide-react';
import { DetailLevel, StudyGuideFormat, StudyGuideResponse } from '@/types/study-guide.types';
import { formatDistanceToNow } from 'date-fns';

interface MetadataDisplayProps {
  studyGuide: StudyGuideResponse;
  courseId?: string;
  format: StudyGuideFormat;
  detailLevel: DetailLevel;
}

export function MetadataDisplay({
  studyGuide,
  courseId,
  format,
  detailLevel
}: MetadataDisplayProps) {
  // Calculate estimated reading time based on content length
  const readingTimeMinutes = Math.max(1, Math.ceil(studyGuide.answer.length / 1000));
  
  // Format timestamp 
  const createdTime = new Date(studyGuide.timestamp);
  const timeAgo = formatDistanceToNow(createdTime, { addSuffix: true });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Study Guide Info</CardTitle>
        <CardDescription>Details about this guide</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetadataItem 
          icon={<InfoIcon className="h-4 w-4 text-sky-500" />}
          label="Format"
          value={formatLabel(format)}
        />
        
        <MetadataItem 
          icon={<TargetIcon className="h-4 w-4 text-violet-500" />}
          label="Detail Level"
          value={detailLevelLabel(detailLevel)}
        />
        
        <MetadataItem 
          icon={<ClockIcon className="h-4 w-4 text-amber-500" />}
          label="Reading Time"
          value={`~${readingTimeMinutes} min${readingTimeMinutes === 1 ? '' : 's'}`}
        />
        
        <MetadataItem 
          icon={<BarChart2Icon className="h-4 w-4 text-green-500" />}
          label="Sources"
          value={`${studyGuide.context.length} reference${studyGuide.context.length === 1 ? '' : 's'}`}
        />
        
        {courseId && (
          <MetadataItem 
            icon={<SchoolIcon className="h-4 w-4 text-blue-500" />}
            label="Course"
            value={courseId}
          />
        )}
        
        <MetadataItem 
          icon={<CalendarIcon className="h-4 w-4 text-rose-500" />}
          label="Created"
          value={timeAgo}
        />
      </CardContent>
    </Card>
  );
}

interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetadataItem({ icon, label, value }: MetadataItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

// Helper functions to get display labels
function formatLabel(format: StudyGuideFormat): string {
  const formatLabels: Record<StudyGuideFormat, string> = {
    [StudyGuideFormat.OUTLINE]: 'Outline',
    [StudyGuideFormat.NOTES]: 'Notes',
    [StudyGuideFormat.FLASHCARDS]: 'Flashcards',
    [StudyGuideFormat.MIND_MAP]: 'Mind Map',
    [StudyGuideFormat.SUMMARY]: 'Summary'
  };
  
  return formatLabels[format] || 'Outline';
}

function detailLevelLabel(level: DetailLevel): string {
  const levelLabels: Record<DetailLevel, string> = {
    [DetailLevel.BASIC]: 'Basic',
    [DetailLevel.MEDIUM]: 'Medium',
    [DetailLevel.COMPREHENSIVE]: 'Comprehensive'
  };
  
  return levelLabels[level] || 'Medium';
}