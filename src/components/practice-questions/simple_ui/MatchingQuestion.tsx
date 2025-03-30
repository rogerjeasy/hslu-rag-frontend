// components/practice-questions/question-types/MatchingQuestion.tsx
import React, { useState, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { MatchingQuestionType } from '@/types/practice-questions-responses.types';
import { cn } from '@/lib/utils';

interface MatchingQuestionProps {
  question: MatchingQuestionType;
  userAnswer?: Record<string, string>;
  onAnswer: (answer: Record<string, string>) => void;
  isReviewMode?: boolean;
}

export const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  userAnswer = {},
  onAnswer,
  isReviewMode = false,
}) => {
  // Extract left and right sides
  const leftSides = question.pairs.map(pair => pair.left);
  
  // Generate shuffled right sides only once using useRef 
  // This avoids re-shuffling on re-renders
  const rightSidesRef = useRef(question.pairs.map(pair => pair.right));
  const shuffledRightSidesRef = useRef([...rightSidesRef.current].sort(() => Math.random() - 0.5));
  
  // Initialize state based on props - but only once
  const hasUserAnswerRef = useRef(Object.keys(userAnswer || {}).length > 0);
  const [answers, setAnswers] = useState(hasUserAnswerRef.current ? {...userAnswer} : {});
  const [isSubmitted, setIsSubmitted] = useState(hasUserAnswerRef.current);

  // Update tracking ref
  const prevUserAnswerRef = useRef(userAnswer);
  // If userAnswer prop changes from parent, update our state
  if (userAnswer !== prevUserAnswerRef.current && Object.keys(userAnswer).length > 0) {
    prevUserAnswerRef.current = userAnswer;
    // We're using direct state updates instead of useEffect to avoid loops
    if (JSON.stringify(userAnswer) !== JSON.stringify(answers)) {
      setAnswers({...userAnswer});
      setIsSubmitted(true);
    }
  }

  const handleSelect = (leftSide: string, rightSide: string) => {
    if (isReviewMode || isSubmitted) return;
    
    const newAnswers = {...answers, [leftSide]: rightSide};
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!isReviewMode && Object.keys(answers).length === leftSides.length) {
      onAnswer(answers);
      setIsSubmitted(true);
    }
  };

  // Check if a match is correct
  const isMatchCorrect = (leftSide: string) => {
    if (!isSubmitted) return null;
    
    const correctPair = question.pairs.find(pair => pair.left === leftSide);
    return correctPair?.right === answers[leftSide];
  };

  // Get the correct right side for a left side
  const getCorrectMatch = (leftSide: string) => {
    return question.pairs.find(pair => pair.left === leftSide)?.right;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {leftSides.map((leftSide) => (
          <div key={leftSide} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="font-medium text-gray-800 min-w-[200px]">
              {leftSide}
            </div>
            
            <div className="flex-grow">
              <Select
                value={answers[leftSide] || ""}
                onValueChange={(value) => handleSelect(leftSide, value)}
                disabled={isReviewMode || isSubmitted}
              >
                <SelectTrigger className={cn(
                  "w-full",
                  isSubmitted && (
                    isMatchCorrect(leftSide)
                      ? "border-green-500 bg-green-50" 
                      : "border-red-500 bg-red-50"
                  )
                )}>
                  <SelectValue placeholder="Select a match..." />
                </SelectTrigger>
                <SelectContent>
                  {shuffledRightSidesRef.current.map((rightSide, idx) => (
                    <SelectItem 
                      key={`${rightSide}-${idx}`}
                      value={rightSide}
                      // Disable options that are already selected for other items
                      disabled={Object.values(answers).includes(rightSide) && answers[leftSide] !== rightSide}
                    >
                      {rightSide}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isSubmitted && (
              <div className="ml-2 flex items-center">
                {isMatchCorrect(leftSide) ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!isReviewMode && !isSubmitted && (
        <Button 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== leftSides.length}
          className="mt-4"
        >
          Submit Answers
        </Button>
      )}

      {isSubmitted && !isReviewMode && (
        <Card className="p-4 bg-blue-50 border-blue-200 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Correct Matches:</h4>
          <div className="space-y-2">
            {leftSides.map((leftSide) => (
              <div key={`correct-${leftSide}`} className="grid grid-cols-2 gap-4">
                <div className="font-medium">{leftSide}</div>
                <div className="text-blue-900">{getCorrectMatch(leftSide)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};