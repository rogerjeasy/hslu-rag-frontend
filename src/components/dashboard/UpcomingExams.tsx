// src/components/dashboard/UpcomingExams.tsx
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function UpcomingExams() {
  const exams = [
    {
      id: 1,
      title: "Machine Learning Final",
      date: "March 25, 2025",
      time: "10:00 AM",
      location: "Room H3.B12",
      readiness: 85,
      status: "ready",
      daysLeft: 8
    },
    {
      id: 2,
      title: "Data Science Mid-term",
      date: "March 21, 2025",
      time: "2:00 PM",
      location: "Room H2.A05",
      readiness: 92,
      status: "ready",
      daysLeft: 4
    },
    {
      id: 3,
      title: "Statistics Project Presentation",
      date: "April 2, 2025",
      time: "11:30 AM",
      location: "Room H1.C22",
      readiness: 65,
      status: "warning",
      daysLeft: 16
    }
  ];

  const getStatusColor = (status: string, readiness: number) => {
    if (status === 'ready' || readiness >= 80) return 'text-green-600';
    if (status === 'warning' || (readiness >= 60 && readiness < 80)) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string, readiness: number) => {
    if (status === 'ready' || readiness >= 80) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (status === 'warning' || (readiness >= 60 && readiness < 80)) return <AlertCircle className="h-5 w-5 text-amber-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription>Scheduled exams and your preparation status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {exams.map((exam) => (
              <div key={exam.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{exam.title}</h3>
                      {getStatusIcon(exam.status, exam.readiness)}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{exam.date} at {exam.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{exam.location}</p>
                  </div>
                  
                  <div className="w-full sm:w-48">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Readiness</span>
                      <span className={getStatusColor(exam.status, exam.readiness)}>
                        {exam.readiness}%
                      </span>
                    </div>
                    <Progress value={exam.readiness} className="h-2" />
                    <p className="text-xs mt-2 text-center">
                      {exam.daysLeft} days left
                    </p>
                  </div>
                  
                  <Button variant="outline">Prepare</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Need help with exam preparation?</h3>
              <p className="text-muted-foreground">Generate personalized study guides and practice questions</p>
            </div>
            <Button>Study Guide Generator</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}