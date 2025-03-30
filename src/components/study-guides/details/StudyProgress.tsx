"use client";

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckIcon, 
  ClockIcon, 
  BrainCircuitIcon,
  BookIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from 'lucide-react';

interface StudyProgressProps {
  studyGuideId: string;
  initialProgress?: number;
}

export function StudyProgress({ 
  studyGuideId,
  initialProgress = 0 
}: StudyProgressProps) {
  const [progress, setProgress] = useState<number>(initialProgress);
  const [lastStudied, setLastStudied] = useState<Date | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  // In a real application, you would fetch the actual study progress
  // from your backend based on the studyGuideId
  useEffect(() => {
    // Simulating fetching data from an API
    const fetchStudyProgress = async () => {
      try {
        // This would be an actual API call in a real app
        // For demo purposes, we'll use random data
        setTimeout(() => {
          const mockProgress = Math.floor(Math.random() * 100);
          const mockLastStudied = new Date();
          mockLastStudied.setDate(mockLastStudied.getDate() - Math.floor(Math.random() * 7));
          
          setProgress(mockProgress);
          setLastStudied(mockLastStudied);
        }, 500);
      } catch (error) {
        console.error('Error fetching study progress:', error);
      }
    };

    fetchStudyProgress();
  }, [studyGuideId]);

  const formatLastStudied = () => {
    if (!lastStudied) return 'Never';
    
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastStudied.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getProgressColor = () => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BrainCircuitIcon className="h-5 w-5 text-purple-500" />
          <span className="font-medium">Study Progress</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>{progress}% Complete</span>
          <span className="text-muted-foreground flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            Last studied: {formatLastStudied()}
          </span>
        </div>
        
        <Progress value={progress} className={`h-2 ${getProgressColor()}`} />
      </div>
      
      {expanded && (
        <div className="pt-3 grid grid-cols-2 gap-2">
          <Card className="bg-muted/50">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center">
              <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                <BookIcon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">3 Study Sessions</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center">
              <div className="h-9 w-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-1">
                <CheckIcon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">2/5 Sections</span>
              <span className="text-xs text-muted-foreground">Completed</span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}