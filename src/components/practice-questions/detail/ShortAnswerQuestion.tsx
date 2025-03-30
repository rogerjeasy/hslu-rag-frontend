'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ShortAnswerQuestionType } from '@/types/practice-questions.types';
import { AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

interface ShortAnswerQuestionProps {
  question: ShortAnswerQuestionType;
  onSubmit?: (questionId: string, answer: string) => void;
  userAnswer?: string;
  showSampleAnswer?: boolean;
  disabled?: boolean;
}

export function ShortAnswerQuestion({
  question,
  onSubmit,
  userAnswer,
  showSampleAnswer = false,
  disabled = false,
}: ShortAnswerQuestionProps) {
  const [answer, setAnswer] = useState<string>(userAnswer || '');
  const [submitted, setSubmitted] = useState<boolean>(!!userAnswer);
  const [showSample, setShowSample] = useState<boolean>(showSampleAnswer);
  
  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (submitted || disabled) return;
    setAnswer(event.target.value);
  };
  
  const handleSubmit = () => {
    if (!answer.trim() || submitted || disabled) return;
    
    setSubmitted(true);
    onSubmit?.(question.id, answer);
  };
  
  const toggleSampleAnswer = () => {
    setShowSample(!showSample);
  };
  
  return (
    <div className="space-y-4">
      <Textarea
        value={answer}
        onChange={handleAnswerChange}
        placeholder="Type your answer here..."
        className="min-h-[120px] resize-y"
        disabled={submitted || disabled}
      />
      
      <div className="flex flex-wrap gap-3">
        {!submitted && !disabled && (
          <Button 
            onClick={handleSubmit} 
            disabled={!answer.trim()}
          >
            Submit Answer
          </Button>
        )}
        
        {(submitted || disabled) && (
          <Button 
            variant="outline" 
            onClick={toggleSampleAnswer}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            {showSample ? "Hide" : "Show"} Sample Answer
          </Button>
        )}
      </div>
      
      {submitted && (
        <div className="p-3 rounded-md border border-blue-200 bg-blue-50 text-blue-700">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-5 w-5" />
            <span>Answer submitted</span>
          </div>
          <p className="mt-1 text-sm">
            Short answer questions are subjective and require manual review. Compare your answer with the sample answer.
          </p>
        </div>
      )}
      
      {showSample && (
        <div className="mt-4">
          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>Sample answer</span>
          </h4>
          <div className="p-4 rounded-md border border-amber-200 bg-amber-50">
            <p className="text-slate-800">{question.sampleAnswer}</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Note: Your answer may differ and still be correct. The sample answer is provided as a guide.
          </p>
        </div>
      )}
    </div>
  );
}