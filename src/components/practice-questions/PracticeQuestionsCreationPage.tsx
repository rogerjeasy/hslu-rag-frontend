"use client";

import React, { useState, useEffect } from 'react';
import { PracticeQuestionsCreation } from "./PracticeQuestionsCreation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, ChevronRight, BookOpen, Bookmark, Clock, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PracticeQuestionsCreationPage() {
  // State for page loading
  const [isLoading, setIsLoading] = useState(true);

  console.log("isLoading", isLoading);

  // Mock course data
  const mockCourses = [
    {
      id: "course-1",
      name: "Introduction to Computer Science",
      color: "#4f46e5", // indigo-600
    },
    {
      id: "course-2",
      name: "Data Structures and Algorithms",
      color: "#0891b2", // cyan-600
    },
    {
      id: "course-3",
      name: "Web Development Fundamentals",
      color: "#16a34a", // green-600
    },
    {
      id: "course-4",
      name: "Database Systems",
      color: "#ca8a04", // yellow-600
    },
    {
      id: "course-5",
      name: "Machine Learning Basics",
      color: "#9333ea", // purple-600
    },
    {
      id: "course-6",
      name: "Software Engineering Principles",
      color: "#dc2626", // red-600
    },
  ];

  // Mock recent question sets
  const recentQuestionSets = [
    {
      id: "set-1",
      title: "Database Normalization",
      courseId: "course-4",
      questionCount: 10,
      createdAt: "2025-03-20T14:30:00Z",
    },
    {
      id: "set-2",
      title: "Machine Learning Algorithms",
      courseId: "course-5",
      questionCount: 15,
      createdAt: "2025-03-18T09:15:00Z",
    },
    {
      id: "set-3",
      title: "React Hooks",
      courseId: "course-3",
      questionCount: 8,
      createdAt: "2025-03-15T16:45:00Z",
    },
  ];

  // Suggested topics for quick start
  const suggestedTopics = [
    {
      title: "Data Structures",
      courseId: "course-2",
      description: "Binary trees, hash tables, and more",
    },
    {
      title: "SQL Fundamentals",
      courseId: "course-4",
      description: "Queries, joins, and database design",
    },
    {
      title: "Neural Networks",
      courseId: "course-5",
      description: "Architecture and training techniques",
    },
  ];
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to get course name by ID
  const getCourseNameById = (courseId: string) => {
    const course = mockCourses.find(course => course.id === courseId);
    return course ? course.name : "Unknown Course";
  };

  // Function to get course color by ID
  const getCourseColorById = (courseId: string) => {
    const course = mockCourses.find(course => course.id === courseId);
    return course ? course.color : "#6b7280"; // gray-500 default
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-10 max-w-7xl mx-auto">
        {/* Breadcrumb navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                <span>Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/practice-questions" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>Practice Questions</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Centered page header with title and description */}
        <div className="flex flex-col items-center justify-center text-center mb-8 w-full">
          <h1 className="text-3xl font-bold tracking-tight">Create Practice Questions</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Generate custom practice questions based on your course materials to test your knowledge 
            and prepare for exams. Select a topic, choose question types, and get personalized practice questions in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mx-auto">
          {/* Main content area */}
          <div className="lg:col-span-8 mx-auto lg:mx-0 w-full max-w-4xl">
            <Card className="border-2 border-primary/10">
              <CardContent className="p-0">
                <PracticeQuestionsCreation courses={mockCourses} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with quick access and recent sets */}
          <div className="lg:col-span-4 space-y-6 mx-auto lg:mx-0 w-full max-w-md">
            {/* Quick start section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bookmark className="h-5 w-5 mr-2 text-primary" />
                  Quick Start
                </CardTitle>
                <CardDescription>
                  Select a suggested topic to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedTopics.map((topic, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-3 px-4"
                      onClick={() => {
                        // You would implement logic to pre-fill the form here
                        console.log(`Quick start with: ${topic.title}`);
                      }}
                    >
                      <div className="flex items-start">
                        <div 
                          className="w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0" 
                          style={{ backgroundColor: getCourseColorById(topic.courseId) }}
                        />
                        <div>
                          <div className="font-medium">{topic.title}</div>
                          <div className="text-xs text-muted-foreground">{topic.description}</div>
                          <div className="text-xs text-primary mt-1">{getCourseNameById(topic.courseId)}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent question sets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-primary" />
                  Recent Question Sets
                </CardTitle>
                <CardDescription>
                  Your recently created question sets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuestionSets.map((set) => (
                    <div
                      key={set.id}
                      className="flex items-start border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div 
                        className="w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0" 
                        style={{ backgroundColor: getCourseColorById(set.courseId) }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{set.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(set.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <span>{set.questionCount} questions</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => {
                          console.log(`View question set: ${set.id}`);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help section */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about creating practice materials? Check out these resources:
                </p>
                <div className="space-y-2 text-sm">
                  <a href="#" className="text-primary hover:underline block">How to create effective practice questions</a>
                  <a href="#" className="text-primary hover:underline block">Using AI-generated questions effectively</a>
                  <a href="#" className="text-primary hover:underline block">Contact academic support</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}