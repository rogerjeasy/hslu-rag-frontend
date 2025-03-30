'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FillInBlankQuestionType } from '@/types/practice-questions.types';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FillInBlankQuestionProps {
  question: FillInBlankQuestionType;
  onSubmit?: (questionId: string, answer: string[]) => void;
  userAnswer?: string[];
  showCorrectAnswer?: boolean;
  disabled?: boolean;
}

export function FillInBlankQuestion({
  question,
  onSubmit,
  userAnswer,
  showCorrectAnswer = false,
  disabled = false,
}: FillInBlankQuestionProps) {
  // Parse blanks from the question text (format: "Text ___ with ___ blanks")
  const [questionParts, setQuestionParts] = useState<string[]>([]);
  const [blankAnswers, setBlankAnswers] = useState<string[]>(
    userAnswer || new Array(question.blanks.length).fill('')
  );
  const [submitted, setSubmitted] = useState<boolean>(!!userAnswer);
  
  // Parse question text to separate text and blanks
  useEffect(() => {
    // Split by underscores (_) and assume they represent blanks
    // This is a simple implementation - in reality, you'd use a more robust parsing method
    const text = question.text;
    const regex = /_{3,}/g; // Match 3 or more underscores
    
    // Split text into parts
    const parts = text.split(regex);
    setQuestionParts(parts);
    
    // Initialize blank answers if not already set
    if (!userAnswer && blankAnswers.every(a => a === '')) {
      setBlankAnswers(new Array(parts.length - 1).fill(''));
    }
  }, [question.text, userAnswer]);
  
  const handleBlankChange = (index: number, value: string) => {
    if (submitted || disabled) return;
    
    const newAnswers = [...blankAnswers];
    newAnswers[index] = value;
    setBlankAnswers(newAnswers);
  };
  
  const handleSubmit = () => {
    // All blanks must be filled
    if (blankAnswers.some(a => !a.trim()) || submitted || disabled) return;
    
    setSubmitted(true);
    onSubmit?.(question.id, blankAnswers);
  };
  
  // Check if answers are correct
  const checkCorrectness = () => {
    if (!userAnswer || !question.blanks || userAnswer.length !== question.blanks.length) {
      return { isCorrect: false, correctAnswers: [] };
    }
    
    const results = userAnswer.map((answer, index) => {
      const expectedAnswer = question.blanks[index];
      return answer.toLowerCase().trim() === expectedAnswer.toLowerCase().trim();
    });
    
    return {
      isCorrect: results.every(r => r),
      correctByBlank: results,
    };
  };
  
  const { isCorrect, correctByBlank } = (submitted || showCorrectAnswer) 
    ? checkCorrectness() 
    : { isCorrect: false, correctByBlank: [] };
  
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-md">
        {questionParts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < questionParts.length - 1 && (
              <span className="inline-block mx-1">
                <Input
                  value={blankAnswers[index] || ''}
                  onChange={(e) => handleBlankChange(index, e.target.value)}
                  className={cn(
                    "w-32 inline-block border-b-2 rounded-none text-center px-1 py-0 h-8",
                    submitted || showCorrectAnswer
                      ? correctByBlank && correctByBlank[index]
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-primary"
                  )}
                  placeholder="______"
                  disabled={submitted || disabled}
                />
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {!submitted && !disabled && (
        <Button 
          onClick={handleSubmit} 
          disabled={blankAnswers.some(a => !a.trim())}
          className="mt-4"
        >
          Submit Answer
        </Button>
      )}
      
      {(submitted || showCorrectAnswer) && (
        <div className={cn(
          "mt-4 p-3 rounded-md border",
          isCorrect 
            ? "border-green-200 bg-green-50 text-green-700" 
            : "border-red-200 bg-red-50 text-red-700"
        )}>
          <div className="flex items-center gap-2 font-medium">
            {isCorrect 
              ? <CheckCircle2 className="h-5 w-5" /> 
              : <XCircle className="h-5 w-5" />
            }
            <span>{isCorrect ? "Correct!" : "Incorrect"}</span>
          </div>
          
          {!isCorrect && question.blanks && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">Correct answers:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {question.blanks.map((answer, i) => (
                  <li key={i}>
                    Blank {i + 1}: <strong>{answer}</strong>
                    {userAnswer && userAnswer[i] && userAnswer[i] !== answer && (
                      <span className="text-red-600"> (You entered: {userAnswer[i]})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}