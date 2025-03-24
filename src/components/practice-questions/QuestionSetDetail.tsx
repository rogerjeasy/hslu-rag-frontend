"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { QuestionRenderer } from './QuestionRenderer';
import { Button } from '@/components/ui/button';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { Progress } from '@/components/ui/progress';
import { 
  ListChecks,
  RotateCcw,
  Check,
  AlertCircle,
  Loader2,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DifficultyBadge } from './DifficultyBadge';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { QuestionResult } from '@/types/practice-questions';

interface CourseInfo {
  id: string;
  name: string;
}

interface QuestionSetDetailProps {
  questionSetId: string;
  courseInfo?: CourseInfo;
}

export function QuestionSetDetail({ 
  questionSetId,
  courseInfo
}: QuestionSetDetailProps) {
  const router = useRouter();
  const { 
    currentQuestionSet, 
    fetchQuestionSet,
    userAnswers,
    submissionResults,
    submitAnswers,
    resetSubmission,
    isLoading,
    isSubmitting,
    error
  } = usePracticeQuestionsStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = React.useState(false);
  
  // Load question set data
  React.useEffect(() => {
    fetchQuestionSet(questionSetId);
  }, [fetchQuestionSet, questionSetId]);
  
  // Reset state when navigating away
  React.useEffect(() => {
    return () => {
      resetSubmission();
    };
  }, [resetSubmission]);
  
  // Handle error states
  if (isLoading && !currentQuestionSet) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Updated error handling section for QuestionSetDetail
  if (error) {
    // Get appropriate alert variants based on error code
    const getAlertVariant = () => {
      // Network errors or server errors should show as destructive
      if (error.code === 0 || error.code >= 500) return "destructive";
      // Auth errors should be highlighted differently
      if (error.code === 401 || error.code === 403) return "warning";
      // Default to a standard error appearance
      return "destructive";
    };

    const alertVariant = getAlertVariant();
    const borderColorClass = alertVariant === "destructive" 
      ? "border-red-200 dark:border-red-800" 
      : "border-yellow-200 dark:border-yellow-800";
    const bgColorClass = alertVariant === "destructive" 
      ? "bg-red-50 dark:bg-red-950" 
      : "bg-yellow-50 dark:bg-yellow-950";
    const textColorClass = alertVariant === "destructive" 
      ? "text-red-900 dark:text-red-300" 
      : "text-yellow-900 dark:text-yellow-300";
    const textContentClass = alertVariant === "destructive" 
      ? "text-red-700 dark:text-red-400" 
      : "text-yellow-700 dark:text-yellow-400";

    return (
      <div className={`rounded-lg border ${borderColorClass} ${bgColorClass} p-6`}>
        <div className="flex items-start">
          <AlertCircle className={`h-5 w-5 ${textContentClass} mr-3 mt-0.5`} />
          <div>
            <h3 className={`text-lg font-medium ${textColorClass} mb-2`}>
              Error Loading Practice Questions
            </h3>
            <p className={`${textContentClass} mb-4`}>
              {error.message}
            </p>
            {process.env.NODE_ENV === 'development' && error.detail && (
              <p className={`text-sm opacity-80 mb-4 ${textContentClass}`}>
                Details: {error.detail}
              </p>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
              <Button variant="outline" onClick={() => fetchQuestionSet(questionSetId)}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentQuestionSet) {
    return (
      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-2">Question Set Not Found</h3>
        <p className="text-muted-foreground mb-4">This practice question set doesn&apos;t exist or has been deleted.</p>
        <Button variant="outline" asChild>
          <Link href="/practice-questions">Go to Practice Questions</Link>
        </Button>
      </div>
    );
  }
  
  const { questions } = currentQuestionSet;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  
  // Navigation functions
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Calculate progress
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;
  
  // Check if all questions have been answered
  const allQuestionsAnswered = answeredCount === totalQuestions;
  
  // Handle submit
  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    
    if (!allQuestionsAnswered) {
      setIsSubmitDialogOpen(false);
      return;
    }
    
    try {
      await submitAnswers(questionSetId, userAnswers);
      toast.success('Practice questions submitted successfully!');
      setIsSubmitDialogOpen(false);
    } catch (err) {
      toast.error('Failed to submit answers');
      console.error(err);
    }
  };
  
  // Handle restart practice session
  const handleRestart = () => {
    resetSubmission();
    setCurrentQuestionIndex(0);
  };
  
  // Determine if we're in review mode (after submission)
  const isReviewMode = !!submissionResults;
  
  // Get the result for the current question if in review mode
  const currentQuestionResult = isReviewMode 
    ? submissionResults.question_results.find(r => r.question_id === currentQuestion.id)
    : undefined;
  
  // Calculate score if in review mode
  const score = isReviewMode
    ? {
        correctCount: submissionResults.correct_answers,
        percentage: submissionResults.score_percentage || 0,
        total: submissionResults.total_questions
      }
    : undefined;
  
  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="space-y-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/practice-questions">Practice Questions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentQuestionSet.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">{currentQuestionSet.title}</h1>
            {currentQuestionSet.description && (
              <p className="text-muted-foreground mt-1">{currentQuestionSet.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DifficultyBadge difficulty={currentQuestionSet.difficulty} />
            
            {courseInfo && (
              <span className="text-sm text-muted-foreground">
                {courseInfo.name}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Progress: {answeredCount} of {totalQuestions} questions answered
          </span>
          
          {isReviewMode && score && (
            <span className={`text-sm font-medium ${
              score.percentage >= 70 
                ? 'text-green-600 dark:text-green-400' 
                : score.percentage >= 50 
                  ? 'text-yellow-600 dark:text-yellow-400' 
                  : 'text-red-600 dark:text-red-400'
            }`}>
              Score: {score.correctCount}/{score.total} ({score.percentage}%)
            </span>
          )}
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      {/* Question renderer */}
      <QuestionRenderer
        question={currentQuestion}
        index={currentQuestionIndex}
        total={totalQuestions}
        showResults={isReviewMode}
        result={currentQuestionResult}
      />
      
      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {isReviewMode ? (
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          ) : (
            <Button 
              onClick={() => setIsSubmitDialogOpen(true)} 
              disabled={isSubmitting}
              variant="default"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ListChecks className="h-4 w-4 mr-2" />
                  Submit Answers
                </>
              )}
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === totalQuestions - 1}
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      {/* Question navigation dots */}
      <div className="flex justify-center gap-1 pt-4">
        {questions.map((q, idx) => {
          // Determine the status of each question dot
          const isActive = idx === currentQuestionIndex;
          const isAnswered = !!userAnswers[q.id];
          
          // Fixed: Properly retrieve and handle the question result
          let questionResult: QuestionResult | undefined;
          if (isReviewMode && submissionResults) {
            questionResult = submissionResults.question_results.find(
              r => r.question_id === q.id
            );
          }
          
          const isCorrect = questionResult ? questionResult.is_correct : false;
          const requiresReview = questionResult ? !!questionResult.requires_review : false;
          
          // Set appropriate styling
          let dotClass = "w-3 h-3 rounded-full cursor-pointer transition-colors";
          
          if (isActive) {
            dotClass += " ring-2 ring-primary ring-offset-2";
          }
          
          if (isReviewMode) {
            if (isCorrect) {
              dotClass += " bg-green-500";
            } else if (requiresReview) {
              dotClass += " bg-yellow-500";
            } else {
              dotClass += " bg-red-500";
            }
          } else {
            dotClass += isAnswered ? " bg-primary" : " bg-muted border border-input";
          }
          
          return (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={dotClass}
                    onClick={() => setCurrentQuestionIndex(idx)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Question {idx + 1}</p>
                  {isAnswered && !isReviewMode && <p>Answered</p>}
                  {isReviewMode && isCorrect && <p>Correct</p>}
                  {isReviewMode && !isCorrect && !requiresReview && <p>Incorrect</p>}
                  {isReviewMode && requiresReview && <p>Needs Review</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      
      {/* Submit confirmation dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Practice Questions</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your answers? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {!allQuestionsAnswered && hasAttemptedSubmit && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 dark:bg-yellow-950 dark:border-yellow-800">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-700 dark:text-yellow-500 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                    You haven&apos;t answered all questions
                  </h3>
                  <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-500">
                    You&apos;ve answered {answeredCount} out of {totalQuestions} questions. Unanswered questions will be marked as incorrect.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}