'use client';

import React from 'react';
import { QuestionType, QuestionTypeEnum, UserAnswer } from '@/types/practice-questions.types';
import { QuestionCard } from './QuestionCard';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { ShortAnswerQuestion } from './ShortAnswerQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { FillInBlankQuestion } from './FillInBlankQuestion';
import { MatchingQuestion } from './MatchingQuestion';

interface QuestionRendererProps {
  question: QuestionType;
  index: number;
  userAnswer?: UserAnswer;
  showExplanation?: boolean;
  showCorrectAnswer?: boolean;
  showCitations?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  onSubmitAnswer?: (questionId: string, answer: UserAnswer['answer']) => void;
  onShowExplanation?: () => void;
  onShowCitation?: (citationId: number) => void;
}

export function QuestionRenderer({
  question,
  index,
  userAnswer,
  showExplanation = false,
  showCorrectAnswer = false,
  showCitations = false,
  isActive = false,
  disabled = false,
  onSubmitAnswer,
  onShowExplanation,
  onShowCitation,
}: QuestionRendererProps) {
  // Render the appropriate question input based on the question type
  const renderQuestionInput = () => {
    switch (question.type) {
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceQuestion
            question={question}
            onSubmit={onSubmitAnswer}
            userAnswer={userAnswer?.answer as string}
            showCorrectAnswer={showCorrectAnswer}
            disabled={disabled}
          />
        );
        
      case QuestionTypeEnum.SHORT_ANSWER:
        return (
          <ShortAnswerQuestion
            question={question}
            onSubmit={onSubmitAnswer}
            userAnswer={userAnswer?.answer as string}
            showSampleAnswer={showCorrectAnswer}
            disabled={disabled}
          />
        );
        
      case QuestionTypeEnum.TRUE_FALSE:
        return (
          <TrueFalseQuestion
            question={question}
            onSubmit={onSubmitAnswer}
            userAnswer={userAnswer?.answer as string}
            showCorrectAnswer={showCorrectAnswer}
            disabled={disabled}
          />
        );
        
      case QuestionTypeEnum.FILL_IN_BLANK:
        return (
          <FillInBlankQuestion
            question={question}
            onSubmit={onSubmitAnswer}
            userAnswer={userAnswer?.answer as string[]}
            showCorrectAnswer={showCorrectAnswer}
            disabled={disabled}
          />
        );
        
      case QuestionTypeEnum.MATCHING:
        return (
          <MatchingQuestion
            question={question}
            onSubmit={onSubmitAnswer}
            userAnswer={userAnswer?.answer as Record<string, string>}
            showCorrectAnswer={showCorrectAnswer}
            disabled={disabled}
          />
        );
        
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <QuestionCard
      question={question}
      index={index}
      showExplanation={showExplanation}
      showCitations={showCitations}
      isActive={isActive}
      isAnswered={!!userAnswer}
      isCorrect={userAnswer?.isCorrect}
      onShowExplanation={onShowExplanation}
      onShowCitation={onShowCitation}
    >
      {renderQuestionInput()}
    </QuestionCard>
  );
}