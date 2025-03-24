'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import KnowledgeGapDashboard from '@/components/knowledge-gap/KnowledgeGapDashboard';
import { CourseSelector } from '@/components/courses/CourseSelector';
import { useUserStore } from "@/store/userStore";
import { useCourseStore } from '@/store/courseStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function KnowledgeGapDashboardWrapper() {
  const { user, isAuthenticated, hasChecked } = useUserStore();
  const { courses, isLoading: coursesLoading, error: coursesError, fetchCourses } = useCourseStore();
  const router = useRouter();
  const searchParams = useSearchParams();
 
  const courseId = searchParams.get('courseId');
 
  useEffect(() => {
    // Only fetch courses when authenticated and courses aren't loaded yet
    if (user && !coursesLoading && courses.length === 0) {
      fetchCourses();
    }
  }, [isAuthenticated, user, courses, coursesLoading, fetchCourses]);
 
  // Handle loading and authentication state
  useEffect(() => {
    if (hasChecked && !isAuthenticated) {
      router.push('/login?redirectTo=/knowledge-gaps');
    }
  }, [hasChecked, isAuthenticated, router]);
 
  // Show loading state while checking authentication
  if (!hasChecked || !isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <LoadingSpinner size="lg" className="text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">Verifying your session...</p>
      </div>
    );
  }
 
  if (coursesError) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <ErrorAlert
              message={coursesError}
              title="Failed to load courses"
              onRetry={() => fetchCourses()}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
 
  if (coursesLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[60%] mb-2" />
            <Skeleton className="h-4 w-[80%]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[70%]" />
                <div className="flex gap-2 mt-1">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
 
  if (courses.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6">
        <EmptyState
          title="No courses found"
          description="You need to be enrolled in at least one course to access knowledge gap assessments."
          icon={<BookOpen className="h-16 w-16 text-primary/40" />}
          action={{
            label: "Explore courses",
            onClick: () => router.push('/courses')
          }}
        />
      </div>
    );
  }
 
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-gradient-to-r from-primary/10 to-secondary/5 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary animate-pulse" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Knowledge Gap Assessment</h1>
        </div>
        
        {courses.length > 1 && (
          <div className="w-full sm:w-auto">
            <CourseSelector
              courses={courses}
              selectedCourseId={courseId || undefined}
              onCourseChange={(id) => {
                const params = new URLSearchParams(searchParams.toString());
                if (id) {
                  params.set('courseId', id);
                } else {
                  params.delete('courseId');
                }
                router.push(`/knowledge-gaps?${params.toString()}`);
              }}
            />
          </div>
        )}
      </div>
      
      <Card className="border-primary/20 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-0">
          <KnowledgeGapDashboard courseId={courseId || undefined} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:shadow-blue-100">
          <CardHeader className="flex flex-row items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500 group-hover:text-blue-700 transition-colors duration-300" />
            <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Study Resources</h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access comprehensive study materials to strengthen your understanding in weak areas.
            </p>
            <Button 
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300" 
              onClick={() => router.push('/resources')}
            >
              View resources
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:shadow-emerald-100">
          <CardHeader className="flex flex-row items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500 group-hover:text-emerald-700 transition-colors duration-300" />
            <h3 className="text-lg font-medium bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Practice Tests</h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Take practice tests to evaluate your progress and reinforce your knowledge.
            </p>
            <Button 
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300" 
              onClick={() => router.push('/practice-questions')}
            >
              Start practice
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}