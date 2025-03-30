// components/practice-questions/QuestionCard.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, BookOpen } from 'lucide-react';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { ShortAnswerQuestion } from './ShortAnswerQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { FillInBlankQuestion } from './FillInBlankQuestion';
import { MatchingQuestion } from './MatchingQuestion';


import {
  QuestionType,
//   QuestionTypeEnum,
  UserAnswer,
//   DifficultyLevel,
} from '@/types/practice-questions-responses.types';
import { cn } from '@/lib/utils';

  
  interface QuestionCardProps {
    question: QuestionType;
    index: number;
    totalQuestions: number;
    userAnswer?: UserAnswer;
    onAnswer: (questionId: string, answer: string | string[] | Record<string, string>) => void;
    onShowExplanation: (questionId: string) => void;
    onShowCitations: (citationNumbers: number[]) => void;
    isReviewMode?: boolean;
  }
  
  const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    totalQuestions,
    userAnswer,
    onAnswer,
    onShowExplanation,
    onShowCitations,
    isReviewMode = false,
  }) => {
    // Map difficulty to color
    const getDifficultyColor = (difficulty: string) => {
      const lowerDifficulty = difficulty.toLowerCase();
      if (lowerDifficulty === 'basic') {
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      }
      if (lowerDifficulty === 'medium') {
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      }
      if (lowerDifficulty === 'advanced') {
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      }
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    };
  
    // Map question type to human-readable string
    const getQuestionTypeText = (type: string) => {
      switch (type) {
        case 'multiple_choice':
          return 'Multiple Choice';
        case 'short_answer':
          return 'Short Answer';
        case 'true_false':
          return 'True/False';
        case 'fill_in_blank':
          return 'Fill in the Blank';
        case 'matching':
          return 'Matching';
        default:
          return 'Unknown Type';
      }
    };
  
    // Render appropriate question component based on type
    const renderQuestionContent = () => {
      switch (question.type) {
        case 'multiple_choice':
          return (
            <MultipleChoiceQuestion
              question={question}
              userAnswer={userAnswer?.answer as string | undefined}
              onAnswer={(answer) => onAnswer(question.id, answer)}
              isReviewMode={isReviewMode}
            />
          );
        case 'short_answer':
          return (
            <ShortAnswerQuestion
              question={question}
              userAnswer={userAnswer?.answer as string | undefined}
              onAnswer={(answer) => onAnswer(question.id, answer)}
              isReviewMode={isReviewMode}
            />
          );
        case 'true_false':
          return (
            <TrueFalseQuestion
              question={question}
              userAnswer={userAnswer?.answer as string | undefined}
              onAnswer={(answer) => onAnswer(question.id, answer)}
              isReviewMode={isReviewMode}
            />
          );
        case 'fill_in_blank':
          return (
            <FillInBlankQuestion
              question={question}
              userAnswer={userAnswer?.answer as string[] | undefined}
              onAnswer={(answer) => onAnswer(question.id, answer)}
              isReviewMode={isReviewMode}
            />
          );
        case 'matching':
          return (
            <MatchingQuestion
              question={question}
              userAnswer={userAnswer?.answer as Record<string, string> | undefined}
              onAnswer={(answer) => onAnswer(question.id, answer)}
              isReviewMode={isReviewMode}
            />
          );
        default:
          return <div>Unsupported question type</div>;
      }
    };
  
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="text-xs font-medium">
              Question {index + 1} of {totalQuestions}
            </Badge>
            <Badge className={`${getDifficultyColor(question.difficulty)} text-xs font-medium`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
              {getQuestionTypeText(question.type)}
            </CardTitle>
            {userAnswer?.isCorrect !== undefined && (
              <Badge 
                variant={userAnswer.isCorrect ? "secondary" : "destructive"} 
                className={cn(
                  "ml-2",
                  userAnswer.isCorrect && "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                )}
              >
                {userAnswer.isCorrect ? "Correct" : "Incorrect"}
              </Badge>
            )}
          </div>
          <CardDescription className="text-gray-600 mt-1">
            {question.citations.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:bg-transparent"
                onClick={() => onShowCitations(question.citations)}
              >
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Citations: {question.citations.join(', ')}</span>
              </Button>
            )}
          </CardDescription>
          <Separator className="mt-2" />
        </CardHeader>
        
        <CardContent className="pt-4 pb-6">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-4">{question.text}</h3>
            {renderQuestionContent()}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0">
          {(isReviewMode || userAnswer?.isCorrect !== undefined) && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => onShowExplanation(question.id)}
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Explanation
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  export default QuestionCard;