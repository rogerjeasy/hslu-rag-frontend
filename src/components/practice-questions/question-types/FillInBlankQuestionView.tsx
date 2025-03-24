"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { FillInBlankQuestion } from '@/types/practice-questions';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FillInBlankQuestionViewProps {
  question: FillInBlankQuestion;
  userAnswer: string[] | undefined;
  setUserAnswer: (value: string[]) => void;
  showResults?: boolean;
  result?: {
    is_correct?: boolean;
    correct_answer?: string[];
    explanation?: string;
  };
  disabled?: boolean;
}

export function FillInBlankQuestionView({
  question,
  userAnswer = [],
  setUserAnswer,
  showResults = false,
  // result,
  disabled = false
}: FillInBlankQuestionViewProps) {
  // Parse the question text to find blanks marked with underscores
  // e.g., "The capital of France is _____."
  const handleBlankChange = (index: number, value: string) => {
    const newAnswers = [...(userAnswer || [])];
    newAnswers[index] = value;
    setUserAnswer(newAnswers);
  };

  // Split the question text into parts with blanks
  const parts = React.useMemo(() => {
    // This is a simple implementation - you might need a more sophisticated parser
    // depending on your exact format for fill-in-blank questions
    const regex = /_{3,}/g; // Match 3 or more underscores
    const textParts = question.text.split(regex);
    
    return textParts.map((part, index) => ({
      text: part,
      isBlank: index < textParts.length - 1 // All except the last part has a blank after it
    }));
  }, [question.text]);

  return (
    <div className="space-y-4">
      <div className="text-lg">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part.text}
            {part.isBlank && (
              <span className="inline-flex items-center mx-1">
                <Input
                  value={userAnswer[index] || ''}
                  onChange={(e) => handleBlankChange(index, e.target.value)}
                  className={`w-32 inline-block mx-1 ${
                    showResults
                      ? userAnswer[index]?.toLowerCase() === question.blanks[index]?.toLowerCase()
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : 'border-red-500 bg-red-50 dark:bg-red-950'
                      : ''
                  }`}
                  disabled={disabled}
                />
                {showResults && (
                  <span className="ml-1">
                    {userAnswer[index]?.toLowerCase() === question.blanks[index]?.toLowerCase() ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </span>
                )}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {showResults && (
        <div className="p-4 rounded-md bg-muted mt-4">
          <h4 className="font-medium mb-2">Correct Answers:</h4>
          <div className="space-y-2">
            {question.blanks.map((answer, index) => (
              <div key={index} className="flex items-center">
                <span className="font-medium mr-2">Blank {index + 1}:</span>
                <span className="text-green-600 dark:text-green-400">{answer}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}