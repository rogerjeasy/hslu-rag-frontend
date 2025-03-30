'use client';
import React, { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { PracticeSession } from '@/components/practice-questions/detail/PracticeSession';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { ArrowLeft, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import { useSessionManagement } from '@/hooks/useSessionManagement';

interface PracticeQuestionSetPageProps {
  params: {
    id: string;
  };
}

export default function PracticeQuestionSetPage({ params }: PracticeQuestionSetPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = params;
  
  // Use selective state subscriptions to prevent unnecessary re-renders
  const fetchQuestionSetById = usePracticeQuestionsStore(state => state.fetchQuestionSetById);
  const currentSet = usePracticeQuestionsStore(state => state.currentSet);
  const isLoading = usePracticeQuestionsStore(state => state.isLoading);
  const error = usePracticeQuestionsStore(state => state.error);
  const resetSession = usePracticeQuestionsStore(state => state.resetSession);
  
  // Use our custom hook for session management
  const { isUnmountedRef } = useSessionManagement(id);
 
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(false);
 
  // Load question set data
  useEffect(() => {
    // Don't load if we're already unmounting
    if (isUnmountedRef.current) return;
    
    // Only fetch if we haven't fetched already
    if (!hasFetched && !currentSet) {
      const loadQuestionSet = async () => {
        try {
          setIsInitializing(true);
          setLocalError(null);
          
          await fetchQuestionSetById(id);
          setHasFetched(true);
          
          // Check if the data has questions after fetching
          const updatedSet = usePracticeQuestionsStore.getState().currentSet;
          
          // Store debug info separately without concatenating
          setDebugInfo(updatedSet);
          
          if (updatedSet && (!updatedSet.questions || !Array.isArray(updatedSet.questions) || updatedSet.questions.length === 0)) {
            setLocalError('The question set contains no questions or invalid data---user effect:' + JSON.stringify(updatedSet));
          }
        } catch (error) {
          // Don't show errors if we're unmounting
          if (isUnmountedRef.current) return;
          
          console.error("Failed to load practice question set:", error);
          setLocalError('Failed to load practice questions. Please try again.');
          setDebugInfo(error);
          
          toast({
            title: "Error",
            description: "Failed to load practice question set",
            variant: "destructive",
          });
        } finally {
          if (!isUnmountedRef.current) {
            setIsInitializing(false);
          }
        }
      };
     
      loadQuestionSet();
    } else if (currentSet) {
      // Store debug info separately without concatenating
      setDebugInfo(currentSet);
      
      // If we already have the set, verify it has questions
      if (!currentSet.questions || !Array.isArray(currentSet.questions) || currentSet.questions.length === 0) {
        setLocalError('The question set contains no questions or invalid data -- part 2' + JSON.stringify(currentSet));
      }
      
      // Update the initializing state
      setIsInitializing(false);
    }
  }, [id, fetchQuestionSetById, toast, currentSet, hasFetched, isUnmountedRef]);
 
  const handleBackToList = () => {
    // Mark component as unmounted before navigating
    isUnmountedRef.current = true;
    
    // Reset the session before navigating away
    resetSession();
    
    // Use a timeout to ensure clean navigation
    setTimeout(() => {
      router.push('/practice-questions');
    }, 50);
  };
  
  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };
 
  // Show not found if the ID is invalid
  if (!isInitializing && !isLoading && !currentSet) {
    notFound();
  }
 
  // Loading state
  if (isInitializing || isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToList}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-1/3" />
        </div>
       
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-32 w-full" />
              <div className="flex justify-between pt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
 
  // Error state - check both global and local errors
  if (error || localError) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToList}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Practice Questions</h1>
        </div>
       
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || localError}
          </AlertDescription>
        </Alert>

        {/* Developer debug information */}
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={toggleDebugInfo}
            className="mb-2"
            size="sm"
          >
            <Info className="h-4 w-4 mr-2" />
            {showDebugInfo ? 'Hide' : 'Show'} Debug Info
          </Button>
          
          {showDebugInfo && debugInfo && (
            <Card className="mt-2 bg-slate-50">
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-xs font-mono bg-slate-100 p-2 rounded-md overflow-auto max-h-96">
                  <div>
                    <strong>Current Set Keys:</strong> {currentSet ? Object.keys(currentSet).join(', ') : 'null'}
                  </div>
                  {currentSet && currentSet.meta && (
                    <div className="mt-2">
                      <strong>Meta Keys:</strong> {Object.keys(currentSet.meta).join(', ')}
                    </div>
                  )}
                  {currentSet && 'questions' in currentSet && (
                    <div className="mt-2">
                      <strong>Questions:</strong> {
                        currentSet.questions ? 
                          (Array.isArray(currentSet.questions) ? 
                            `Array with ${currentSet.questions.length} items` : 
                            `Not an array, type: ${typeof currentSet.questions}`) : 
                          'undefined'
                      }
                    </div>
                  )}
                  {currentSet && currentSet.meta && 'questions' in currentSet.meta && (
                    <div className="mt-2">
                      <strong>Meta Questions:</strong> {
                        currentSet.meta.questions ? 
                          (Array.isArray(currentSet.meta.questions) ? 
                            `Array with ${currentSet.meta.questions.length} items` : 
                            `Not an array, type: ${typeof currentSet.meta.questions}`) : 
                          'undefined'
                      }
                    </div>
                  )}
                  <div className="mt-4">
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
       
        <div className="mt-4 flex justify-center">
          <Button onClick={handleBackToList}>
            Return to Practice Questions
          </Button>
        </div>
      </div>
    );
  }
  
  // Check for data validity before rendering the practice session
  const hasValidData = currentSet && 
                     currentSet.questions && 
                     Array.isArray(currentSet.questions) && 
                     currentSet.questions.length > 0;
  
  if (!hasValidData) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToList}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Practice Questions</h1>
        </div>
      
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Question Data</AlertTitle>
          <AlertDescription>
            The question set contains no questions or invalid data. Please try another set.
          </AlertDescription>
        </Alert>
        
        {/* Developer debug information */}
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={toggleDebugInfo}
            className="mb-2"
            size="sm"
          >
            <Info className="h-4 w-4 mr-2" />
            {showDebugInfo ? 'Hide' : 'Show'} Debug Info
          </Button>
          
          {showDebugInfo && (
            <Card className="mt-2 bg-slate-50">
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-xs font-mono bg-slate-100 p-2 rounded-md overflow-auto max-h-96">
                  <div>
                    <strong>Current Set Keys:</strong> {currentSet ? Object.keys(currentSet).join(', ') : 'null'}
                  </div>
                  {currentSet && currentSet.meta && (
                    <div className="mt-2">
                      <strong>Meta Keys:</strong> {Object.keys(currentSet.meta).join(', ')}
                    </div>
                  )}
                  <div className="mt-4">
                    <pre>{JSON.stringify(currentSet, null, 2)}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      
        <div className="mt-4 flex justify-center">
          <Button onClick={handleBackToList}>
            Return to Practice Questions
          </Button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Pass alreadyFetched flag to PracticeSession to prevent duplicate fetching */}
      {currentSet && (
        <PracticeSession questionSetId={id} alreadyFetched={true} />
      )}
    </div>
  );
}