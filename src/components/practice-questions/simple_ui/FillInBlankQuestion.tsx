// components/practice-questions/question-types/FillInBlankQuestion.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { FillInBlankQuestionType } from '@/types/practice-questions-responses.types';
import { cn } from '@/lib/utils';

interface FillInBlankQuestionProps {
  question: FillInBlankQuestionType;
  userAnswer?: string[];
  onAnswer: (answer: string[]) => void;
  isReviewMode?: boolean;
}

export const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({
  question,
  userAnswer = [],
  onAnswer,
  isReviewMode = false,
}) => {
  // Use refs to track initialization
  const initializedRef = useRef(false);
  const textParts = question.text.split('_____');
  
  // Set initial state based on props
  const [answers, setAnswers] = useState<string[]>(() => {
    if (userAnswer && userAnswer.length > 0) {
      return [...userAnswer]; // Create a copy to avoid reference issues
    }
    return Array(question.blanks.length).fill('');
  });
  
  const [isSubmitted, setIsSubmitted] = useState(userAnswer && userAnswer.length > 0);

  // Reset state when the question changes (using questionId as indicator)
  useEffect(() => {
    if (initializedRef.current) {
      // Skip the first render to avoid double initialization
      if (userAnswer && userAnswer.length > 0) {
        setAnswers([...userAnswer]);
        setIsSubmitted(true);
      } else {
        setAnswers(Array(question.blanks.length).fill(''));
        setIsSubmitted(false);
      }
    } else {
      initializedRef.current = true;
    }
  }, [question.id]); // Only run when the question ID changes, not on every render
  
  // Handle userAnswer changes without causing infinite loops
  useEffect(() => {
    if (userAnswer && userAnswer.length > 0 && 
        JSON.stringify(userAnswer) !== JSON.stringify(answers)) {
      setAnswers([...userAnswer]);
      setIsSubmitted(true);
    }
  }, [userAnswer]); // Only depends on userAnswer

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!isReviewMode && answers.every(answer => answer.trim())) {
      onAnswer(answers);
      setIsSubmitted(true);
    }
  };

  // Check if an answer is correct
  const isAnswerCorrect = (index: number) => {
    if (!isSubmitted) return null;
    const userAns = answers[index]?.trim().toLowerCase();
    const correctAns = question.blanks[index]?.toLowerCase();
    
    // Check for exact match or if the answer is within the accepted answers if there are multiple
    if (correctAns.includes('|')) {
      const acceptedAnswers = correctAns.split('|').map(a => a.trim());
      return acceptedAnswers.includes(userAns);
    }
    
    return userAns === correctAns;
  };

  return (
    <div className="space-y-4">
      <div className="text-gray-800">
        {textParts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < textParts.length - 1 && (
              <span className="inline-block mx-1">
                <Input
                  value={answers[index] || ''}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className={cn(
                    "w-32 inline-block px-2 py-1 text-center",
                    isSubmitted && (
                      isAnswerCorrect(index) 
                        ? "border-green-500 bg-green-50" 
                        : "border-red-500 bg-red-50"
                    )
                  )}
                  disabled={isReviewMode || isSubmitted}
                />
                {isSubmitted && (
                  <span className="ml-1">
                    {isAnswerCorrect(index) ? (
                      <Check className="inline h-4 w-4 text-green-600" />
                    ) : (
                      <X className="inline h-4 w-4 text-red-600" />
                    )}
                  </span>
                )}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {!isReviewMode && !isSubmitted && (
        <Button 
          onClick={handleSubmit}
          disabled={!answers.every(answer => answer.trim())}
          className="mt-4"
        >
          Submit Answers
        </Button>
      )}

      {isSubmitted && (
        <Card className="p-4 bg-blue-50 border-blue-200 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Correct Answers:</h4>
          <div className="space-y-2">
            {question.blanks.map((blank, index) => (
              <div key={index} className="flex items-center">
                <span className="font-medium mr-2">Blank {index + 1}:</span>
                <span className="text-blue-900">{blank.replace(/\|/g, ' or ')}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};