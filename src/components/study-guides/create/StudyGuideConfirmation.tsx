'use client';

import { DetailLevel, StudyGuideFormat } from '@/types/study-guide';
import { Course } from '@/types/course.types';
import { cn } from '@/lib/utils';

// Define the module interface that's missing from Course
interface Module {
  id: string;
  name: string;
  description?: string;
}
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  FileText, 
  ListTree, 
  Grid3X3, 
  AlignJustify, 
  Layers,
  Info,
  Check,
  HelpCircle,
  Clock,
  Book,
  Sparkles
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface StudyGuideConfirmationProps {
  formData: {
    topic: string;
    courseId: string;
    moduleId?: string;
    detailLevel: DetailLevel;
    format: StudyGuideFormat;
    includePracticeQuestions: boolean;
  };
  courses: (Course & { 
    modules?: Module[] 
  })[];
}

export function StudyGuideConfirmation({ 
  formData, 
  courses 
}: StudyGuideConfirmationProps) {
  // Find the selected course and module
  const selectedCourse = courses.find(c => c.id === formData.courseId);
  const selectedModule = selectedCourse?.modules?.find((m: Module) => m.id === formData.moduleId);
  
  // Format names for display
  const getDetailLevelName = (level: DetailLevel): string => {
    const names: Record<DetailLevel, string> = {
      [DetailLevel.BASIC]: 'Basic',
      [DetailLevel.MEDIUM]: 'Medium',
      [DetailLevel.COMPREHENSIVE]: 'Comprehensive'
    };
    return names[level] || 'Medium';
  };
  
  const getFormatName = (format: StudyGuideFormat): string => {
    const names: Record<StudyGuideFormat, string> = {
      [StudyGuideFormat.OUTLINE]: 'Outline',
      [StudyGuideFormat.NOTES]: 'Notes',
      [StudyGuideFormat.FLASHCARDS]: 'Flashcards',
      [StudyGuideFormat.MIND_MAP]: 'Mind Map',
      [StudyGuideFormat.SUMMARY]: 'Summary'
    };
    return names[format] || 'Outline';
  };
  
  const getFormatIcon = (format: StudyGuideFormat) => {
    const icons: Record<StudyGuideFormat, React.ReactNode> = {
      [StudyGuideFormat.OUTLINE]: <ListTree className="h-5 w-5 text-blue-600" />,
      [StudyGuideFormat.NOTES]: <AlignJustify className="h-5 w-5 text-purple-600" />,
      [StudyGuideFormat.FLASHCARDS]: <Layers className="h-5 w-5 text-amber-600" />,
      [StudyGuideFormat.MIND_MAP]: <Grid3X3 className="h-5 w-5 text-green-600" />,
      [StudyGuideFormat.SUMMARY]: <FileText className="h-5 w-5 text-pink-600" />
    };
    return icons[format] || <FileText className="h-5 w-5 text-slate-600" />;
  };
  
  // Estimate time to generate based on detail level and format
  const estimateTime = (): string => {
    const baseTime = 30; // Base time in seconds
    
    // Multipliers based on detail level
    const detailMultiplier = {
      [DetailLevel.BASIC]: 1,
      [DetailLevel.MEDIUM]: 1.5,
      [DetailLevel.COMPREHENSIVE]: 2.5
    }[formData.detailLevel] || 1.5;
    
    // Additional time for practice questions
    const practiceQuestionsTime = formData.includePracticeQuestions ? 15 : 0;
    
    // Format complexity factor
    const formatComplexity = {
      [StudyGuideFormat.OUTLINE]: 1,
      [StudyGuideFormat.NOTES]: 1.5,
      [StudyGuideFormat.FLASHCARDS]: 1.2,
      [StudyGuideFormat.MIND_MAP]: 1.8,
      [StudyGuideFormat.SUMMARY]: 1.3
    }[formData.format] || 1;
    
    const totalSeconds = Math.round(baseTime * detailMultiplier * formatComplexity) + practiceQuestionsTime;
    
    if (totalSeconds < 60) {
      return `${totalSeconds} seconds`;
    } else {
      const minutes = Math.ceil(totalSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  // Estimate the number of items that will be generated
  const estimateContentSize = (): string => {
    // Base size depends on format
    const baseSize = {
      [StudyGuideFormat.OUTLINE]: 'An organized hierarchical outline',
      [StudyGuideFormat.NOTES]: 'Comprehensive study notes',
      [StudyGuideFormat.FLASHCARDS]: '10-15 question-answer pairs',
      [StudyGuideFormat.MIND_MAP]: 'A visual concept map',
      [StudyGuideFormat.SUMMARY]: 'A concise topic summary',
    }[formData.format] || 'Study material';

    // Detail level affects description
    const detailDescription = {
      [DetailLevel.BASIC]: 'covering essential concepts',
      [DetailLevel.MEDIUM]: 'with balanced depth and breadth',
      [DetailLevel.COMPREHENSIVE]: 'with in-depth explanations and examples',
    }[formData.detailLevel] || '';

    // Add practice questions info if included
    const practiceInfo = formData.includePracticeQuestions
      ? ' plus practice questions with answers'
      : '';

    return `${baseSize} ${detailDescription}${practiceInfo}`;
  };
  
  // Get detailed format description
  const getFormatDescription = (format: StudyGuideFormat): string => {
    const descriptions: Record<StudyGuideFormat, string> = {
      [StudyGuideFormat.OUTLINE]: 'A structured hierarchical outline format that organizes key concepts with headings and subheadings for easy navigation.',
      [StudyGuideFormat.NOTES]: 'Comprehensive notes with detailed explanations, examples, and important information in paragraph form.',
      [StudyGuideFormat.FLASHCARDS]: 'Question and answer pairs designed for active recall and spaced repetition study techniques.',
      [StudyGuideFormat.MIND_MAP]: 'A visual diagram showing relationships between concepts, great for understanding connections and the big picture.',
      [StudyGuideFormat.SUMMARY]: 'A concise overview that covers the most important points in a condensed format.',
    };
    return descriptions[format] || 'Study material in a structured format';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Review Study Guide Details</h3>
        <p className="text-sm text-slate-500 mt-1">
          Please review your study guide settings before generating
        </p>
      </div>

      <Card className="overflow-hidden border-primary/10">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center gap-3 border-b border-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-medium text-primary text-lg">{formData.topic}</h3>
            <p className="text-sm text-slate-600">Study Guide</p>
          </div>
        </div>
        
        <CardContent className="p-5">
          <SummarySection 
            label="Course" 
            value={selectedCourse?.name || 'Not specified'} 
            icon={<Book className="h-5 w-5 text-slate-500" />}
          />
          
          {selectedModule && (
            <SummarySection 
              label="Module" 
              value={
                <span className="font-medium text-slate-700">{selectedModule.name}</span>
              } 
              icon={<Info className="h-5 w-5 text-slate-500" />}
            />
          )}
          
          <Separator className="my-3" />
          
          <SummarySection 
            label="Format" 
            value={
              <div className="flex items-center gap-2">
                <span>{getFormatName(formData.format)}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="ml-1 border-blue-200 text-blue-700 hover:bg-blue-50 cursor-help">
                        info
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{getFormatDescription(formData.format)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            } 
            icon={getFormatIcon(formData.format)}
          />
          
          <SummarySection 
            label="Detail Level" 
            value={
              <div className="flex items-center gap-2">
                <span>{getDetailLevelName(formData.detailLevel)}</span>
                <Badge variant="outline" className={cn(
                  "border-slate-200",
                  formData.detailLevel === DetailLevel.BASIC ? "text-blue-600" : 
                  formData.detailLevel === DetailLevel.MEDIUM ? "text-amber-600" : 
                  "text-purple-600"
                )}>
                  {formData.detailLevel}
                </Badge>
              </div>
            } 
            icon={<Info className="h-5 w-5 text-slate-500" />}
          />
          
          <SummarySection 
            label="Practice Questions" 
            value={
              <Badge variant={formData.includePracticeQuestions ? "default" : "secondary"}>
                {formData.includePracticeQuestions ? 'Included' : 'Not included'}
              </Badge>
            } 
            icon={formData.includePracticeQuestions ? 
              <Check className="h-5 w-5 text-green-500" /> : 
              <HelpCircle className="h-5 w-5 text-slate-400" />}
          />
          
          <SummarySection 
            label="Estimated Time" 
            value={estimateTime()} 
            icon={<Clock className="h-5 w-5 text-slate-500" />}
          />
          
          <Separator className="my-3" />
          
          <div className="pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">What You&apos;ll Get:</h4>
            <p className="text-sm text-slate-600">{estimateContentSize()}</p>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-700">
                <Info className="h-4 w-4 inline-block mr-1" />
                This content will be generated based on course materials available in our system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable section component for summary items
function SummarySection({ 
  label, 
  value, 
  icon 
}: { 
  label: string; 
  value: string | React.ReactNode; 
  icon: React.ReactNode;
}) {
  return (
    <div className="py-3 first:pt-0 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-slate-700">{label}:</span>
      </div>
      <div className="text-sm text-slate-700">
        {value}
      </div>
    </div>
  );
}

export default StudyGuideConfirmation;