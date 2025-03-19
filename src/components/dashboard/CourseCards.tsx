// src/components/dashboard/CourseCards.tsx
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function CourseCards() {
  // Mock course data
  const courses = [
    {
      id: 1,
      title: "Machine Learning",
      description: "Fundamentals of machine learning algorithms and applications",
      progress: 75,
      lastStudied: "2 days ago",
      timeSpent: "12.5h",
      badgeText: "Active",
      badgeVariant: "default" as const,
    },
    {
      id: 2,
      title: "Data Science 101",
      description: "Introduction to data science principles and methodologies",
      progress: 90,
      lastStudied: "Yesterday",
      timeSpent: "15h",
      badgeText: "Advanced",
      badgeVariant: "secondary" as const,
    },
    {
      id: 3,
      title: "Big Data Analytics",
      description: "Processing and analyzing large-scale data sets",
      progress: 45,
      lastStudied: "1 week ago",
      timeSpent: "5h",
      badgeText: "New",
      badgeVariant: "outline" as const,
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <h2 className="text-xl font-semibold mb-4">My Courses</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <motion.div key={course.id} variants={itemVariants}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{course.title}</CardTitle>
                  <Badge variant={course.badgeVariant}>{course.badgeText}</Badge>
                </div>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.timeSpent}</span>
                    </div>
                    <span>Last studied: {course.lastStudied}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="default" className="w-full">Continue</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}