// components/practice-questions/PracticeSessionSummary.tsx
import React from 'react';
import { PracticeSessionStats } from '@/types/practice-questions-responses.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Timer,
  Trophy,
  BookOpen,
//   ArrowRight,
  RefreshCw, 
  XCircle
} from 'lucide-react';

interface PracticeSessionSummaryProps {
  stats: PracticeSessionStats;
  topic: string;
  onRestart: () => void;
  onFinish: () => void;
}

const PracticeSessionSummary: React.FC<PracticeSessionSummaryProps> = ({
  stats,
  topic,
  onRestart,
  onFinish,
}) => {
  // Calculate percentage score
  const scorePercentage = stats.totalQuestions > 0
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
    : 0;

  // Format time
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Practice Session Summary
        </CardTitle>
        <p className="text-gray-600 mt-1">Topic: {topic}</p>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Score Overview */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-2">
            <span className="text-2xl font-bold text-blue-700">{scorePercentage}%</span>
          </div>
          <p className="text-gray-600">
            You answered {stats.correctAnswers} out of {stats.totalQuestions} questions correctly
          </p>
        </div>
        
        <Separator className="my-6" />
        
        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Correct Answers</p>
              <p className="text-lg font-semibold">{stats.correctAnswers}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="rounded-full bg-red-100 p-2 mr-3">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Incorrect Answers</p>
              <p className="text-lg font-semibold">{stats.incorrectAnswers}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="rounded-full bg-amber-100 p-2 mr-3">
              <Timer className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Time per Question</p>
              <p className="text-lg font-semibold">{formatTime(stats.averageTimePerQuestion)}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <BarChart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-lg font-semibold">{Math.round(stats.completionPercentage)}%</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
          <Button 
            variant="outline" 
            className="flex-1 space-x-2"
            onClick={onRestart}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Restart Session</span>
          </Button>
          
          <Button 
            className="flex-1 space-x-2 bg-blue-600 hover:bg-blue-700"
            onClick={onFinish}
          >
            <BookOpen className="h-4 w-4" />
            <span>Review Answers</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeSessionSummary;