// components/practice-questions/question-types/ShortAnswerQuestion.tsx
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShortAnswerQuestionType } from '@/types/practice-questions-responses.types';

interface ShortAnswerQuestionProps {
  question: ShortAnswerQuestionType;
  userAnswer?: string;
  onAnswer: (answer: string) => void;
  isReviewMode?: boolean;
}

export const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  question,
  userAnswer,
  onAnswer,
  isReviewMode = false,
}) => {
  const [answer, setAnswer] = useState(userAnswer || '');
  const [isSubmitted, setIsSubmitted] = useState(Boolean(userAnswer));

  useEffect(() => {
    setAnswer(userAnswer || '');
    setIsSubmitted(Boolean(userAnswer));
  }, [userAnswer]);

  const handleSubmit = () => {
    if (answer.trim() && !isReviewMode) {
      onAnswer(answer.trim());
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={answer}
        onChange={handleChange}
        placeholder="Type your answer here..."
        className="w-full min-h-[120px] resize-y p-3 text-base"
        disabled={isReviewMode || isSubmitted}
      />
      
      {!isReviewMode && !isSubmitted && (
        <Button 
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className="mt-2"
        >
          Submit Answer
        </Button>
      )}

      {(isReviewMode || isSubmitted) && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Sample Answer:</h4>
          <p className="text-blue-900">{question.sampleAnswer}</p>
        </Card>
      )}
    </div>
  );
};