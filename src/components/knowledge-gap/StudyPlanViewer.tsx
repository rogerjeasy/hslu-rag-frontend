// src/components/knowledge-gap/StudyPlanViewer.tsx
"use client";

import { useState } from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BrainCog, Calendar, Clock, Printer, Download, Share, BookOpen, CheckSquare } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import { Progress } from '@/components/ui/progress';
import { useMarkdown } from '@/hooks/use-markdown';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StudyPlanViewerProps {
  studyPlan: string;
}

export function StudyPlanViewer({ studyPlan }: StudyPlanViewerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('plan');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  // Convert markdown to HTML for rendering
  const { markdown: renderedStudyPlan } = useMarkdown(studyPlan);

  // Extract weeks or sections from the study plan
  const extractWeeks = () => {
    const weekPattern = /(week|day|session)\s*\d+/gi;
    const matchResult = studyPlan.match(weekPattern);
    
    // If no matches, return empty array
    if (!matchResult) {
      return [];
    }
    
    // Convert to Set and back to array to remove duplicates
    const uniqueWeeks = [...new Set(matchResult)];
    
    return uniqueWeeks.map(week => ({
      title: week.charAt(0).toUpperCase() + week.slice(1),
      id: week.toLowerCase().replace(/\s+/g, '-')
    }));
  };

  const weeks = extractWeeks();

  // Extract potential tasks from the study plan
  const extractTasks = () => {
    const lines = studyPlan.split('\n');
    const taskLines = lines.filter(line => {
      const trimmedLine = line.trim();
      return trimmedLine.startsWith('- [ ]') || 
             trimmedLine.startsWith('* ') || 
             trimmedLine.startsWith('- ') ||
             (trimmedLine.match(/^\d+\.\s/) && trimmedLine.length > 5);
    });
    
    return taskLines.map((task, index) => ({
      id: `task-${index}`,
      text: task.replace(/^[-*\d]+\.\s*\[[ x]\]\s*/, '').trim(),
      originalText: task.trim()
    }));
  };

  const tasks = extractTasks();

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const completionPercentage = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const downloadPdf = () => {
    toast({
      title: "Preparing PDF download",
      description: "Your study plan PDF is being generated..."
    });
    
    // Simulate PDF generation/download (would be implemented with a PDF library)
    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: "Your study plan has been downloaded"
      });
    }, 1500);
  };

  const printStudyPlan = () => {
    window.print();
  };

  const shareStudyPlan = () => {
    // Check if navigator.share is available (mostly on mobile devices)
    if (navigator.share) {
      navigator.share({
        title: 'My Personalized Study Plan',
        text: studyPlan,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(studyPlan).then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Your study plan has been copied to your clipboard"
        });
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <BrainCog className="h-5 w-5 mr-2" />
              Personalized Study Plan
            </CardTitle>
            <CardDescription>
              Follow this plan to address your identified knowledge gaps
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={printStudyPlan}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print study plan</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={downloadPdf}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download as PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={shareStudyPlan}>
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share study plan</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex gap-1 items-center">
              <Calendar className="h-3 w-3" />
              {weeks.length > 0 ? `${weeks.length} sections` : 'Custom plan'}
            </Badge>
            
            <Badge variant="outline" className="flex gap-1 items-center">
              <CheckSquare className="h-3 w-3" />
              {tasks.length} tasks
            </Badge>
          </div>
          
          <div className="w-full sm:w-44">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="plan" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Full Plan
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center">
              <CheckSquare className="h-4 w-4 mr-2" />
              Task List
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="plan" className="px-6">
          <ScrollArea className="h-[500px] pr-4">
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: renderedStudyPlan }} />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="tasks" className="px-6">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`p-4 border rounded-md flex items-start gap-3 transition-colors ${
                        completedTasks.includes(task.id) 
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                          : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-5 w-5 rounded ${
                          completedTasks.includes(task.id) 
                            ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:text-white' 
                            : ''
                        }`}
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        {completedTasks.includes(task.id) && (
                          <CheckSquare className="h-3 w-3" />
                        )}
                      </Button>
                      <div 
                        className={`text-sm ${
                          completedTasks.includes(task.id) 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : ''
                        }`}
                      >
                        {task.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No specific tasks were identified in this study plan
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Add to Calendar
        </Button>
        
        <Button>
          <Clock className="h-4 w-4 mr-2" />
          Start Study Session
        </Button>
      </CardFooter>
    </Card>
  );
}