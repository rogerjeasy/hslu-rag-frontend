import React from 'react';
import { DifficultyLevel, QuestionTypeEnum } from '@/types/practice-questions.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, BookOpen, BarChart3, ListChecks, User, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreationSummaryProps {
  topic: string;
  courseId: string;
  courses: {
    id: string;
    name: string;
    color: string;
  }[];
  questionCount: number;
  difficulty: DifficultyLevel;
  selectedTypes: QuestionTypeEnum[];
}

// Map question types to human-readable labels and icons
const questionTypeInfo: Record<QuestionTypeEnum, { label: string, icon: React.ReactNode }> = {
  [QuestionTypeEnum.MULTIPLE_CHOICE]: {
    label: 'Multiple Choice',
    icon: <ListChecks className="h-3 w-3" />
  },
  [QuestionTypeEnum.SHORT_ANSWER]: {
    label: 'Short Answer',
    icon: <User className="h-3 w-3" />
  },
  [QuestionTypeEnum.TRUE_FALSE]: {
    label: 'True/False',
    icon: <Check className="h-3 w-3" />
  },
  [QuestionTypeEnum.FILL_IN_BLANK]: {
    label: 'Fill in the Blank',
    icon: <User className="h-3 w-3" />
  },
  [QuestionTypeEnum.MATCHING]: {
    label: 'Matching',
    icon: <ListChecks className="h-3 w-3" />
  },
};

// Map difficulty levels to styling and content
const difficultyInfo: Record<DifficultyLevel, { 
  color: string, 
  bgColor: string,
  borderColor: string,
  icon: React.ReactNode,
  label: string,
  description: string
}> = {
  [DifficultyLevel.BASIC]: {
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-900',
    icon: <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" />,
    label: 'Basic',
    description: 'Fundamental concepts and simple recall questions'
  },
  [DifficultyLevel.MEDIUM]: {
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900',
    icon: <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
    label: 'Medium',
    description: 'Application of concepts and moderate complexity'
  },
  [DifficultyLevel.ADVANCED]: {
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-900',
    icon: <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
    label: 'Advanced',
    description: 'Complex problem-solving and deeper understanding'
  }
};

const CreationSummary: React.FC<CreationSummaryProps> = ({
  topic,
  courseId,
  courses,
  questionCount,
  difficulty,
  selectedTypes,
}) => {
  // Find the selected course
  const selectedCourse = courses.find(course => course.id === courseId);
  
  // Check if we have enough info to show a meaningful summary
  const hasBasicInfo = !!topic && !!courseId;
  
  // Get difficulty info
  const difficultyData = difficultyInfo[difficulty];

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="p-6 sm:w-1/3 bg-muted/20">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              Practice Session
            </h3>
            
            {hasBasicInfo ? (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Topic</h4>
                  <p className="text-xl font-medium truncate" title={topic}>{topic}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Course</h4>
                  <div className="flex items-center gap-2">
                    {selectedCourse && (
                      <div
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: selectedCourse.color }}
                      />
                    )}
                    <p className="font-medium truncate" title={selectedCourse?.name}>
                      {selectedCourse?.name || 'None selected'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-muted-foreground">
                <p>Please provide a topic and select a course to see a summary.</p>
              </div>
            )}
          </div>
          
          {hasBasicInfo && (
            <div className="p-6 sm:w-2/3 border-t sm:border-t-0 sm:border-l">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Configuration
                </h3>
                <Badge variant="outline" className="font-normal">
                  Ready to Create
                </Badge>
              </div>
              
              <div className="space-y-6">
                {/* Difficulty card */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  difficultyData.borderColor,
                  difficultyData.bgColor
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {difficultyData.icon}
                      <h4 className={cn("font-medium", difficultyData.color)}>
                        {difficultyData.label} Difficulty
                      </h4>
                    </div>
                    <Badge variant="outline" className={cn(
                      "font-medium", 
                      difficultyData.color,
                      difficultyData.borderColor
                    )}>
                      {questionCount} Questions
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {difficultyData.description}
                  </p>
                </div>
                
                {/* Question types */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Question Types ({selectedTypes.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTypes.map(type => (
                      <Badge 
                        key={type} 
                        variant="secondary"
                        className="flex items-center px-3 py-1.5 text-xs font-medium"
                      >
                        {questionTypeInfo[type].icon}
                        <span className="ml-1.5">{questionTypeInfo[type].label}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {hasBasicInfo && (
        <div className="bg-muted/20 rounded-lg p-4 border border-dashed flex flex-col sm:flex-row items-center justify-between text-sm">
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            <div className="bg-primary/10 text-primary p-1.5 rounded-full">
              <Check className="h-4 w-4" />
            </div>
            <span>Your practice questions are tailored to your selected course materials</span>
          </div>
          <Badge variant="secondary" className="whitespace-nowrap">
            {selectedTypes.length} types &middot; {questionCount} questions
          </Badge>
        </div>
      )}
    </div>
  );
};

export default CreationSummary;