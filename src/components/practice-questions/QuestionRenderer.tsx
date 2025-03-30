"use client";
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuestionTypeBadge } from './QuestionTypeBadge';
import { DifficultyBadge } from './DifficultyBadge';
import { MultipleChoiceQuestionView } from './question-types/MultipleChoiceQuestionView';
import { ShortAnswerQuestionView } from './question-types/ShortAnswerQuestionView';
import { TrueFalseQuestionView } from './question-types/TrueFalseQuestionView';
import { FillInBlankQuestionView } from './question-types/FillInBlankQuestionView';
import { MatchingQuestionView } from './question-types/MatchingQuestionView';
import { 
  QuestionTypeEnum, 
  QuestionType, 
  QuestionResult, 
  UserAnswer,
  PracticeSessionState
} from '@/types/practice-questions.types';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { HelpCircle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface QuestionRendererProps {
  question: QuestionType;
  index: number;
  total: number;
  showResults?: boolean;
  result?: QuestionResult;
}

export function QuestionRenderer({
  question,
  index,
  total,
  showResults = false,
  result
}: QuestionRendererProps) {
  // Access the session data from the store which contains userAnswers
  const { session, submitAnswer } = usePracticeQuestionsStore();
  const [isExplanationOpen, setIsExplanationOpen] = React.useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  // Get the current user answer for this question safely
  const userAnswer = session?.userAnswers[question.id]?.answer;
  
  // Helper function to convert string to boolean for TrueFalse questions
  const getBooleanFromAnswer = (answer: unknown): boolean | undefined => {
    if (typeof answer === 'string') {
      return answer.toLowerCase() === 'true';
    }
    return undefined;
  };
  
  // Create type-safe handlers for each question type
  const handleSetMultipleChoiceAnswer = (value: string) => {
    submitAnswer(question.id, value);
  };
  
  const handleSetShortAnswer = (value: string) => {
    submitAnswer(question.id, value);
  };
  
  const handleSetTrueFalseAnswer = (value: boolean) => {
    // Convert boolean to string for TrueFalse questions to match UserAnswer type
    submitAnswer(question.id, value.toString());
  };
  
  const handleSetFillInBlankAnswer = (value: string[]) => {
    submitAnswer(question.id, value);
  };
  
  // For matching questions, we need to serialize the Record<string, string> to a string[]
  // Each entry is stored as [key, value] in the array
  const handleSetMatchingAnswer = (value: Record<string, string>) => {
    submitAnswer(question.id, value);
  };
  
  // Adapter functions to convert QuestionResult to type-specific result objects for each view component
  
  // For MultipleChoiceQuestionView
  const createMultipleChoiceResult = (result?: QuestionResult) => {
    if (!result) return undefined;
    
    return {
      is_correct: result.is_correct,
      explanation: result.explanation,
      requires_review: result.requires_review,
      // Ensure correct_answer is always a string for MultipleChoice
      correct_answer: typeof result.correct_answer === 'string' ? result.correct_answer : undefined
    };
  };
  
  // For ShortAnswerQuestionView
  const createShortAnswerResult = (result?: QuestionResult) => {
    if (!result) return undefined;
    
    return {
      is_correct: result.is_correct,
      explanation: result.explanation,
      requires_review: result.requires_review,
      // Ensure correct_answer is always a string for ShortAnswer
      correct_answer: typeof result.correct_answer === 'string' ? result.correct_answer : undefined
    };
  };
  
  // For TrueFalseQuestionView
  const createTrueFalseResult = (result?: QuestionResult) => {
    if (!result) return undefined;
    
    return {
      is_correct: result.is_correct,
      explanation: result.explanation,
      requires_review: result.requires_review,
      // Not sending correct_answer to avoid type conflicts
      // The TrueFalseQuestionView will use the question.correctAnswer property instead
    };
  };
  
  // For FillInBlankQuestionView
  const createFillInBlankResult = (result?: QuestionResult) => {
    if (!result) return undefined;
    
    return {
      is_correct: result.is_correct,
      explanation: result.explanation,
      requires_review: result.requires_review,
      // Not sending correct_answer to avoid type conflicts
      // The FillInBlankQuestionView will use the question.blanks property instead
    };
  };
  
  // For MatchingQuestionView
  const createMatchingResult = (result?: QuestionResult) => {
    if (!result) return undefined;
    
    return {
      is_correct: result.is_correct,
      explanation: result.explanation,
      requires_review: result.requires_review,
      // Not sending correct_answer to avoid type conflicts
      // The MatchingQuestionView will use question.items for the correct mapping
    };
  };
  
  // Render the appropriate question type component
  const renderQuestionByType = () => {
    switch (question.type) {
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceQuestionView
            question={question}
            userAnswer={typeof userAnswer === 'string' ? userAnswer : undefined}
            setUserAnswer={handleSetMultipleChoiceAnswer}
            showResults={showResults}
            result={createMultipleChoiceResult(result)}
            disabled={showResults}
          />
        );
      case QuestionTypeEnum.SHORT_ANSWER:
        return (
          <ShortAnswerQuestionView
            question={question}
            userAnswer={typeof userAnswer === 'string' ? userAnswer : undefined}
            setUserAnswer={handleSetShortAnswer}
            showResults={showResults}
            result={createShortAnswerResult(result)}
            disabled={showResults}
          />
        );
      case QuestionTypeEnum.TRUE_FALSE:
        return (
          <TrueFalseQuestionView
            question={question}
            userAnswer={getBooleanFromAnswer(userAnswer)}
            setUserAnswer={handleSetTrueFalseAnswer}
            showResults={showResults}
            result={createTrueFalseResult(result)}
            disabled={showResults}
          />
        );
      case QuestionTypeEnum.FILL_IN_BLANK:
        return (
          <FillInBlankQuestionView
            question={question}
            userAnswer={Array.isArray(userAnswer) ? userAnswer : undefined}
            setUserAnswer={handleSetFillInBlankAnswer}
            showResults={showResults}
            result={createFillInBlankResult(result)}
            disabled={showResults}
          />
        );
      case QuestionTypeEnum.MATCHING:
        // For matching questions, we need to deserialize the stored data if it's in array format
        let matchingUserAnswer: Record<string, string> = {};
        
        if (typeof userAnswer === 'object' && !Array.isArray(userAnswer)) {
          // If it's already in the right format, use it directly
          matchingUserAnswer = userAnswer as Record<string, string>;
        } else if (Array.isArray(userAnswer) && userAnswer.length % 2 === 0) {
          // Convert the flat array back to key-value pairs
          for (let i = 0; i < userAnswer.length; i += 2) {
            matchingUserAnswer[userAnswer[i]] = userAnswer[i + 1];
          }
        }
        
        return (
          <MatchingQuestionView
            question={question}
            userAnswer={matchingUserAnswer}
            setUserAnswer={handleSetMatchingAnswer}
            showResults={showResults}
            result={createMatchingResult(result)}
            disabled={showResults}
          />
        );
      default:
        return (
          <div className="p-4 border rounded-md bg-muted">
            <div className="flex items-center text-muted-foreground">
              <HelpCircle className="h-5 w-5 mr-2" />
              <span>Unsupported question type</span>
            </div>
          </div>
        );
    }
  };
  
  // Render explanation content
  const renderExplanation = () => (
    <div className="space-y-4">
      <h4 className="font-medium">Explanation</h4>
      <div className="text-sm">
        {question.explanation || "No additional explanation available for this question."}
      </div>
    </div>
  );
  
  // Define correct citation type
  type Citation = {
    title: string;
    content_preview: string;
    page_number?: number;
  };

  // Render source citations content
  const renderSourceCitations = () => (
    <div className="space-y-4">
      <h4 className="font-medium">Source Materials</h4>
      {question.citations && Array.isArray(question.citations) && question.citations.length > 0 ? (
        <div className="space-y-4">
          {(question.citations as unknown as Citation[]).map((citation: Citation, idx: number) => (
            <div key={idx} className="border rounded-md p-3 text-sm">
              <div className="flex justify-between items-start">
                <div className="font-medium">{citation.title}</div>
                {citation.page_number && (
                  <div className="text-xs bg-muted px-2 py-1 rounded-md">
                    Page {citation.page_number}
                  </div>
                )}
              </div>
              <div className="mt-2 text-muted-foreground italic">
                &quot;{citation.content_preview}&quot;
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No source citations available for this question.
        </div>
      )}
    </div>
  );
  
  // Render result feedback for the question
  const renderResultFeedback = () => {
    if (!showResults || !result) return null;
    
    const isCorrect = result.is_correct;
    
    return (
      <div className={`flex items-start p-4 rounded-md ${
        isCorrect 
          ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300'
          : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300'
      }`}>
        {isCorrect ? (
          <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 mr-3 flex-shrink-0" />
        )}
        <div>
          <h3 className="font-medium">
            {isCorrect ? 'Correct' : 'Incorrect'}
          </h3>
          {result.explanation && (
            <p className="mt-1 text-sm">
              {result.explanation}
            </p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Question {index + 1} of {total}</span>
              <div className="flex items-center ml-4 space-x-2">
                <QuestionTypeBadge type={question.type} />
                <DifficultyBadge difficulty={question.difficulty} />
              </div>
            </div>
          </div>
          
          {/* Only show explanation and sources buttons when relevant */}
          <div className="flex items-center gap-2">
            {(question.explanation || showResults) && (
              isDesktop ? (
                <Collapsible
                  open={isExplanationOpen}
                  onOpenChange={setIsExplanationOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {isExplanationOpen ? 'Hide' : 'Show'} Explanation
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              ) : (
                <Drawer open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Explanation
                    </Button>
                  </DrawerTrigger>
                </Drawer>
              )
            )}
            
            {question.citations && question.citations.length > 0 && (
              isDesktop ? (
                <Collapsible
                  open={isSourcesOpen}
                  onOpenChange={setIsSourcesOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      {isSourcesOpen ? 'Hide' : 'Show'} Sources
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              ) : (
                <Drawer open={isSourcesOpen} onOpenChange={setIsSourcesOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Sources
                    </Button>
                  </DrawerTrigger>
                </Drawer>
              )
            )}
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Question text */}
          <div className="text-lg font-medium">
            {question.text}
          </div>
          
          {/* Question answer interface */}
          <div className="mt-4">
            {renderQuestionByType()}
          </div>
          
          {/* Result feedback when in review mode */}
          {renderResultFeedback()}
          
          {/* Collapsible explanation (for desktop) */}
          {isDesktop && (
            <Collapsible open={isExplanationOpen} className="w-full">
              <CollapsibleContent className="mt-4 pt-4 border-t">
                {renderExplanation()}
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {/* Drawer explanation (for mobile) */}
          {!isDesktop && (
            <Drawer open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Explanation</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pt-0">
                  <ScrollArea className="h-[50vh]">
                    {renderExplanation()}
                  </ScrollArea>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
          
          {/* Collapsible source citations (for desktop) */}
          {isDesktop && (
            <Collapsible open={isSourcesOpen} className="w-full">
              <CollapsibleContent className="mt-4 pt-4 border-t">
                {renderSourceCitations()}
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {/* Drawer source citations (for mobile) */}
          {!isDesktop && (
            <Drawer open={isSourcesOpen} onOpenChange={setIsSourcesOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Source Materials</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pt-0">
                  <ScrollArea className="h-[50vh]">
                    {renderSourceCitations()}
                  </ScrollArea>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}