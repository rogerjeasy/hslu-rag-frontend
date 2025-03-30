// /components/study-guides/guides/GuideListItem.tsx
'use client';

import { 
  FileText, 
  Brain, 
  ListChecks, 
  CreditCard,
  BookOpen,
  Clock, 
  Calendar,
  Star,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StudyGuide, GuideType } from '@/types/study-guide.types';
import { Course } from '@/types/course.types';
import { getGuideBorderColor, getGuideTypeLabel } from '@/utils/guide-utils';

interface GuideListItemProps {
  guide: StudyGuide;
  course: Course;
  onSelect: () => void;
  isRecommended?: boolean;
}

export const GuideListItem = ({
  guide,
  course,
  onSelect,
  isRecommended = false
}: GuideListItemProps) => {
  // Get the appropriate icon for the guide type
  const getGuideIcon = () => {
    switch (guide.type) {
      case 'summary':
        return <FileText className="h-4 w-4 mr-1 text-blue-500 shrink-0" />;
      case 'concept':
        return <Brain className="h-4 w-4 mr-1 text-purple-500 shrink-0" />;
      case 'practice':
        return <ListChecks className="h-4 w-4 mr-1 text-green-500 shrink-0" />;
      case 'flashcard':
        return <CreditCard className="h-4 w-4 mr-1 text-orange-500 shrink-0" />;
      default:
        return <BookOpen className="h-4 w-4 mr-1 text-blue-500 shrink-0" />;
    }
  };
  
  return (
    <Card className={`transition-all hover:shadow-md border-l-4 ${getGuideBorderColor(guide.type as GuideType)} hover:translate-x-1 duration-200 w-full overflow-hidden`}>
      <div className="flex flex-col md:flex-row items-stretch w-full">
        <div className="flex-grow p-4 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-2 md:flex-nowrap">
            <div className="min-w-0 max-w-full">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <div className="flex items-center shrink-0">
                  {getGuideIcon()}
                  <span className="text-sm font-medium whitespace-nowrap">{getGuideTypeLabel(guide.type as GuideType)}</span>
                </div>
                {isRecommended && (
                  <Badge className="bg-green-500 text-xs shrink-0">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Recommended
                  </Badge>
                )}
              </div>
              
              <h3 className="font-medium text-gray-800 truncate">{guide.title}</h3>
              <p className="text-sm text-gray-500 mt-1 truncate">{course.name} ({course.code})</p>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1 whitespace-nowrap">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{guide.estimatedTime} min</span>
              </div>
              
              {guide.lastStudied && (
                <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{guide.lastStudied}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{guide.progress}%</span>
            </div>
            <Progress value={guide.progress} className="h-1.5" />
          </div>
        </div>
        
        <div className="border-t md:border-t-0 md:border-l border-gray-100 p-4 flex items-center shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            className="text-primary hover:bg-primary/5 whitespace-nowrap"
            onClick={onSelect}
          >
            Continue
            <ArrowRight className="ml-1 h-3.5 w-3.5 shrink-0" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GuideListItem;