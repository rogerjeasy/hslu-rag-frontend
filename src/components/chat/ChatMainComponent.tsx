"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ChatContainer from '@/components/chat/ChatContainer';
import { useUserStore } from '@/store/userStore';
import { BookOpen } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner'; // Make sure this component exists

const ChatMainComponent = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Get authentication state from user store
  const { user, isAuthenticated, hasChecked } = useUserStore();
  
  const courseIdParam = params.courseId || searchParams.get('courseId');
  
  const [currentCourse, setCurrentCourse] = useState<string | undefined>(
    typeof courseIdParam === 'string' ? courseIdParam : undefined
  );
  
  // Update current course when the param changes
  useEffect(() => {
    if (typeof courseIdParam === 'string') {
      setCurrentCourse(courseIdParam);
    }
  }, [courseIdParam]);
  
  // Handle loading and authentication state
  useEffect(() => {
    if (hasChecked && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(`/login?redirectTo=${window.location.pathname}`);
    }
  }, [hasChecked, isAuthenticated, router]);
  
  // Show loading state while checking authentication
  if (!hasChecked || !isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full p-4">
        <div className="relative">
          <BookOpen className="h-12 w-12 text-primary/30 absolute animate-ping opacity-75" />
          <BookOpen className="h-12 w-12 text-primary relative" />
        </div>
        <h3 className="mt-6 text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Chat Assistant
        </h3>
        {/* Uncomment if you have a LoadingSpinner component */}
        {/* <LoadingSpinner size="lg" className="text-primary mt-6" /> */}
        <div className="mt-6 h-8 w-8 rounded-full border-4 border-primary border-r-transparent animate-spin"></div>
        <p className="mt-4 text-muted-foreground animate-pulse">Verifying your session...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ChatContainer currentCourse={currentCourse} />
    </div>
  );
};

export default ChatMainComponent;