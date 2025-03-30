// hooks/useSessionManagement.ts
import { useEffect, useRef } from 'react';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';

export function useSessionManagement(questionSetId: string) {
  const resetSession = usePracticeQuestionsStore(state => state.resetSession);
  // Use a ref to prevent multiple cleanup calls
  const isUnmountedRef = useRef(false);
  console.log("questionSetId", questionSetId);
  
  useEffect(() => {
    // Reset the ref on mount
    isUnmountedRef.current = false;
    
    return () => {
      // Only run cleanup once
      if (!isUnmountedRef.current) {
        isUnmountedRef.current = true;
        
        // Use a small timeout to ensure all component unmounting is complete
        // before resetting the session
        setTimeout(() => {
          resetSession();
        }, 50); // Increased from 0 to give more time for cleanup
      }
    };
  }, [resetSession]); // Add resetSession to dependency array
  
  return { isUnmountedRef };
}