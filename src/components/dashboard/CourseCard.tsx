"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Animation variant for individual course card
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Define badge variant type to match the Badge component's expected types
type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | null | undefined;

// Define a more comprehensive interface for courses from the API
interface CourseFromAPI {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  status?: string;
  difficulty?: string;
  progress?: number;
  completion?: number;
  timeSpent?: string;
  lastStudied?: string;
  lastAccessed?: string;
  // Add any other potential properties from the API
//   [key: string]: any; // Allow for additional properties
}

// Map course status to badge variant
const getBadgeVariant = (status: string | undefined): BadgeVariant => {
  if (!status) return 'outline';
  
  switch (status.toLowerCase()) {
    case 'active':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'archived':
      return 'outline';
    case 'new':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Determine badge text based on course properties
const getBadgeText = (course: CourseFromAPI): string => {
  if (course.status) return course.status;
  if (course.difficulty) return course.difficulty;
  return 'Active';
};

interface CourseCardProps {
  course: CourseFromAPI;
  onContinue: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onContinue }) => {
  // Calculate progress if not provided
  const progress = course.progress || course.completion || 0;
 
  // Format for last studied date
  const formatLastStudied = (lastStudiedDate: string | undefined): string => {
    if (!lastStudiedDate) return 'Not started';
   
    try {
      const date = new Date(lastStudiedDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
     
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
     
      return date.toLocaleDateString();
    } catch (e) {
        console.error('Error parsing date:', e);
      return lastStudiedDate; 
    }
  };
 
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{course.title || course.name || 'Untitled Course'}</CardTitle>
            <Badge variant={getBadgeVariant(course.status)}>
              {getBadgeText(course)}
            </Badge>
          </div>
          <CardDescription>{course.description || 'No description available'}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {course.timeSpent && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.timeSpent}</span>
                </div>
              )}
              <span>Last studied: {formatLastStudied(course.lastStudied || course.lastAccessed)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="default"
            className="w-full"
            onClick={() => onContinue(course.id)}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseCard;