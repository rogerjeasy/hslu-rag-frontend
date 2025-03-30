'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePracticeQuestionsStore } from '@/store/practice-questions-responses.store';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import QuestionCard from './QuestionCard';
import QuestionProgress from './QuestionProgress';
import PracticeSessionSummary from './PracticeSessionSummary';
import ExplanationModal from './ExplanationModal';
import CitationsModal from './CitationsModal';
import NoQuestionsGenerated from './NoQuestionsGenerated';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PracticeQuestionsPageProps {
  params: {
    id: string;
  };
}

export default function PracticeQuestionsPage({ params }: PracticeQuestionsPageProps) {
  const { id } = params;
  const router = useRouter();
  
  // State for modals
  const [explanationModalOpen, setExplanationModalOpen] = useState(false);
  const [citationsModalOpen, setCitationsModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [selectedCitations, setSelectedCitations] = useState<number[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  
  // Get store state and actions
  const { 
    currentSet, 
    isLoading, 
    error, 
    session,
    fetchPracticeQuestionSet,
    startSession,
    answerQuestion,
    moveToQuestion,
    checkAnswer,
    finishSession,
    resetSession
  } = usePracticeQuestionsStore();

  // Fetch practice question set on mount
  useEffect(() => {
    fetchPracticeQuestionSet(id);
  }, [id, fetchPracticeQuestionSet]);

  // Start session when set is loaded
  useEffect(() => {
    if (currentSet && !session && !isLoading) {
      // Ensure the questions array exists and is not empty
      if (currentSet.questions && currentSet.questions.length > 0) {
        startSession();
      }
    }
  }, [currentSet, session, isLoading, startSession]);

  // Handlers
  const handleBackToList = () => {
    router.push('/practice-questions');
  };

  const handleAnswer = (questionId: string, answer: string | string[] | Record<string, string>) => {
    answerQuestion(questionId, answer);
    // Optional: automatically check the answer
    checkAnswer(questionId);
  };

  const handleShowExplanation = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setExplanationModalOpen(true);
  };

  const handleShowCitations = (citationNumbers: number[]) => {
    setSelectedCitations(citationNumbers);
    setCitationsModalOpen(true);
  };

  const handleFinishReview = () => {
    resetSession();
    router.push('/practice-questions');
  };

  const handleRetry = () => {
    // Navigate to the create practice questions page with prefilled topic
    if (currentSet) {
      router.push(`/practice-questions/create?topic=${encodeURIComponent(currentSet.topic)}`);
    } else {
      router.push('/practice-questions/create');
    }
  };

  // If still loading
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>
    );
  }

  // If error
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try again or contact support if the problem persists.
          </AlertDescription>
        </Alert>
        <Button onClick={handleBackToList} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Practice Questions
        </Button>
      </div>
    );
  }

  // If no data or questions
  if (!currentSet || !currentSet.questions || currentSet.questions.length === 0) {
    return (
      <NoQuestionsGenerated 
        currentSet={currentSet} 
        onBackToList={handleBackToList}
        onRetry={handleRetry}
      />
    );
  }

  // If session hasn't started yet
  if (!session) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>
    );
  }

  // Selected question for explanation modal
  const selectedQuestion = currentSet.questions.find(q => q.id === selectedQuestionId);
  
  // Get current question
  const currentQuestion = currentSet.questions[session.currentQuestionIndex];

  // If session is finished and in summary view
  if (session.endTime && !isReviewMode) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={handleBackToList} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Practice Questions
        </Button>
        
        <PracticeSessionSummary 
          stats={session.stats} 
          topic={currentSet.topic}
          onRestart={() => {
            resetSession();
            startSession();
          }}
          onFinish={() => setIsReviewMode(true)}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBackToList}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        
        {isReviewMode && (
          <Button 
            variant="outline" 
            onClick={handleFinishReview}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Finish Review
          </Button>
        )}
        
        {!isReviewMode && !session.endTime && (
          <Button 
            variant="outline" 
            onClick={() => finishSession()}
          >
            Finish Session
          </Button>
        )}
      </div>
      
      {/* Practice set info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentSet.topic}</h1>
        <p className="text-gray-600">
          {currentSet.questionCount} questions · {currentSet.difficulty} difficulty
        </p>
      </div>
      
      {/* Question progress bar */}
      <QuestionProgress 
        questions={currentSet.questions}
        userAnswers={session.userAnswers}
        currentQuestionIndex={session.currentQuestionIndex}
        onNavigate={moveToQuestion}
        completionPercentage={session.stats.completionPercentage}
      />
      
      {/* Current question card */}
      <QuestionCard 
        question={currentQuestion}
        index={session.currentQuestionIndex}
        totalQuestions={currentSet.questions.length}
        userAnswer={session.userAnswers[currentQuestion.id]}
        onAnswer={handleAnswer}
        onShowExplanation={handleShowExplanation}
        onShowCitations={handleShowCitations}
        isReviewMode={isReviewMode}
      />
      
      {/* Review mode */}
      {isReviewMode && (
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (session.currentQuestionIndex > 0) {
                moveToQuestion(session.currentQuestionIndex - 1);
              }
            }}
            disabled={session.currentQuestionIndex === 0}
          >
            Previous Question
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (session.currentQuestionIndex < currentSet.questions.length - 1) {
                moveToQuestion(session.currentQuestionIndex + 1);
              }
            }}
            disabled={session.currentQuestionIndex === currentSet.questions.length - 1}
          >
            Next Question
          </Button>
        </div>
      )}
      
      {/* Explanation modal */}
      <ExplanationModal 
        isOpen={explanationModalOpen}
        onClose={() => setExplanationModalOpen(false)}
        question={selectedQuestion}
      />
      
      {/* Citations modal */}
      <CitationsModal 
        isOpen={citationsModalOpen}
        onClose={() => setCitationsModalOpen(false)}
        citationNumbers={selectedCitations}
        context={currentSet.context}
      />
    </div>
  );
}