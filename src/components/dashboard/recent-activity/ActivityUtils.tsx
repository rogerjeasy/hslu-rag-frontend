"use client";
import React from 'react';
import { 
  BookOpen, 
  FileQuestion, 
  Bookmark, 
  FileText, 
  BrainCircuit,
  Award, 
  Clock 
} from 'lucide-react';
import { UserStatistics } from '@/types/statistics.types';
import { Activity } from './ActivityTypes';

/**
 * Formats timestamp to human-readable relative time (e.g., "2 hours ago")
 */
export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const activityDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  return activityDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Formats duration in minutes to a readable format (e.g., "45 min" or "1h 30m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min';
  }
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 
    ? `${hours}h ${remainingMins}m` 
    : `${hours}h`;
}

/**
 * Generate activities from user statistics data obtained from the API
 */
export function generateActivitiesFromStats(userStats: UserStatistics): Activity[] {
  const activities: Activity[] = [];
  
  // Add study time activity if available
  if (userStats.lastActive && userStats.averageSessionDuration > 0) {
    activities.push({
      id: 'recent-study',
      icon: <BookOpen className="h-4 w-4" />,
      title: `Last study session: ${formatDuration(userStats.averageSessionDuration)}`,
      time: formatTimeAgo(userStats.lastActive),
      duration: formatDuration(userStats.averageSessionDuration),
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      type: 'study'
    });
  }
  
  // Total study time if available
  if (userStats.totalStudyTime > 0) {
    activities.push({
      id: 'total-study-time',
      icon: <Clock className="h-4 w-4" />,
      title: `Total time spent studying: ${formatDuration(userStats.totalStudyTime)}`,
      time: userStats.lastUpdated ? formatTimeAgo(userStats.lastUpdated) : 'Recently',
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      type: 'study'
    });
  }
  
  // Add practice questions activity if available
  if (userStats.totalPracticeQuestions > 0) {
    activities.push({
      id: 'practice-questions',
      icon: <FileQuestion className="h-4 w-4" />,
      title: `Completed ${userStats.totalPracticeQuestions} practice question${userStats.totalPracticeQuestions === 1 ? '' : 's'}`,
      time: userStats.lastUpdated ? formatTimeAgo(userStats.lastUpdated) : 'Recently',
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      type: 'practice'
    });
  }
  
  // Add study guides activity if available
  if (userStats.totalStudyGuides > 0) {
    activities.push({
      id: 'study-guides',
      icon: <Bookmark className="h-4 w-4" />,
      title: `Created ${userStats.totalStudyGuides} study guide${userStats.totalStudyGuides === 1 ? '' : 's'}`,
      time: userStats.lastUpdated ? formatTimeAgo(userStats.lastUpdated) : 'Recently',
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      type: 'guide'
    });
  }
  
  // Add knowledge gaps activity if available
  if (userStats.totalKnowledgeGaps > 0) {
    activities.push({
      id: 'knowledge-gaps',
      icon: <BrainCircuit className="h-4 w-4" />,
      title: `Completed ${userStats.totalKnowledgeGaps} knowledge assessment${userStats.totalKnowledgeGaps === 1 ? '' : 's'}`,
      time: userStats.lastUpdated ? formatTimeAgo(userStats.lastUpdated) : 'Recently',
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      type: 'knowledge'
    });
  }
  
  // Add strongest topics if available
  if (userStats.strongestTopics && userStats.strongestTopics.length > 0) {
    activities.push({
      id: 'strongest-topics',
      icon: <Award className="h-4 w-4" />,
      title: `Strongest topic: ${userStats.strongestTopics[0]}`,
      time: userStats.lastUpdated ? formatTimeAgo(userStats.lastUpdated) : 'Recently',
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      type: 'course'
    });
  }
  
  // Add weakest topics if available
  if (userStats.weakestTopics && userStats.weakestTopics.length > 0) {
    activities.push({
      id: 'weakest-topics',
      icon: <FileText className="h-4 w-4" />,
      title: `Topic to improve: ${userStats.weakestTopics[0]}`,
      time: userStats.lastUpdated ? formatTimeAgo(userStats.lastUpdated) : 'Recently',
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      type: 'knowledge'
    });
  }

  // Add courses enrolled if available
  if (userStats.coursesEnrolled > 0) {
    activities.push({
      id: 'courses-enrolled',
      icon: <BookOpen className="h-4 w-4" />,
      title: `Enrolled in ${userStats.coursesEnrolled} course${userStats.coursesEnrolled === 1 ? '' : 's'}`,
      time: userStats.lastUpdated ? formatTimeAgo(userStats.lastUpdated) : 'Recently',
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      type: 'course'
    });
  }
  
  return activities;
}

/**
 * Sorts activities by time, placing the most recent first
 */
export function sortActivitiesByTime(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => {
    // If time is in a format that can be parsed to Date
    if (a.time && b.time) {
      try {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        if (!isNaN(timeA) && !isNaN(timeB)) {
          return timeB - timeA;
        }
      } catch (e) {
        // If there's any error in parsing dates, don't sort
        console.warn('Error sorting activity times:', e);
      }
    }
    return 0;
  });
}