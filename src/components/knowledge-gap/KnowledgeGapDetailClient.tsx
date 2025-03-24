'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { KnowledgeGapDetail } from '@/components/knowledge-gap/KnowledgeGapDetail';
import { knowledgeGapService } from '@/services/knowledge.gap.service';
import { KnowledgeAssessment } from '@/types/knowledge-gap';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { useAuth } from "@/store/userStore";
import { ArrowLeft, RefreshCw, Trash2, Brain, FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

function KnowledgeGapDetailClient({ id }: { id?: string }) {
  const router = useRouter();
  const params = useParams();
  // Use id prop if provided, otherwise get it from URL params
  const assessmentId = id || (params?.id as string);
  
  const { user, loading: authLoading } = useAuth();
  const [assessment, setAssessment] = useState<KnowledgeAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!assessmentId) {
      setError('No assessment ID provided');
      setLoading(false);
      return;
    }

    if (!authLoading && !user) {
      router.push(`/login?redirectTo=/knowledge-gaps/${assessmentId}`);
      return;
    }

    if (user) {
      fetchAssessment();
    }
  }, [assessmentId, user, authLoading, router]);

  const fetchAssessment = async () => {
    if (!assessmentId) return;
    
    setLoading(true);
    setError(null);
    setRefreshing(true);
    try {
      const data = await knowledgeGapService.getKnowledgeGapAssessment(assessmentId);
      setAssessment(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load assessment details');
      setAssessment(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!assessmentId) return;
    
    try {
      await knowledgeGapService.deleteKnowledgeGapAssessment(assessmentId);
      router.push('/knowledge-gaps');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete assessment');
    }
  };

  if (authLoading || (loading && !assessment)) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
        <div className="flex justify-start mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        
        <Card className="overflow-hidden border-primary/10 shadow-sm">
          <CardHeader className="bg-primary/5">
            <Skeleton className="h-8 w-[250px] mb-2" />
            <Skeleton className="h-4 w-[180px]" />
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
            
            <div className="pt-4">
              <Skeleton className="h-8 w-[200px] mb-3" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-16 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
        <div className="flex justify-start mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/knowledge-gaps')}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessments
          </Button>
        </div>

        <Card className="border-destructive/20 bg-destructive/5 shadow-md overflow-hidden">
          <CardContent className="p-6">
            <ErrorAlert 
              message={error} 
              title="Failed to load assessment" 
              onRetry={fetchAssessment}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
        <div className="flex justify-start mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/knowledge-gaps')}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessments
          </Button>
        </div>

        <Card className="border-primary/10 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
              <div className="flex items-center justify-center">
                <FileText className="h-12 w-12 text-primary/40" />
              </div>
            </div>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Assessment Not Found</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                The knowledge gap assessment you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
              </p>
              <Button 
                onClick={() => router.push('/knowledge-gaps')}
                className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                View All Assessments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format the assessment date
  const formattedDate = assessment.createdAt ? 
    new Date(assessment.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Unknown date';

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary/10 to-secondary/5 p-4 rounded-lg shadow-sm">
        <Button
          variant="outline"
          onClick={() => router.push('/knowledge-gaps')}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessments
        </Button>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button 
            variant="outline" 
            onClick={fetchAssessment}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this knowledge gap assessment? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="border-primary/10 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10 p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {assessment.title || 'Knowledge Gap Assessment'}
                </h1>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
                
                {assessment.courseId && (
                  <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                    Course ID: {assessment.courseId}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {assessment.metadata?.score !== undefined && (
                <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm border border-primary/10">
                  <span className="text-sm text-muted-foreground">Score</span>
                  <span className="text-2xl font-bold text-primary">{assessment.metadata.score as number}%</span>
                  <Progress value={assessment.metadata.score as number} className="w-16 h-1.5 mt-1" />
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <KnowledgeGapDetail 
            assessment={assessment}
            onDelete={handleDelete}
            onUpdate={fetchAssessment}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default KnowledgeGapDetailClient;