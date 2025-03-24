"use client";
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Play,
  Edit,
  Trash,
  Loader2,
  FileQuestion,
  Clock
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { QuestionSetSummary } from '@/types/practice-questions';
import { DifficultyBadge } from './DifficultyBadge';
import { QuestionTypeBadge } from './QuestionTypeBadge';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';

interface QuestionSetCardProps {
  questionSet: QuestionSetSummary;
  courseInfo?: { name: string; color: string; } | null;
}

export function QuestionSetCard({ 
  questionSet, 
  courseInfo 
}: QuestionSetCardProps) {
  const {
    deleteQuestionSet,
    // isLoading
  } = usePracticeQuestionsStore();
  
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this question set? This action cannot be undone.')) {
      setIsDeleting(true);
      
      try {
        await deleteQuestionSet(questionSet.id);
        toast.success('Question set deleted successfully');
      } catch (error) {
        toast.error('Failed to delete question set');
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // Format created date as relative time
  const formattedDate = formatDistanceToNow(new Date(questionSet.createdAt), { addSuffix: true });
  
  // Get first 3 question types to display as badges
  const displayTypes = questionSet.types.slice(0, 3);
  const remainingTypes = questionSet.types.length - 3;
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            {courseInfo && (
              <Badge 
                className="mb-2"
                style={{ backgroundColor: courseInfo.color, color: '#fff' }}
              >
                {courseInfo.name}
              </Badge>
            )}
            <CardTitle className="text-xl group">
              <Link 
                href={`/practice-questions/${questionSet.id}`} 
                className="hover:text-primary transition-colors"
              >
                {questionSet.title}
              </Link>
            </CardTitle>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/practice-questions/${questionSet.id}`} prefetch={false}>
                <DropdownMenuItem>
                  <Play className="h-4 w-4 mr-2" />
                  Start Practice
                </DropdownMenuItem>
              </Link>
              <Link href={`/practice-questions/${questionSet.id}/edit`} prefetch={false}>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4 mr-2" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          {questionSet.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <DifficultyBadge difficulty={questionSet.difficulty} />
          <div className="flex items-center gap-1 text-sm">
            <FileQuestion className="h-4 w-4" />
            <span>{questionSet.questionCount} questions</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {displayTypes.map((type) => (
            <QuestionTypeBadge 
              key={type} 
              type={type} 
              className="text-xs" 
            />
          ))}
          {remainingTypes > 0 && (
            <Badge variant="outline" className="text-xs">
              +{remainingTypes} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          asChild 
          className="w-full"
          variant="default"
        >
          <Link href={`/practice-questions/${questionSet.id}`}>
            <Play className="h-4 w-4 mr-2" />
            Start Practice
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}