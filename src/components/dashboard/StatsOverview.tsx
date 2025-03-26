"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, FileQuestion, GraduationCap, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import { useStatisticsStore } from '@/store/statisticsStore';
import { formatDuration } from './recent-activity/ActivityUtils';

// Animation variants for container
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Component that displays an overview of the user's statistics
 */
const StatsOverview: React.FC = () => {
  const { myStats, isLoading } = useStatisticsStore();

  console.log(isLoading);
  
  // If we have actual stats from the API, use them
  // Otherwise fallback to placeholder values for layout
  const totalStudyTime = myStats?.totalStudyTime 
    ? formatDuration(myStats.totalStudyTime)
    : '0h';
    
  const courseCompletion = myStats?.coursesEnrolled 
    ? Math.round((myStats.totalConversations / (myStats.coursesEnrolled * 10)) * 100) 
    : 0;
    
  const practiceQuestions = myStats?.totalPracticeQuestions || 0;
  
  // Calculate a pseudo exam readiness based on available stats
  const calculateExamReadiness = () => {
    if (!myStats) return 0;
    
    // This is a simple heuristic - in a real app, you'd have a more sophisticated calculation
    const conversationWeight = 0.3;
    const questionWeight = 0.4;
    const studyTimeWeight = 0.3;
    
    const conversationScore = Math.min(myStats.totalConversations, 50) / 50;
    const questionScore = Math.min(myStats.totalPracticeQuestions, 100) / 100;
    const studyTimeScore = Math.min(myStats.totalStudyTime, 50) / 50;
    
    return Math.round(
      (conversationScore * conversationWeight + 
      questionScore * questionWeight + 
      studyTimeScore * studyTimeWeight) * 100
    );
  };
  
  const examReadiness = calculateExamReadiness();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <StatCard
        title="Study Time"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        value={totalStudyTime}
        subValue={myStats?.averageSessionDuration ? `Avg. session: ${formatDuration(myStats.averageSessionDuration)}` : 'No recent sessions'}
      />

      <StatCard
        title="Course Completion"
        icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        value={`${courseCompletion}%`}
        showProgress={true}
        progressValue={courseCompletion}
      />

      <StatCard
        title="Practice Questions"
        icon={<FileQuestion className="h-4 w-4 text-muted-foreground" />}
        value={practiceQuestions.toString()}
        subValue={myStats ? `${myStats.coursesEnrolled} enrolled courses` : 'No courses yet'}
      />

      <StatCard
        title="Exam Readiness"
        icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
        value={`${examReadiness}%`}
        trend={{
          value: "Based on your progress",
          icon: <TrendingUp className="h-3 w-3 text-green-500" />,
          positive: true
        }}
      />
    </motion.div>
  );
};

export default StatsOverview;