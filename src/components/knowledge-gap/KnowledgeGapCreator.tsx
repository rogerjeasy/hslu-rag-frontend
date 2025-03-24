// src/components/knowledge-gap/KnowledgeGapCreator.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KnowledgeAssessment } from '@/types/knowledge-gap';
import { knowledgeGapService } from '@/services/knowledge.gap.service';
import { useToast } from '@/components/ui/toast-provider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Book, Database, Send, X, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KnowledgeGapCreatorProps {
  courseId: string;
  moduleId?: string;
  topicId?: string;
  onCreated: (assessment: KnowledgeAssessment) => void;
  onCancel: () => void;
}

export function KnowledgeGapCreator({ 
  courseId, 
  moduleId, 
  topicId, 
  onCreated,
  onCancel
}: KnowledgeGapCreatorProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [interactionsCount, setInteractionsCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('query');

  const handleCreateAssessment = async () => {
    if (!query.trim()) {
      toast({
        title: "Query is required",
        description: "Please enter a question or topic to assess",
        variant: "destructive",
      });
      return;
    }

    if (!courseId) {
      toast({
        title: "Course is required",
        description: "Please select a course for this assessment",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const assessment = await knowledgeGapService.startKnowledgeGapAnalysis(
        query,
        courseId,
        interactionsCount,
        moduleId,
        topicId,
        model
      );
      toast({
        title: "Assessment created",
        description: "Your knowledge gap assessment has been created successfully",
      });
      onCreated(assessment);
    } catch (error) {
      toast({
        title: "Failed to create assessment",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Example queries to guide the user
  const exampleQueries = [
    "Evaluate my understanding of neural networks and deep learning",
    "What are the key concepts I should understand about linear regression?",
    "Assess my knowledge of database normalization principles",
    "What should I know about data cleaning and preprocessing?",
    "Check my understanding of statistical hypothesis testing"
  ];

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setTitle(example);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Create Knowledge Gap Assessment</span>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          Assess your understanding of key concepts and identify areas to focus your studies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="query" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Query
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Advanced Options
            </TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Assessment Title</Label>
              <Input
                id="title"
                placeholder="Title for your assessment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="query">What would you like to assess?</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Describe the topic or concept you want to assess your understanding of. You can ask specific questions or request an evaluation of your knowledge in a particular area.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="query"
                placeholder="E.g., Evaluate my understanding of neural networks and deep learning"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-32"
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Example queries</h4>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example.length > 45 ? example.substring(0, 45) + '...' : example}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="model">Model</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the AI model to use for the assessment. More advanced models may provide more detailed analysis but could take longer.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (Most comprehensive)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="interactions">History Context Size</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of past interactions to consider when analyzing your knowledge gaps. Higher values provide more context but may slow down the assessment.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select 
                value={interactionsCount.toString()} 
                onValueChange={(value) => setInteractionsCount(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select history size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Minimal (5 interactions)</SelectItem>
                  <SelectItem value="10">Standard (10 interactions)</SelectItem>
                  <SelectItem value="20">Comprehensive (20 interactions)</SelectItem>
                  <SelectItem value="30">Extensive (30 interactions)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course Information</Label>
              <div className="p-4 bg-gray-50 rounded-md dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-primary" />
                  <span className="font-medium">Course ID:</span>
                  <span>{courseId}</span>
                </div>
                {moduleId && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-medium">Module ID:</span>
                    <span>{moduleId}</span>
                  </div>
                )}
                {topicId && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-medium">Topic ID:</span>
                    <span>{topicId}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleCreateAssessment} disabled={loading || !query.trim()}>
          {loading ? (
            <>
              <LoadingSpinner className="mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Create Assessment
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}