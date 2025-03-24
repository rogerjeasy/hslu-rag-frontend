"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheck, AlarmClock, Award, CalendarDays, Brain, TrendingUp } from 'lucide-react';
import { QuestionSetSummary } from '@/types/practice-questions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface HistoryStatsProps {
  questionSets: QuestionSetSummary[];
}

export function HistoryStats({ questionSets }: HistoryStatsProps) {
  // Calculate statistics
  const totalSets = questionSets.length;
  const totalQuestions = questionSets.reduce((sum, set) => sum + set.questionCount, 0);
  
  // Mock data for stats - in a real app, this would come from your API
  const completedSets = Math.floor(totalSets * 0.8); // 80% completed for demo purposes
  const averageScore = 82; // Mock average score
  const streakDays: number = 5;
  const studyTimeHours = totalSets * 0.25; // Estimate 15 minutes per set
  
  // Aggregate question types
  // const questionTypesCount = questionSets.reduce((acc, set) => {
  //   set.types.forEach(type => {
  //     acc[type] = (acc[type] || 0) + 1;
  //   });
  //   return acc;
  // }, {} as Record<string, number>);
  
  // const mostFrequentType = Object.entries(questionTypesCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  
  // Format for display
  const formattedStudyTime = studyTimeHours.toFixed(1);
  
  // Recent activity - last 7 days
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  const recentSets = questionSets.filter(set => 
    new Date(set.createdAt) >= last7Days
  ).length;
  
  const statsItems = [
    {
      title: "Completed Sets",
      value: completedSets,
      suffix: `/ ${totalSets}`,
      icon: <CircleCheck className="h-4 w-4 text-green-500" />,
      description: "Practice sets completed",
      color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
      textColor: "text-green-700 dark:text-green-300"
    },
    {
      title: "Questions Attempted",
      value: totalQuestions,
      icon: <Brain className="h-4 w-4 text-purple-500" />,
      description: "Total questions",
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800",
      textColor: "text-purple-700 dark:text-purple-300"
    },
    {
      title: "Study Time",
      value: formattedStudyTime,
      suffix: "h",
      icon: <AlarmClock className="h-4 w-4 text-blue-500" />,
      description: "Total hours spent",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      title: "Average Score",
      value: averageScore,
      suffix: "%",
      icon: <Award className="h-4 w-4 text-yellow-500" />,
      description: "Across all sets",
      color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800",
      textColor: "text-yellow-700 dark:text-yellow-300"
    },
    {
      title: "Current Streak",
      value: streakDays,
      suffix: streakDays === 1 ? " day" : " days",
      icon: <TrendingUp className="h-4 w-4 text-red-500" />,
      description: "Consecutive days",
      color: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",
      textColor: "text-red-700 dark:text-red-300"
    },
    {
      title: "Recent Activity",
      value: recentSets,
      suffix: recentSets === 1 ? " set" : " sets",
      icon: <CalendarDays className="h-4 w-4 text-teal-500" />,
      description: "Last 7 days",
      color: "bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800",
      textColor: "text-teal-700 dark:text-teal-300"
    }
  ];

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Practice Statistics</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-2 h-9">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="details" className="text-xs">Detailed Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {statsItems.slice(0, 3).map((item, index) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`shadow-none border ${item.color} transition-colors`}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-muted-foreground">{item.title}</span>
                        {item.icon}
                      </div>
                      <div className={`text-xl font-bold ${item.textColor}`}>
                        {item.value}{item.suffix}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {statsItems.slice(3).map((item, index) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`shadow-none border ${item.color} transition-colors`}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-muted-foreground">{item.title}</span>
                        {item.icon}
                      </div>
                      <div className={`text-xl font-bold ${item.textColor}`}>
                        {item.value}{item.suffix}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}