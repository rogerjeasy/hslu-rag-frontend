// /components/study-guides/guides/GuideCard.tsx
'use client';

import { 
  FileText, 
  Brain, 
  ListChecks, 
  CreditCard,
  BookOpen,
  Clock, 
  Calendar,
  Star
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StudyGuide, GuideType } from '@/types/study-guide';
import { Course } from '@/types/course.types';
import { formatDate, getGuideBorderColor, getGuideTypeLabel } from '@/utils/guide-utils';

interface GuideCardProps {
  guide: StudyGuide;
  course: Course;
  onSelect: () => void;
  isRecommended?: boolean;
}

export const GuideCard = ({
  guide,
  course,
  onSelect,
  isRecommended = false
}: GuideCardProps) => {
  // Get the appropriate icon for the guide type
  const getGuideIcon = () => {
    switch (guide.type) {
      case 'summary':
        return <FileText className="h-4 w-4 mr-1 text-blue-500" />;
      case 'concept':
        return <Brain className="h-4 w-4 mr-1 text-purple-500" />;
      case 'practice':
        return <ListChecks className="h-4 w-4 mr-1 text-green-500" />;
      case 'flashcard':
        return <CreditCard className="h-4 w-4 mr-1 text-orange-500" />;
      default:
        return <BookOpen className="h-4 w-4 mr-1 text-blue-500" />;
    }
  };
  
  return (
    <Card className={`h-full transition-all hover:shadow-md border-l-4 ${getGuideBorderColor(guide.type as GuideType)} hover:-translate-y-1 duration-200 w-full overflow-hidden`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <Badge variant="outline" className="text-xs mb-2 shrink-0">
            {getGuideIcon()}
            {getGuideTypeLabel(guide.type as GuideType)}
          </Badge>
          
          {isRecommended && (
            <Badge className="bg-green-500 shrink-0">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Recommended
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg truncate">{guide.title}</CardTitle>
        <CardDescription className="text-sm text-gray-500 truncate">{course.name} ({course.code})</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{guide.progress}%</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress value={guide.progress} className="h-2" />
                </TooltipTrigger>
                <TooltipContent>
                  {guide.progress}% completed
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 shrink-0" />
              <span>{guide.estimatedTime} min</span>
            </div>
            
            {guide.lastStudied && (
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1 shrink-0" />
                <span>Last studied {formatDate(guide.lastStudied)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full hover:bg-primary/5 transition-colors"
          onClick={onSelect}
        >
          Continue Studying
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuideCard;