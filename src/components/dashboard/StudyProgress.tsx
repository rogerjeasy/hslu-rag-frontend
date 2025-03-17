// src/components/dashboard/StudyProgress.tsx
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

export default function StudyProgress() {
  // Mock data for charts
  const weeklyData = [
    { name: 'Mon', hours: 1.5, questions: 15 },
    { name: 'Tue', hours: 2.2, questions: 22 },
    { name: 'Wed', hours: 1.8, questions: 18 },
    { name: 'Thu', hours: 2.5, questions: 25 },
    { name: 'Fri', hours: 3.0, questions: 30 },
    { name: 'Sat', hours: 1.0, questions: 10 },
    { name: 'Sun', hours: 0.5, questions: 5 },
  ];

  const monthlyData = [
    { name: 'Week 1', hours: 8.5, questions: 85 },
    { name: 'Week 2', hours: 10.2, questions: 102 },
    { name: 'Week 3', hours: 12.5, questions: 125 },
    { name: 'Week 4', hours: 9.8, questions: 98 },
  ];

  const subjectData = [
    { name: 'ML', hours: 8.5, progress: 75 },
    { name: 'DS', hours: 10.2, progress: 90 },
    { name: 'BD', hours: 6.5, progress: 45 },
    { name: 'Stats', hours: 7.8, progress: 60 },
    { name: 'DB', hours: 5.2, progress: 40 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Study Progress</CardTitle>
          <CardDescription>Track your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="time">
            <TabsList className="mb-4">
              <TabsTrigger value="time">Study Time</TabsTrigger>
              <TabsTrigger value="questions">Practice Questions</TabsTrigger>
              <TabsTrigger value="subjects">By Subject</TabsTrigger>
            </TabsList>
            
            <TabsContent value="time">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis unit="h" />
                    <RechartsTooltip 
                      formatter={(value) => [`${value}h`, 'Study Time']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="questions">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value) => [value, 'Questions Answered']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar 
                      dataKey="questions" 
                      fill="#82ca9d" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="subjects">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={subjectData} 
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={50} />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'hours' ? `${value}h` : `${value}%`, 
                        name === 'hours' ? 'Study Time' : 'Completion'
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Bar dataKey="hours" name="Study Time (h)" fill="#8884d8" />
                    <Bar dataKey="progress" name="Completion (%)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}