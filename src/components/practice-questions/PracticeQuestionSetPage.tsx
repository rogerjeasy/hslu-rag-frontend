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
import { transformPracticeQuestionResponse, PracticeQuestionSetResponse } from '@/types/practice-questions.types';
import { practiceQuestionsService } from '@/services/practiceQuestionsService';

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
  const [rawResponse, setRawResponse] = useState<PracticeQuestionSetResponse | null>(null);
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
          
          // First load the data through the store
          // This will populate currentSet but won't return the raw response
          await fetchQuestionSetById(id);
          
          // Separately fetch the raw response directly from the service
          // Since the store method doesn't return it
          try {
            const response = await practiceQuestionsService.fetchPracticeQuestionSet(id);
            setRawResponse(response);
            
            if (process.env.NODE_ENV !== 'production') {
              console.log('Raw API response:', response);
            }
          } catch (e) {
            console.error('Failed to get raw response:', e);
            // This is non-critical, so we'll continue even if it fails
          }
          
          setHasFetched(true);
          
          // Store debug info for both components
          const updatedSet = usePracticeQuestionsStore.getState().currentSet;
          setDebugInfo({
            currentSet: updatedSet,
            rawResponse: rawResponse
          });
          
          if (!updatedSet) {
            setLocalError('Failed to process the question set data');
            return;
          }
          
          if (!updatedSet.questions || !Array.isArray(updatedSet.questions) || updatedSet.questions.length === 0) {
            // Check if we have the raw response to diagnose further
            if (rawResponse && rawResponse.meta && rawResponse.meta.questions && 
                Array.isArray(rawResponse.meta.questions) && rawResponse.meta.questions.length > 0) {
              console.log('Found questions in raw response but not in transformed data:', 
                rawResponse.meta.questions.length);
              
              setLocalError('Questions found in API response but not properly processed');
            } else {
              setLocalError('The question set contains no questions or invalid data');
            }
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
      // Store debug info separately
      setDebugInfo({
        currentSet,
        rawResponse
      });
      
      // If we already have the set, verify it has questions
      if (!currentSet.questions || !Array.isArray(currentSet.questions) || currentSet.questions.length === 0) {
        setLocalError('The question set contains no questions or invalid data');
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
  
  // Function to manually try loading the raw response
  const fetchRawResponse = async () => {
    try {
      const response = await practiceQuestionsService.fetchPracticeQuestionSet(id);
      setRawResponse(response);
      
      // Update debug info
      setDebugInfo({
        ...debugInfo,
        rawResponse: response
      });
      
      return response;
    } catch (e) {
      console.error('Failed to fetch raw response:', e);
      return null;
    }
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
          
          {/* Debug Actions */}
          {showDebugInfo && (
            <div className="flex gap-2 mb-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchRawResponse}
              >
                Fetch Raw Response
              </Button>
            </div>
          )}
          
          {showDebugInfo && debugInfo && (
            <Card className="mt-2 bg-slate-50">
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-xs font-mono bg-slate-100 p-2 rounded-md overflow-auto max-h-96">
                  {/* Current Set Info */}
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
                  
                  {/* Raw Response Info */}
                  {rawResponse && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <strong>Raw Response Keys:</strong> {Object.keys(rawResponse).join(', ')}
                      
                      {rawResponse.meta && (
                        <div className="mt-2">
                          <strong>Raw Meta Keys:</strong> {Object.keys(rawResponse.meta).join(', ')}
                        </div>
                      )}
                      
                      {rawResponse.meta && 'questions' in rawResponse.meta && (
                        <div className="mt-2">
                          <strong>Raw Questions:</strong> {
                            rawResponse.meta.questions ? 
                              (Array.isArray(rawResponse.meta.questions) ? 
                                `Array with ${rawResponse.meta.questions.length} items` : 
                                `Not an array, type: ${typeof rawResponse.meta.questions}`) : 
                              'undefined'
                          }
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Manual Transformation Test */}
                  {rawResponse && rawResponse.meta && rawResponse.meta.questions && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <strong>Manual Transformation Test:</strong>
                      <button 
                        onClick={() => {
                          try {
                            const manualTransform = transformPracticeQuestionResponse(rawResponse);
                            console.log('Manual transform result:', manualTransform);
                            setDebugInfo({
                              ...debugInfo,
                              manualTransform
                            });
                          } catch (e) {
                            console.error('Manual transform failed:', e);
                            setDebugInfo({
                              ...debugInfo,
                              transformError: e instanceof Error ? e.message : String(e)
                            });
                          }
                        }}
                        className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        Try Transform
                      </button>
                      
                      {debugInfo?.manualTransform && (
                        <div className="mt-2">
                          <strong>Transform Result:</strong> Has questions: {
                            debugInfo.manualTransform.questions && 
                            Array.isArray(debugInfo.manualTransform.questions) ? 
                              `Yes (${debugInfo.manualTransform.questions.length})` : 'No'
                          }
                        </div>
                      )}
                      
                      {debugInfo?.transformError && (
                        <div className="mt-2 text-red-600">
                          <strong>Transform Error:</strong> {debugInfo.transformError}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Full Debug Objects */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <strong>Full Debug Data:</strong>
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
          
          {/* Debug Actions */}
          {showDebugInfo && (
            <div className="flex gap-2 mb-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchRawResponse}
              >
                Fetch Raw Response
              </Button>
            </div>
          )}
          
          {showDebugInfo && (
            <Card className="mt-2 bg-slate-50">
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-xs font-mono bg-slate-100 p-2 rounded-md overflow-auto max-h-96">
                  {/* Current Set Info */}
                  <div>
                    <strong>Current Set Keys:</strong> {currentSet ? Object.keys(currentSet).join(', ') : 'null'}
                  </div>
                  
                  {currentSet && currentSet.meta && (
                    <div className="mt-2">
                      <strong>Meta Keys:</strong> {Object.keys(currentSet.meta).join(', ')}
                    </div>
                  )}
                  
                  {/* Raw Response Info */}
                  {rawResponse && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <strong>Raw Response Keys:</strong> {Object.keys(rawResponse).join(', ')}
                      
                      {rawResponse.meta && (
                        <div className="mt-2">
                          <strong>Raw Meta Keys:</strong> {Object.keys(rawResponse.meta).join(', ')}
                        </div>
                      )}
                      
                      {rawResponse.meta && 'questions' in rawResponse.meta && (
                        <div className="mt-2">
                          <strong>Raw Questions:</strong> {
                            rawResponse.meta.questions ? 
                              (Array.isArray(rawResponse.meta.questions) ? 
                                `Array with ${rawResponse.meta.questions.length} items` : 
                                `Not an array, type: ${typeof rawResponse.meta.questions}`) : 
                              'undefined'
                          }
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Fix Button */}
                  {rawResponse && rawResponse.meta && rawResponse.meta.questions && 
                   Array.isArray(rawResponse.meta.questions) && rawResponse.meta.questions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          try {
                            // Manual fix attempt
                            const manual = transformPracticeQuestionResponse(rawResponse);
                            usePracticeQuestionsStore.setState({
                              currentSet: manual,
                              error: null
                            });
                            // Refresh the page
                            window.location.reload();
                          } catch (e) {
                            console.error('Fix attempt failed:', e);
                            setLocalError(`Fix attempt failed: ${e instanceof Error ? e.message : String(e)}`);
                          }
                        }}
                      >
                        Attempt Fix
                      </Button>
                    </div>
                  )}
                  
                  {/* Full Debug Objects */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <strong>Current Set:</strong>
                    <pre>{JSON.stringify(currentSet, null, 2)}</pre>
                  </div>
                  
                  {rawResponse && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <strong>Raw Response:</strong>
                      <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
                    </div>
                  )}
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