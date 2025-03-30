'use client';

import React from 'react';
import { PracticeSessionStats as PracticeSessionStatsType } from '@/types/practice-questions.types';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PracticeSessionStatsProps {
  stats: PracticeSessionStatsType;
  variant?: 'default' | 'compact';
}

export function PracticeSessionStats({
  stats,
  variant = 'default',
}: PracticeSessionStatsProps) {
  const isCompact = variant === 'compact';
  
  // Format time (convert seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate accuracy percentage
  const accuracyPercentage = stats.answeredQuestions > 0
    ? Math.round((stats.correctAnswers / stats.answeredQuestions) * 100)
    : 0;
  
  return (
    <div className={cn(
      "grid gap-4",
      isCompact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
    )}>
      {/* Accuracy stat */}
      <div className={cn(
        "flex flex-col p-4 rounded-lg border",
        accuracyPercentage >= 80 ? "bg-green-50 border-green-200" :
        accuracyPercentage >= 50 ? "bg-amber-50 border-amber-200" :
        "bg-red-50 border-red-200"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className={cn(
            "h-5 w-5",
            accuracyPercentage >= 80 ? "text-green-600" :
            accuracyPercentage >= 50 ? "text-amber-600" : 
            "text-red-600"
          )} />
          <span className="text-sm font-medium text-slate-700">Accuracy</span>
        </div>
        <span className="text-2xl font-bold">
          {accuracyPercentage}%
        </span>
        <span className="text-xs text-slate-500 mt-1">
          {stats.correctAnswers} / {stats.answeredQuestions} correct
        </span>
      </div>
      
      {/* Completion stat */}
      <div className="flex flex-col p-4 rounded-lg border bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <SkipForward className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Completion</span>
        </div>
        <span className="text-2xl font-bold">
          {Math.round(stats.completionPercentage)}%
        </span>
        <div className="mt-1">
          <Progress value={stats.completionPercentage} className="h-1.5" />
        </div>
      </div>
      
      {/* If not compact, show more detailed stats */}
      {!isCompact && (
        <>
          {/* Incorrect answers stat */}
          <div className="flex flex-col p-4 rounded-lg border bg-slate-50 border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Incorrect</span>
            </div>
            <span className="text-2xl font-bold">
              {stats.incorrectAnswers}
            </span>
            <span className="text-xs text-slate-500 mt-1">
              {stats.incorrectAnswers > 0 
                ? `${Math.round((stats.incorrectAnswers / stats.answeredQuestions) * 100)}% of answers`
                : 'No incorrect answers'}
            </span>
          </div>
          
          {/* Time stat */}
          <div className="flex flex-col p-4 rounded-lg border bg-slate-50 border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Avg. Time</span>
            </div>
            <span className="text-2xl font-bold">
              {stats.averageTimePerQuestion ? formatTime(stats.averageTimePerQuestion) : '0:00'}
            </span>
            <span className="text-xs text-slate-500 mt-1">
              per question
            </span>
          </div>
        </>
      )}
    </div>
  );
}