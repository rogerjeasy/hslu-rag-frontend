"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecentActivity from './recent-activity/RecentActivity';
import CourseCards from './CourseCards';
import StudyProgress from './StudyProgress';
import UpcomingExams from './UpcomingExams';
import QuickAccess from './QuickAccess';
import StatsOverview from './StatsOverview';
import StudyOptionsDialog from './StudyOptionsDialog';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function DashboardContent() {
  const user = useUserStore(state => state.user);
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  const hasChecked = useUserStore(state => state.hasChecked);
  const router = useRouter();
 
  // Redirect to login if not authenticated
  useEffect(() => {
    if (hasChecked && !isAuthenticated) {
      router.push('/login');
    }
  }, [hasChecked, isAuthenticated, router]);

  // Handle loading state while checking authentication
  if (!hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated but no user data available yet, show loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get user's first name for display
  const firstName = user.firstName || user.email || 'Student';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
          <p className="text-muted-foreground">
            Continue your studies where you left off
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2"
        >
          {/* Use the StudyOptionsDialog component with the Start Studying button as trigger */}
          <StudyOptionsDialog 
            trigger={<Button>Start Studying</Button>} 
          />
          <Button variant="outline" onClick={() => router.push('/courses/browse')}>
            Explore Courses
          </Button>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-4">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="progress">Study Progress</TabsTrigger>
          <TabsTrigger value="exams">Upcoming Exams</TabsTrigger>
        </TabsList>
       
        <TabsContent value="courses" className="space-y-4">
          <CourseCards />
          <QuickAccess />
        </TabsContent>
       
        <TabsContent value="progress" className="space-y-4">
          <StudyProgress />
          <RecentActivity />
        </TabsContent>
       
        <TabsContent value="exams" className="space-y-4">
          <UpcomingExams />
        </TabsContent>
      </Tabs>
    </div>
  );
}