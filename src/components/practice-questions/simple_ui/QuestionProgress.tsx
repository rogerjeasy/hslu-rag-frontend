// components/practice-questions/QuestionProgress.tsx
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Circle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { QuestionType, UserAnswer } from '@/types/practice-questions-responses.types';

interface QuestionProgressProps {
  questions: QuestionType[];
  userAnswers: Record<string, UserAnswer>;
  currentQuestionIndex: number;
  onNavigate: (index: number) => void;
  completionPercentage: number;
}

const QuestionProgress: React.FC<QuestionProgressProps> = ({
  questions,
  userAnswers,
  currentQuestionIndex,
  onNavigate,
  completionPercentage,
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Top bar with back/next and completion percentage */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === questions.length - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
          
          <div className="text-sm font-medium text-gray-700">
            {Math.round(completionPercentage)}% Complete
          </div>
        </div>
        
        {/* Progress bar */}
        <Progress value={completionPercentage} className="h-2 bg-gray-100" />
        
        {/* Question indicators */}
        <div className="flex flex-wrap gap-2 justify-center">
          <TooltipProvider>
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              let icon = <Circle className="h-4 w-4" />;
              let bgColor = "bg-gray-100 text-gray-500";
              let tooltipText = `Question ${index + 1}`;
              
              if (userAnswer) {
                if (userAnswer.isCorrect === true) {
                  icon = <CheckCircle2 className="h-4 w-4" />;
                  bgColor = "bg-green-100 text-green-600";
                  tooltipText = "Correct";
                } else if (userAnswer.isCorrect === false) {
                  icon = <XCircle className="h-4 w-4" />;
                  bgColor = "bg-red-100 text-red-600";
                  tooltipText = "Incorrect";
                } else {
                  icon = <HelpCircle className="h-4 w-4" />;
                  bgColor = "bg-blue-100 text-blue-600";
                  tooltipText = "Answered";
                }
              }
              
              const isActive = index === currentQuestionIndex;
              
              return (
                <Tooltip key={question.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-8 h-8 rounded-full p-0 ${bgColor} ${
                        isActive ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                      }`}
                      onClick={() => onNavigate(index)}
                    >
                      {icon}
                      <span className="sr-only">{tooltipText}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default QuestionProgress;