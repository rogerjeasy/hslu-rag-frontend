'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionRenderer } from './QuestionRenderer';
import { PracticeSessionStats } from './PracticeSessionStats';
import { PracticeSessionControls } from './PracticeSessionControls';
import { QuestionProgress } from './QuestionProgress';
import { CitationModal } from './CitationModal';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { PracticeQuestionsSetType, UserAnswer, ContextType } from '@/types/practice-questions.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, RotateCcw, Award, Book } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import { useSessionManagement } from '@/hooks/useSessionManagement';

interface PracticeSessionProps {
  questionSetId: string;
  alreadyFetched?: boolean;
}

export function PracticeSession({ questionSetId, alreadyFetched = false }: PracticeSessionProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // Add resetSession to the list of imports from the store
  const currentSet = usePracticeQuestionsStore(state => state.currentSet);
  const session = usePracticeQuestionsStore(state => state.session);
  const fetchQuestionSetById = usePracticeQuestionsStore(state => state.fetchQuestionSetById);
  const startSession = usePracticeQuestionsStore(state => state.startSession);
  const endSession = usePracticeQuestionsStore(state => state.endSession);
  const nextQuestion = usePracticeQuestionsStore(state => state.nextQuestion);
  const previousQuestion = usePracticeQuestionsStore(state => state.previousQuestion);
  const jumpToQuestion = usePracticeQuestionsStore(state => state.jumpToQuestion);
  const submitAnswer = usePracticeQuestionsStore(state => state.submitAnswer);
  const resetSession = usePracticeQuestionsStore(state => state.resetSession);

  // Use our custom hook for session management
  const { isUnmountedRef } = useSessionManagement(questionSetId);
  
  const [isLoading, setIsLoading] = useState(!alreadyFetched);
  const [error, setError] = useState<string | null>(null);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<{
    citation: number;
    context?: ContextType;
  } | null>(null);
  
  // Track whether we've initialized the session
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  
  useEffect(() => {
    const loadQuestionSet = async () => {
      // Don't load if we're already unmounting
      if (isUnmountedRef.current) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Only fetch if not already fetched and we don't have a current set
        if (!alreadyFetched && !currentSet) {
          await fetchQuestionSetById(questionSetId);
        }
        
        // Start the session if it doesn't exist and we have a current set
        // Added extra check to make sure we have currentSet before starting session
        if (!session && !isSessionInitialized && currentSet) {
          startSession(questionSetId);
          setIsSessionInitialized(true);
        }
      } catch (error) {
        // Don't show errors if we're unmounting
        if (isUnmountedRef.current) return;
        
        console.error("Failed to load question set:", error);
        setError("Failed to load practice questions. Please try again."+ error);
        toast({
          title: "Error",
          description: "Failed to load practice questions",
          variant: "destructive",
        });
      } finally {
        if (!isUnmountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    
    loadQuestionSet();
    
    // No explicit cleanup here, handled by useSessionManagement
  }, [
    questionSetId, 
    fetchQuestionSetById, 
    startSession, 
    toast, 
    alreadyFetched, 
    session, 
    currentSet, 
    isUnmountedRef,
    isSessionInitialized
  ]);
  
  const handleShowCitation = (citationId: number) => {
    if (!currentSet) return;
    
    // Find the context for this citation
    const context = currentSet.context?.find(ctx => ctx.citationNumber === citationId);
    
    setSelectedCitation({
      citation: citationId,
      context,
    });
    
    setShowCitationModal(true);
  };
  
  const handleSubmitAnswer = (questionId: string, answer: UserAnswer['answer']) => {
    submitAnswer(questionId, answer);
  };
  
  // Improved session restart to avoid the race condition
  const handleRestartSession = () => {
    isUnmountedRef.current = true;
    
    // Use a longer timeout to ensure proper cleanup
    setTimeout(() => {
      resetSession();
      // Only start a new session if we have a valid question set
      if (currentSet) {
        startSession(questionSetId);
      }
      isUnmountedRef.current = false;
    }, 100);
  };
  
  // Improved navigation to avoid the race condition
  const handleBackToList = () => {
    isUnmountedRef.current = true;
    
    // Use a longer timeout to ensure proper cleanup
    setTimeout(() => {
      resetSession();
      router.push('/practice-questions');
    }, 100);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-600">Loading practice questions...</p>
      </div>
    );
  }
  
  // Error state with more detailed error message
  if (error || !currentSet || !session) {
    return (
      <Card className="w-full max-w-4xl mx-auto my-8">
        <CardContent className="flex flex-col items-center p-8">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Unable to Load Questions</h3>
          <p className="text-slate-600 text-center mb-6">
            {error || "Something went wrong while loading the practice questions."}
            {!currentSet && " No question set data is available."}
            {!session && " No active session could be created."}
          </p>
          <Button onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice Questions
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // CRITICAL NULL CHECKS: Ensure questions array exists before continuing
  if (!currentSet.questions || !Array.isArray(currentSet.questions)) {
    return (
      <Card className="w-full max-w-4xl mx-auto my-8">
        <CardContent className="flex flex-col items-center p-8">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Invalid Question Data</h3>
          <p className="text-slate-600 text-center mb-6">
            The question set data is invalid or incomplete. No questions are available.
          </p>
          <Button onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice Questions
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Get the current question based on the session state
  // Add additional null checks to prevent undefined access
  const questionsLength = currentSet.questions.length || 0;
  const currentIndex = Math.min(session.currentQuestionIndex || 0, questionsLength - 1);
  const currentQuestion = questionsLength > 0 ? currentSet.questions[currentIndex] : null;
  const currentUserAnswer = currentQuestion ? session.userAnswers[currentQuestion.id] : undefined;
  
  // Calculate if session is completed - with null checks
  const totalQuestions = currentSet.questions.length || 0;
  const answeredQuestions = session.stats?.answeredQuestions || 0;
  const isSessionCompleted = totalQuestions > 0 && answeredQuestions === totalQuestions;
  
  // Guard against rendering with invalid data
  if (!currentQuestion && !isSessionCompleted) {
    return (
      <Card className="w-full max-w-4xl mx-auto my-8">
        <CardContent className="flex flex-col items-center p-8">
          <div className="text-orange-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No Current Question</h3>
          <p className="text-slate-600 text-center mb-6">
            Unable to display the current question. The session data may be corrupted.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRestartSession}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart Session
            </Button>
            <Button onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Practice Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header with title and topic */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Practice Questions
            </h1>
            <p className="text-slate-600">
              {currentSet.topic || "Practice Set"}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBackToList}
            className="self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        {/* Progress indicators - with null checks */}
        {currentSet.questions && (
          <QuestionProgress 
            currentIndex={session.currentQuestionIndex || 0}
            totalQuestions={currentSet.questions.length || 0}
            answeredQuestions={Object.keys(session.userAnswers || {})}
            onJumpToQuestion={jumpToQuestion}
          />
        )}
        
        {/* Session completed view */}
        {isSessionCompleted ? (
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Award className="h-5 w-5 mr-2 text-amber-500" />
                Session Completed!
              </CardTitle>
              <CardDescription>
                You have answered all {session.stats?.totalQuestions || 0} questions. Here's your performance:
              </CardDescription>
            </CardHeader>
            <CardContent>
              {session.stats && <PracticeSessionStats stats={session.stats} />}
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleRestartSession}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restart Session
                </Button>
                <Button
                  onClick={handleBackToList}
                  className="flex items-center gap-2"
                >
                  <Book className="h-4 w-4" />
                  More Practice Sets
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Current question view - only render if currentQuestion exists */
          currentQuestion && (
            <QuestionRenderer
              question={currentQuestion}
              index={session.currentQuestionIndex || 0}
              userAnswer={currentUserAnswer}
              showExplanation={!!currentUserAnswer}
              showCitations={!!currentUserAnswer}
              isActive={true}
              onSubmitAnswer={handleSubmitAnswer}
              onShowCitation={handleShowCitation}
            />
          )
        )}
        
        {/* Navigation controls - only show if not completed and we have a current question */}
        {!isSessionCompleted && currentQuestion && (
          <PracticeSessionControls
            isFirstQuestion={session.currentQuestionIndex === 0}
            isLastQuestion={session.currentQuestionIndex === (currentSet.questions.length - 1)}
            canSubmit={!!currentQuestion && !currentUserAnswer}
            onPrevious={previousQuestion}
            onNext={nextQuestion}
            onSubmit={() => {
              /* This is handled by the question components */
            }}
          />
        )}
      </div>
      
      {/* Citation modal */}
      <CitationModal
        isOpen={showCitationModal}
        onClose={() => setShowCitationModal(false)}
        citation={selectedCitation?.citation}
        context={selectedCitation?.context}
      />
    </div>
  );
}