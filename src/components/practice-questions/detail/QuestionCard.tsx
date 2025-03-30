'use client';

import { Separator } from '@/components/ui/separator';
import { CheckSquare, AlignLeft, ToggleLeft, TextCursorInput, ArrowLeftRight, Info, ExternalLink } from 'lucide-react';
import { QuestionType, QuestionTypeEnum, DifficultyLevel } from '@/types/practice-questions.types';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface QuestionCardProps {
  question: QuestionType;
  index: number;
  showExplanation?: boolean;
  showCitations?: boolean;
  isActive?: boolean;
  isAnswered?: boolean;
  isCorrect?: boolean;
  onShowExplanation?: () => void;
  onShowCitation?: (citationId: number) => void;
  children?: ReactNode;
}

export function QuestionCard({
  question,
  index,
  showExplanation = false,
  showCitations = false,
  isActive = false,
  isAnswered = false,
  isCorrect,
  onShowExplanation,
  onShowCitation,
  children,
}: QuestionCardProps) {
  // Get appropriate icon based on question type
  const getQuestionTypeIcon = () => {
    switch (question.type) {
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        return <CheckSquare className="h-4 w-4" />;
      case QuestionTypeEnum.SHORT_ANSWER:
        return <AlignLeft className="h-4 w-4" />;
      case QuestionTypeEnum.TRUE_FALSE:
        return <ToggleLeft className="h-4 w-4" />;
      case QuestionTypeEnum.FILL_IN_BLANK:
        return <TextCursorInput className="h-4 w-4" />;
      case QuestionTypeEnum.MATCHING:
        return <ArrowLeftRight className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get nice question type display name
  const getQuestionTypeName = () => {
    switch (question.type) {
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        return 'Multiple Choice';
      case QuestionTypeEnum.SHORT_ANSWER:
        return 'Short Answer';
      case QuestionTypeEnum.TRUE_FALSE:
        return 'True/False';
      case QuestionTypeEnum.FILL_IN_BLANK:
        return 'Fill in the Blank';
      case QuestionTypeEnum.MATCHING:
        return 'Matching';
      default:
        return 'Question';
    }
  };

  // Get appropriate color based on difficulty
  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case DifficultyLevel.BASIC:
        return 'bg-green-100 text-green-800 border-green-200';
      case DifficultyLevel.MEDIUM:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case DifficultyLevel.ADVANCED:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className={cn(
        "w-full transition-all duration-200 mb-4 overflow-hidden",
        isActive ? "border-primary ring-1 ring-primary/20 shadow-md" : "border-border",
        isAnswered && isCorrect !== undefined && (
          isCorrect ? "border-green-300 bg-green-50/50" : "border-red-300 bg-red-50/50"
        )
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal">
              Question {index + 1}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              {getQuestionTypeIcon()}
              <span className="hidden sm:inline">{getQuestionTypeName()}</span>
            </Badge>
          </div>
          <Badge className={cn("text-xs", getDifficultyColor())}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </Badge>
        </div>
        <CardTitle className="text-base sm:text-lg mt-3">
          {question.text}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        {children}
      </CardContent>
      
      {(showExplanation || showCitations) && (
        <CardFooter className="flex flex-col items-start p-4 pt-0 gap-3">
          {showExplanation && (
            <div className="w-full rounded-md bg-slate-50 p-3 text-sm">
              <div className="flex items-center gap-1 font-medium text-slate-700 mb-1">
                <Info className="h-4 w-4" />
                <span>Explanation</span>
              </div>
              <p className="text-slate-700">{question.explanation}</p>
            </div>
          )}
          
          {showCitations && question.citations.length > 0 && (
            <div className="w-full">
              <Separator className="my-2" />
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                <span>Citations:</span>
                <div className="flex flex-wrap gap-1">
                  {question.citations.map((citation) => (
                    <Button
                      key={citation}
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={() => onShowCitation?.(citation)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Source {citation}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}