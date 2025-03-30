'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MatchingQuestionType } from '@/types/practice-questions.types';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle2, XCircle, MoveHorizontal } from 'lucide-react';

interface MatchingQuestionProps {
  question: MatchingQuestionType;
  onSubmit?: (questionId: string, answer: Record<string, string>) => void;
  userAnswer?: Record<string, string>;
  showCorrectAnswer?: boolean;
  disabled?: boolean;
}

export function MatchingQuestion({
  question,
  onSubmit,
  userAnswer,
  showCorrectAnswer = false,
  disabled = false,
}: MatchingQuestionProps) {
  // Map to store left->right matches
  const [matches, setMatches] = useState<Record<string, string>>(userAnswer || {});
  const [submitted, setSubmitted] = useState<boolean>(!!userAnswer);
  
  // Shuffle right-side items for display (only once on mount)
  const [rightOptions, setRightOptions] = useState<string[]>([]);
  
  useEffect(() => {
    // Get all right-side options and shuffle them
    const rightItems = question.pairs.map(pair => pair.right);
    setRightOptions(shuffleArray([...rightItems]));
  }, [question.pairs]);
  
  const handleMatch = (left: string, right: string) => {
    if (submitted || disabled) return;
    
    setMatches(prev => ({
      ...prev,
      [left]: right
    }));
  };
  
  const handleSubmit = () => {
    // Ensure all left items have a match
    if (Object.keys(matches).length < question.pairs.length || submitted || disabled) {
      return;
    }
    
    setSubmitted(true);
    onSubmit?.(question.id, matches);
  };
  
  // Check which matches are correct
  const checkMatches = () => {
    const correctPairs = new Map(question.pairs.map(pair => [pair.left, pair.right]));
    const results: Record<string, boolean> = {};
    
    Object.entries(matches).forEach(([left, right]) => {
      results[left] = correctPairs.get(left) === right;
    });
    
    const allCorrect = Object.values(results).every(result => result);
    
    return {
      matchResults: results,
      allCorrect
    };
  };
  
  const { matchResults, allCorrect } = (submitted || showCorrectAnswer) 
    ? checkMatches() 
    : { matchResults: {}, allCorrect: false };
  
  // Fisher-Yates shuffle algorithm
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2 text-slate-600">Match items from left column:</h4>
          
          <div className="space-y-3">
            {question.pairs.map(pair => {
              const isMatched = pair.left in matches;
              const isCorrect = matchResults[pair.left];
              
              return (
                <div key={pair.left} className="flex items-center gap-2">
                  <div className={cn(
                    "flex-grow p-3 rounded-md border",
                    (submitted || showCorrectAnswer) ? (
                      isCorrect
                        ? "border-green-300 bg-green-50"
                        : "border-red-300 bg-red-50"
                    ) : (
                      isMatched
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200"
                    )
                  )}>
                    {pair.left}
                  </div>
                  
                  <MoveHorizontal className="h-5 w-5 text-slate-400" />
                  
                  <Select
                    value={matches[pair.left] || ""}
                    onValueChange={(value) => handleMatch(pair.left, value)}
                    disabled={submitted || disabled}
                  >
                    <SelectTrigger className={cn(
                      "w-[180px]",
                      (submitted || showCorrectAnswer) && (
                        isCorrect
                          ? "border-green-500 ring-green-200"
                          : isMatched
                            ? "border-red-500 ring-red-200"
                            : ""
                      )
                    )}>
                      <SelectValue placeholder="Select a match" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select a match</SelectItem>
                      {rightOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Result indicators */}
                  {(submitted || showCorrectAnswer) && (
                    isCorrect
                      ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                      : <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="hidden md:block">
          <h4 className="text-sm font-medium mb-2 text-slate-600">Available matches:</h4>
          
          <div className="space-y-3">
            {rightOptions.map(right => (
              <div key={right} className="p-3 rounded-md border border-gray-200">
                {right}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {!submitted && !disabled && (
        <Button 
          onClick={handleSubmit} 
          disabled={Object.keys(matches).length < question.pairs.length}
          className="mt-4"
        >
          Submit Matches
        </Button>
      )}
      
      {(submitted || showCorrectAnswer) && (
        <div className={cn(
          "mt-4 p-3 rounded-md border",
          allCorrect 
            ? "border-green-200 bg-green-50 text-green-700" 
            : "border-red-200 bg-red-50 text-red-700"
        )}>
          <div className="flex items-center gap-2 font-medium">
            {allCorrect 
              ? <CheckCircle2 className="h-5 w-5" /> 
              : <XCircle className="h-5 w-5" />
            }
            <span>{allCorrect ? "All matches correct!" : "Some matches are incorrect"}</span>
          </div>
          
          {!allCorrect && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">Correct matches:</p>
              <ul className="divide-y divide-red-100">
                {question.pairs.map(pair => (
                  <li key={pair.left} className="py-1 text-sm flex items-center gap-2">
                    <span className="font-medium">{pair.left}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{pair.right}</span>
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