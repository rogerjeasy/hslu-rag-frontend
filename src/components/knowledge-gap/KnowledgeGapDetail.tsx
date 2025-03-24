// src/components/knowledge-gap/KnowledgeGapDetail.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KnowledgeAssessment, GapSeverity, StudyPlanOptions } from '@/types/knowledge-gap';
import { knowledgeGapService } from '@/services/knowledge.gap.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GapList } from './GapList';
import { StrengthList } from './StrengthList';
import { StudyPlanGenerator } from './StudyPlanGenerator';
import { StudyPlanViewer } from './StudyPlanViewer';
import { 
  MoreVertical, Trash, Download, Share, Brain, 
  Award, FileQuestion, ArrowUpRight, BookOpen 
} from 'lucide-react';

interface KnowledgeGapDetailProps {
  assessment: KnowledgeAssessment;
  onDelete: () => void;
  onUpdate: () => void;
}

export function KnowledgeGapDetail({ assessment, onDelete, onUpdate }: KnowledgeGapDetailProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('gaps');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [generatingStudyPlan, setGeneratingStudyPlan] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await knowledgeGapService.deleteKnowledgeGapAssessment(assessment.id);
      onDelete();
      toast({
        title: "Assessment deleted",
        description: "The knowledge gap assessment has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to delete",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleGenerateStudyPlan = async (options: StudyPlanOptions) => {
    setGeneratingStudyPlan(true);
    try {
      await knowledgeGapService.generateStudyPlan(assessment.id, options);
      toast({
        title: "Study plan generated",
        description: "Your personalized study plan has been created",
      });
      onUpdate(); // Refresh the assessment with the new study plan
      setActiveTab('study-plan');
    } catch (error) {
      toast({
        title: "Failed to generate study plan",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setGeneratingStudyPlan(false);
    }
  };

  const handleExportAssessment = () => {
    // Create a JSON file for download
    const dataStr = JSON.stringify(assessment, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `knowledge-assessment-${assessment.id.slice(0, 8)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Assessment exported",
      description: "The assessment has been exported as a JSON file",
    });
  };

  const getSeverityColor = (severity: GapSeverity) => {
    switch (severity) {
      case GapSeverity.HIGH:
        return 'bg-red-100 text-red-800 border-red-200';
      case GapSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case GapSeverity.LOW:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Count gaps by severity
  const highGaps = assessment.gaps.filter(gap => gap.severity === GapSeverity.HIGH).length;
  const mediumGaps = assessment.gaps.filter(gap => gap.severity === GapSeverity.MEDIUM).length;
  const lowGaps = assessment.gaps.filter(gap => gap.severity === GapSeverity.LOW).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="relative pb-2">
          <div className="absolute right-4 top-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('study-plan')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Study Plan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportAssessment}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Assessment
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share Assessment
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Assessment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <CardTitle className="pr-10">{assessment.title}</CardTitle>
          <CardDescription>
            Created on {format(new Date(assessment.createdAt), 'MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{assessment.gaps.length}</div>
              <div className="text-sm text-gray-500">Total Knowledge Gaps</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{assessment.strengths.length}</div>
              <div className="text-sm text-gray-500">Identified Strengths</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="flex gap-2 justify-center">
                {highGaps > 0 && (
                  <Badge className={getSeverityColor(GapSeverity.HIGH)}>
                    {highGaps} High
                  </Badge>
                )}
                {mediumGaps > 0 && (
                  <Badge className={getSeverityColor(GapSeverity.MEDIUM)}>
                    {mediumGaps} Medium
                  </Badge>
                )}
                {lowGaps > 0 && (
                  <Badge className={getSeverityColor(GapSeverity.LOW)}>
                    {lowGaps} Low
                  </Badge>
                )}
                {assessment.gaps.length === 0 && (
                  <Badge>No gaps</Badge>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-2">Severity Breakdown</div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="gaps" className="flex items-center">
                <FileQuestion className="h-4 w-4 mr-2" />
                Knowledge Gaps ({assessment.gaps.length})
              </TabsTrigger>
              <TabsTrigger value="strengths" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Strengths ({assessment.strengths.length})
              </TabsTrigger>
              <TabsTrigger value="study-plan" className="flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Study Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gaps">
              {assessment.gaps.length > 0 ? (
                <GapList gaps={assessment.gaps} />
              ) : (
                <Alert>
                  <AlertDescription>
                    No knowledge gaps were identified. Either you have a strong understanding of this topic, or the assessment might need to be refined with a more specific query.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="strengths">
              {assessment.strengths.length > 0 ? (
                <StrengthList strengths={assessment.strengths} />
              ) : (
                <Alert>
                  <AlertDescription>
                    No specific strengths were identified in this assessment. Consider providing more context in your query to get a more comprehensive evaluation.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="study-plan">
              {assessment.recommendedStudyPlan ? (
                <StudyPlanViewer studyPlan={assessment.recommendedStudyPlan} />
              ) : (
                <StudyPlanGenerator 
                  onGenerate={handleGenerateStudyPlan}
                  isGenerating={generatingStudyPlan}
                  gapCount={assessment.gaps.length}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to List
          </Button>
          {activeTab === 'study-plan' && !assessment.recommendedStudyPlan && (
            <Button 
              onClick={() => setActiveTab('gaps')}
              variant="secondary"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Review Gaps First
            </Button>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this knowledge gap assessment and any associated study plans. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}