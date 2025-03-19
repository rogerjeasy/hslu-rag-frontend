// src/components/dashboard/RecentActivity.tsx
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileQuestion, Bookmark, FileText } from 'lucide-react';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      icon: <BookOpen className="h-4 w-4" />,
      title: "Studied Machine Learning - Chapter 3",
      time: "2 hours ago",
      duration: "45 min",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      id: 2,
      icon: <FileQuestion className="h-4 w-4" />,
      title: "Completed practice set on Neural Networks",
      time: "Yesterday",
      duration: "30 min",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      id: 3,
      icon: <Bookmark className="h-4 w-4" />,
      title: "Saved study guide for Database Systems",
      time: "2 days ago",
      duration: "5 min",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      id: 4,
      icon: <FileText className="h-4 w-4" />,
      title: "Generated summary for Statistics module",
      time: "3 days ago",
      duration: "15 min",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start px-2 py-2 rounded-lg hover:bg-muted transition-colors">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.duration}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}