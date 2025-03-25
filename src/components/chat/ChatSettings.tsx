"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { X, HelpCircle, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  QueryType, 
  AdditionalParams,
  QuestionAnsweringParams,
  StudyGuideParams,
  PracticeQuestionsParams,
  KnowledgeGapParams
} from '@/types/query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ChatSettingsProps {
  queryType: QueryType;
  onQueryTypeChange: (queryType: QueryType) => void;
  additionalParams: AdditionalParams;
  onAdditionalParamsChange: (params: AdditionalParams) => void;
  onClose: () => void;
}

// Default values for each query type
const DEFAULT_PARAMS: Record<QueryType, AdditionalParams> = {
  [QueryType.QUESTION_ANSWERING]: {
    temperature: 0.7,
    max_length: 1000,
    include_citations: true,
  } as QuestionAnsweringParams,
  [QueryType.STUDY_GUIDE]: {
    detail_level: "medium",
    format: "outline",
    include_examples: true,
    max_length: 2000,
    temperature: 0.5,
  } as StudyGuideParams,
  [QueryType.PRACTICE_QUESTIONS]: {
    difficulty: "medium",
    question_count: 5,
    question_types: ["multiple_choice", "short_answer"],
    include_answers: true,
    temperature: 0.7,
  } as PracticeQuestionsParams,
  [QueryType.KNOWLEDGE_GAP]: {
    past_interactions_count: 10,
    detail_level: "medium",
    include_study_plan: true,
    temperature: 0.3,
  } as KnowledgeGapParams,
};

const ChatSettings: React.FC<ChatSettingsProps> = ({
  queryType,
  onQueryTypeChange,
  additionalParams,
  onAdditionalParamsChange,
  onClose,
}) => {
  // Initialize with a merged version of defaults and provided params
  const [localParams, setLocalParams] = useState<AdditionalParams>(() => ({
    ...DEFAULT_PARAMS[queryType],
    ...additionalParams
  }));
  
  // Handle query type change
  const handleQueryTypeChange = useCallback((value: string) => {
    const newType = value as QueryType;
    onQueryTypeChange(newType);
    
    // Reset params to default when changing type
    setLocalParams(DEFAULT_PARAMS[newType]);
  }, [onQueryTypeChange]);
  
  // Update params helper
  const updateParams = useCallback((update: Partial<AdditionalParams>) => {
    setLocalParams(prev => ({ ...prev, ...update }));
  }, []);
  
  // Save changes
  const saveChanges = useCallback(() => {
    onAdditionalParamsChange(localParams);
  }, [localParams, onAdditionalParamsChange]);
  
  // Reset to defaults
  const resetDefaults = useCallback(() => {
    setLocalParams(DEFAULT_PARAMS[queryType]);
  }, [queryType]);

  // Extract values with type safety
//   const getParam = <T extends keyof AdditionalParams>(
//     key: T, 
//     defaultValue: AdditionalParams[T]
//   ): AdditionalParams[T] => {
//     return localParams[key] !== undefined ? localParams[key] : defaultValue;
//   };

  // Temperature and related values
//   const temperature = getParam('temperature', 0.7) as number;
  
  // Render settings for Question Answering
  const renderQuestionAnsweringSettings = useCallback(() => {
    const params = localParams as QuestionAnsweringParams;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="temperature">Temperature</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    Controls randomness. Lower values give more focused, deterministic responses.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[params.temperature ?? 0.7]}
              onValueChange={(value) => updateParams({ temperature: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-center text-sm">
              {(params.temperature ?? 0.7).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="max_length">Max Response Length</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    Maximum number of tokens in the response.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={String(params.max_length ?? 1000)}
            onValueChange={(value) => updateParams({ max_length: parseInt(value) })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">Short (500 tokens)</SelectItem>
              <SelectItem value="1000">Medium (1000 tokens)</SelectItem>
              <SelectItem value="2000">Long (2000 tokens)</SelectItem>
              <SelectItem value="4000">Very Long (4000 tokens)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label htmlFor="include_citations">Include Citations</Label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Show sources used for responses
            </span>
          </div>
          <Switch
            id="include_citations"
            checked={params.include_citations ?? true}
            onCheckedChange={(checked) => updateParams({ include_citations: checked })}
          />
        </div>
      </div>
    );
  }, [localParams, updateParams]);

  // Render settings for Study Guide
  const renderStudyGuideSettings = useCallback(() => {
    const params = localParams as StudyGuideParams;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="detail_level">Detail Level</Label>
          <Select
            value={params.detail_level ?? "medium"}
            onValueChange={(value) => updateParams({ detail_level: value as 'basic' | 'medium' | 'comprehensive' })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select detail level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic - High-level overview</SelectItem>
              <SelectItem value="medium">Medium - Balanced detail</SelectItem>
              <SelectItem value="comprehensive">Comprehensive - In-depth coverage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <Select
            value={params.format ?? "outline"}
            onValueChange={(value) => updateParams({ format: value as 'outline' | 'notes' | 'flashcards' | 'mind_map' | 'summary' })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="notes">Detailed Notes</SelectItem>
              <SelectItem value="flashcards">Flashcard Format</SelectItem>
              <SelectItem value="mind_map">Mind Map Structure</SelectItem>
              <SelectItem value="summary">Narrative Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label htmlFor="include_examples">Include Examples</Label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Add practical examples and applications
            </span>
          </div>
          <Switch
            id="include_examples"
            checked={params.include_examples ?? true}
            onCheckedChange={(checked) => updateParams({ include_examples: checked })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="study_temperature">Creativity</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    Lower values produce more accurate, fact-based content.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              id="study_temperature"
              min={0}
              max={1}
              step={0.1}
              value={[params.temperature ?? 0.5]}
              onValueChange={(value) => updateParams({ temperature: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-center text-sm">
              {(params.temperature ?? 0.5).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    );
  }, [localParams, updateParams]);

  // Render settings for Practice Questions
  const renderPracticeQuestionsSettings = useCallback(() => {
    const params = localParams as PracticeQuestionsParams;
    const questionTypes = params.question_types ?? ['multiple_choice', 'short_answer'];
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            value={params.difficulty ?? "medium"}
            onValueChange={(value) => updateParams({ difficulty: value as 'easy' | 'medium' | 'hard' | 'mixed' })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy - Basic concepts</SelectItem>
              <SelectItem value="medium">Medium - Application-focused</SelectItem>
              <SelectItem value="hard">Hard - Challenging problems</SelectItem>
              <SelectItem value="mixed">Mixed - Variety of difficulties</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="question_count">Number of Questions</Label>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              id="question_count"
              min={1}
              max={10}
              step={1}
              value={[params.question_count ?? 5]}
              onValueChange={(value) => updateParams({ question_count: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-center text-sm">
              {params.question_count ?? 5}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="question_types">Question Types</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['multiple_choice', 'short_answer', 'true_false', 'coding', 'essay'].map((type) => {
              const isSelected = questionTypes.includes(type);
              
              return (
                <Badge
                  key={type}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const updatedTypes = isSelected
                      ? questionTypes.filter(t => t !== type)
                      : [...questionTypes, type];
                    
                    updateParams({ question_types: updatedTypes });
                  }}
                >
                  {type.replace('_', ' ')}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label htmlFor="include_answers">Include Answers</Label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Provide answer explanations
            </span>
          </div>
          <Switch
            id="include_answers"
            checked={params.include_answers ?? true}
            onCheckedChange={(checked) => updateParams({ include_answers: checked })}
          />
        </div>
      </div>
    );
  }, [localParams, updateParams]);

  // Render settings for Knowledge Gap Analysis
  const renderKnowledgeGapSettings = useCallback(() => {
    const params = localParams as KnowledgeGapParams;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="past_interactions_count">Conversation History to Analyze</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    Number of past conversations to analyze for identifying knowledge gaps.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              id="past_interactions_count"
              min={5}
              max={20}
              step={5}
              value={[params.past_interactions_count ?? 10]}
              onValueChange={(value) => updateParams({ past_interactions_count: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-center text-sm">
              {params.past_interactions_count ?? 10}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="knowledge_detail_level">Analysis Detail</Label>
          <Select
            value={params.detail_level ?? "medium"}
            onValueChange={(value) => updateParams({ detail_level: value as 'basic' | 'medium' | 'detailed' })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select detail level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic - Key gaps only</SelectItem>
              <SelectItem value="medium">Medium - Balanced analysis</SelectItem>
              <SelectItem value="detailed">Detailed - Comprehensive assessment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label htmlFor="include_study_plan">Include Study Plan</Label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Create a personalized study plan
            </span>
          </div>
          <Switch
            id="include_study_plan"
            checked={params.include_study_plan ?? true}
            onCheckedChange={(checked) => updateParams({ include_study_plan: checked })}
          />
        </div>
      </div>
    );
  }, [localParams, updateParams]);

  // Decide which settings to render based on query type
  const renderQueryTypeSettings = useMemo(() => {
    switch (queryType) {
      case QueryType.QUESTION_ANSWERING:
        return renderQuestionAnsweringSettings();
      case QueryType.STUDY_GUIDE:
        return renderStudyGuideSettings();
      case QueryType.PRACTICE_QUESTIONS:
        return renderPracticeQuestionsSettings();
      case QueryType.KNOWLEDGE_GAP:
        return renderKnowledgeGapSettings();
      default:
        return null;
    }
  }, [
    queryType, 
    renderQuestionAnsweringSettings, 
    renderStudyGuideSettings, 
    renderPracticeQuestionsSettings, 
    renderKnowledgeGapSettings
  ]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold">Chat Settings</h3>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="query_type">Response Type</Label>
            <Select value={queryType} onValueChange={handleQueryTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select query type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={QueryType.QUESTION_ANSWERING}>
                  Question Answering
                </SelectItem>
                <SelectItem value={QueryType.STUDY_GUIDE}>
                  Study Guide
                </SelectItem>
                <SelectItem value={QueryType.PRACTICE_QUESTIONS}>
                  Practice Questions
                </SelectItem>
                <SelectItem value={QueryType.KNOWLEDGE_GAP}>
                  Knowledge Gap Analysis
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <Accordion type="single" collapsible defaultValue="response-settings">
            <AccordionItem value="response-settings">
              <AccordionTrigger>Response Settings</AccordionTrigger>
              <AccordionContent className="pt-4">
                {renderQueryTypeSettings}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex gap-2">
          <Button onClick={saveChanges} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
          <Button variant="outline" onClick={resetDefaults}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
          Settings apply to new messages only
        </p>
      </div>
    </div>
  );
};

export default ChatSettings;