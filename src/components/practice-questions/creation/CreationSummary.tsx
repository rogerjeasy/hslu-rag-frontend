import React from 'react';
import { DifficultyLevel, QuestionType } from '@/types/practice-questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

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
  selectedTypes: QuestionType[];
}

// Map question types to human-readable labels
const questionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QuestionType.SHORT_ANSWER]: 'Short Answer',
  [QuestionType.TRUE_FALSE]: 'True/False',
  [QuestionType.FILL_IN_BLANK]: 'Fill in the Blank',
  [QuestionType.MATCHING]: 'Matching',
};

// Map difficulty levels to badges
const difficultyBadges: Record<DifficultyLevel, { color: string, label: string }> = {
  [DifficultyLevel.BASIC]: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    label: 'Basic'
  },
  [DifficultyLevel.MEDIUM]: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    label: 'Medium'
  },
  [DifficultyLevel.ADVANCED]: {
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    label: 'Advanced'
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
  
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Summary</span>
          {hasBasicInfo && (
            <Badge variant="outline" className="font-normal">
              Ready to Create
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasBasicInfo ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Topic</h4>
              <p className="font-medium">{topic}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Course</h4>
                <div className="flex items-center gap-2">
                  {selectedCourse && (
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: selectedCourse.color }}
                    />
                  )}
                  <span>{selectedCourse?.name || 'None selected'}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Difficulty</h4>
                <Badge variant="secondary" className={difficultyBadges[difficulty].color}>
                  {difficultyBadges[difficulty].label}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Questions</h4>
                <p>{questionCount} questions</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Question Types</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTypes.map(type => (
                  <Badge key={type} variant="secondary">
                    <Check className="mr-1 h-3 w-3" />
                    {questionTypeLabels[type]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>Please provide a topic and select a course to see a summary of your practice questions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreationSummary;