// /components/study-guides/course/CourseCard.tsx
'use client';

import { 
  BookOpen, 
  Calendar,
  Users,
  ArrowRight
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
import { ViewMode } from '@/types/study-guide';
import { Course } from '@/types/course.types';

interface CourseCardProps {
  course: Course;
  onSelect: () => void;
  guideCount: number;
  viewMode: ViewMode;
}

export const CourseCard = ({ 
  course, 
  onSelect, 
  guideCount, 
  viewMode 
}: CourseCardProps) => {
  // If in list mode, render a more compact layout
  if (viewMode === 'list') {
    return (
      <Card className="transition-all hover:shadow-md border-l-4 border-l-indigo-500 hover:translate-x-1 duration-200 w-full overflow-hidden">
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex-1 p-4 overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-medium text-gray-800 truncate max-w-full md:max-w-xs">{course.name}</h3>
              <Badge variant="outline" className="bg-indigo-50 shrink-0">{course.code}</Badge>
            </div>
            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{course.description}</p>
            
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
              <div className="flex items-center shrink-0">
                <BookOpen className="h-3.5 w-3.5 mr-1 text-indigo-500 shrink-0" />
                <span>{guideCount} guides</span>
              </div>
              <div className="flex items-center shrink-0">
                <Calendar className="h-3.5 w-3.5 mr-1 text-indigo-500 shrink-0" />
                <span className="truncate">{course.semester}</span>
              </div>
              <div className="flex items-center shrink-0">
                <Users className="h-3.5 w-3.5 mr-1 text-indigo-500 shrink-0" />
                <span className="truncate">{course.instructor}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t md:border-t-0 md:border-l border-gray-100 p-4 flex items-center shrink-0">
            <Button 
              onClick={onSelect} 
              className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 whitespace-nowrap"
            >
              <span>View Guides</span>
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default grid view
  return (
    <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-indigo-500 hover:-translate-y-1 duration-200 w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start flex-wrap gap-2">
          <span className="text-lg font-semibold text-gray-800 truncate max-w-[calc(100%-80px)]">{course.name}</span>
          <Badge variant="outline" className="bg-indigo-50 shrink-0">{course.code}</Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center shrink-0">
            <BookOpen className="h-4 w-4 mr-1 text-indigo-500 shrink-0" />
            <span>{guideCount} guides</span>
          </div>
          <div className="flex items-center shrink-0">
            <Calendar className="h-4 w-4 mr-1 text-indigo-500 shrink-0" />
            <span className="truncate">{course.semester}</span>
          </div>
          <div className="flex items-center shrink-0">
            <Users className="h-4 w-4 mr-1 text-indigo-500 shrink-0" />
            <span className="truncate">{course.instructor}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          onClick={onSelect} 
          className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
        >
          <span>View Course Details</span>
          <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </CardFooter>
    </Card>
  );
}