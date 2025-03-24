// src/components/knowledge-gap/StudyPlanGenerator.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudyPlanOptions } from '@/types/knowledge-gap';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Brain, Clock, Calendar, BookOpen, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from '@/components/ui/slider';

interface StudyPlanGeneratorProps {
  onGenerate: (options: StudyPlanOptions) => void;
  isGenerating: boolean;
  gapCount: number;
}

export function StudyPlanGenerator({ onGenerate, isGenerating, gapCount }: StudyPlanGeneratorProps) {
  const [timeFrame, setTimeFrame] = useState<string>('2 weeks');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [modelId, setModelId] = useState<string>('gpt-4');

  const handleGenerate = () => {
    onGenerate({
      timeFrame,
      hoursPerWeek,
      modelId
    });
  };

  // Predefined time frames
  const timeFrameOptions = [
    '1 week',
    '2 weeks',
    '1 month', 
    '2 months',
    '3 months',
    'custom'
  ];

  // Hours per week options (for the slider)
  const minHours = 1;
  const maxHours = 30;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Generate Personalized Study Plan
        </CardTitle>
        <CardDescription>
          Create a customized study plan based on your identified knowledge gaps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {gapCount === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md p-4 text-yellow-800 dark:text-yellow-300">
            <div className="flex items-start">
              <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">No gaps identified</h4>
                <p className="text-sm mt-1">
                  No knowledge gaps were identified in your assessment. You may want to try a more specific query or a different topic to get meaningful results for your study plan.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="timeFrame" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Time Frame
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>How long you want your study plan to cover. Longer time frames will have more spaced repetition.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger id="timeFrame">
                  <SelectValue placeholder="Select a time frame" />
                </SelectTrigger>
                <SelectContent>
                  {timeFrameOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {timeFrame === 'custom' && (
                <div className="pt-2">
                  <Input 
                    placeholder="Enter custom time frame (e.g., 6 weeks)" 
                    value={timeFrame === 'custom' ? '' : timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="hoursPerWeek" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Hours Per Week: {hoursPerWeek}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>How many hours per week you can dedicate to studying. Be realistic to ensure your plan is achievable.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                id="hoursPerWeek"
                min={minHours}
                max={maxHours}
                step={1}
                value={[hoursPerWeek]}
                onValueChange={(values) => setHoursPerWeek(values[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Minimal ({minHours}h)</span>
                <span>Moderate (15h)</span>
                <span>Intensive ({maxHours}h)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="model" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Model
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI model to use for generating your study plan. More advanced models may provide more detailed plans.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (Most detailed)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-4 text-blue-800 dark:text-blue-300">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Brain className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Study Plan Information</h4>
                  <p className="text-sm mt-1">
                    Your plan will be created based on {gapCount} identified knowledge gaps. It will
                    include specific topics to study, learning resources, and a daily/weekly schedule.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || gapCount === 0}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner className="mr-2" />
              Generating Plan...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Generate Study Plan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}