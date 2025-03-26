"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  ArrowUp,
  Lightbulb,
  CheckCheck,
  BookOpen,
  CalendarDays,
  Clock,
  BarChart2,
  BookOpenCheck,
  LineChart as LineChartIcon
} from "lucide-react";
// import { PerformanceChart } from "./performance-chart";
// import { TopicHeatmap } from "./topic-heatmap";
// import { KnowledgeGraph } from "./knowledge-graph";

export function DashboardDemo() {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("month");
  
  // Sample data for visualization purposes
  const courseProgress = {
    "Machine Learning": 78,
    "Statistical Methods": 65,
    "Database Systems": 92,
    "Big Data": 43,
    "Data Visualization": 81
  };
  
  const recentActivity = [
    { 
      type: "quiz", 
      title: "Machine Learning Fundamentals", 
      date: "Today", 
      result: "85%",
      improvement: "+12%"
    },
    { 
      type: "topic", 
      title: "Neural Networks", 
      date: "Yesterday", 
      result: "Weak Area",
      improvement: ""
    },
    { 
      type: "diagnostic", 
      title: "Statistical Methods", 
      date: "3 days ago", 
      result: "70%",
      improvement: "+5%"
    }
  ];
  
  const knowledgeGaps = [
    {
      topic: "Regularization Techniques",
      course: "Machine Learning",
      proficiency: 35,
      priority: "High"
    },
    {
      topic: "Hypothesis Testing",
      course: "Statistical Methods",
      proficiency: 42,
      priority: "High"
    },
    {
      topic: "NoSQL Database Concepts",
      course: "Database Systems",
      proficiency: 48,
      priority: "Medium"
    }
  ];
  
  const recommendations = [
    {
      type: "resource",
      title: "Understanding Regularization in Deep Learning",
      description: "Article with examples and visualizations"
    },
    {
      type: "practice",
      title: "Hypothesis Testing Question Set",
      description: "10 practice questions with detailed explanations"
    },
    {
      type: "video",
      title: "Statistical Significance Explained",
      description: "15-minute video from Statistical Methods lecture"
    }
  ];
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">Track your progress and identify knowledge gaps</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="ml">Machine Learning</SelectItem>
              <SelectItem value="stats">Statistical Methods</SelectItem>
              <SelectItem value="db">Database Systems</SelectItem>
              <SelectItem value="bigdata">Big Data</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Last Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <Progress value={72} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-green-500 font-medium flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Knowledge Gaps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 Critical</div>
              <Progress value={35} className="h-2 mt-2 bg-amber-100" />
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-amber-500 font-medium flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requires immediate attention
                </span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Study Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 Days</div>
              <div className="flex space-x-1 mt-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-full ${i < 5 ? 'bg-green-500' : 'bg-muted'}`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-green-500 font-medium flex items-center">
                  <CheckCheck className="h-3 w-3 mr-1" />
                  5 days this week
                </span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="col-span-1 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Performance Trends</CardTitle>
                <Select defaultValue="month">
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Your performance across all courses over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {/* Performance chart placeholder */}
              <div className="h-full w-full bg-muted/40 rounded-lg flex items-center justify-center">
                <LineChartIcon className="h-16 w-16 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>
                Completion status by course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(courseProgress).map(([course, progress]) => (
                  <div key={course} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{course}</p>
                      <p className="text-sm text-muted-foreground">{progress}%</p>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Knowledge Gaps</CardTitle>
              <CardDescription>
                Topics that need your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledgeGaps.map((gap, index) => (
                  <div key={index} className="flex items-center p-2 rounded-lg border">
                    <div className="mr-4">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="4"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            fill="none"
                            stroke={gap.priority === "High" ? "#ef4444" : "#f59e0b"}
                            strokeWidth="4"
                            strokeDasharray={126}
                            strokeDashoffset={126 - (126 * gap.proficiency) / 100}
                          />
                        </svg>
                        <span className="absolute text-xs font-medium">{gap.proficiency}%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{gap.topic}</h4>
                      <p className="text-xs text-muted-foreground">{gap.course}</p>
                    </div>
                    <div className={`
                      text-xs font-medium px-2 py-1 rounded-full
                      ${gap.priority === "High" 
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"}
                    `}>
                      {gap.priority} Priority
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Knowledge Gaps
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                Based on your knowledge gaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start p-3 rounded-lg border">
                    <div className="mr-3 mt-0.5">
                      {recommendation.type === "resource" && (
                        <BookOpen className="h-5 w-5 text-blue-500" />
                      )}
                      {recommendation.type === "practice" && (
                        <BookOpenCheck className="h-5 w-5 text-green-500" />
                      )}
                      {recommendation.type === "video" && (
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{recommendation.title}</h4>
                      <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                Get More Recommendations
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest learning interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center">
                    <div className="mr-4 p-2 rounded-lg bg-muted">
                      {activity.type === "quiz" && (
                        <BookOpenCheck className="h-5 w-5 text-purple-500" />
                      )}
                      {activity.type === "topic" && (
                        <BarChart2 className="h-5 w-5 text-blue-500" />
                      )}
                      {activity.type === "diagnostic" && (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        <span>{activity.date}</span>
                        <Clock className="h-3 w-3 mx-1 ml-2" />
                        <span>Result: {activity.result}</span>
                      </div>
                    </div>
                  </div>
                  {activity.improvement && (
                    <span className="text-xs text-green-500 font-medium">
                      {activity.improvement}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Activity History
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
