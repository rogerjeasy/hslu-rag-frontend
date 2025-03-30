'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStudyGuideStore } from '@/store/studyGuideStore';
import { StudyGuideResponse } from '@/types/study-guide.types';
import StudyGuideDetail from '@/components/study-guides/details/StudyGuideDetail';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import { CourseProvider } from '@/components/application-management/courses/CourseProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function StudyGuideDetailComponent() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { getStudyGuide, deleteStudyGuide, isLoading, error } = useStudyGuideStore();
  const [studyGuide, setStudyGuide] = useState<StudyGuideResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStudyGuide = async () => {
      try {
        if (params.id) {
          const guideId = Array.isArray(params.id) ? params.id[0] : params.id;
          const response = await getStudyGuide(guideId);
          setStudyGuide(response);
        }
      } catch (error) {
        console.error('Error fetching study guide:', error);
      }
    };

    fetchStudyGuide();
  }, [params.id, getStudyGuide]);

  const handleGoBack = () => {
    router.back();
  };

  const handleEditClick = () => {
    toast({
      title: 'Edit mode',
      description: 'Editing feature is not implemented in this demo.',
    });
  };

  const handleDeleteClick = async () => {
    if (!studyGuide) return;

    const guideId = studyGuide.queryId;

    try {
      await deleteStudyGuide(guideId);
      toast({
        title: 'Study guide deleted',
        description: 'The study guide has been successfully deleted.',
      });
      router.push('/study-guides');
    } catch (error) {
        console.error('Error deleting study guide:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the study guide. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handlePrintClick = () => {
    window.print();
  };

  const handleDownloadClick = () => {
    if (!studyGuide) return;
    
    // Implementation for downloading as markdown
    const content = studyGuide.answer;
    const filename = `${studyGuide.query.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Study guide downloaded',
      description: `Downloaded as ${filename}`,
    });
  };

  const handleShareClick = () => {
    if (!studyGuide) return;
    
    // Implementation for sharing with Web Share API
    if (navigator.share) {
      navigator.share({
        title: studyGuide.query,
        text: `Check out this study guide on ${studyGuide.query}`,
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: 'Shared successfully',
          description: 'The study guide link has been shared.',
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        toast({
          title: 'Share failed',
          description: 'Failed to share the study guide.',
          variant: 'destructive',
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'The study guide link has been copied to clipboard.',
      });
    }
  };

  const handleSaveClick = () => {
    toast({
      title: 'Saved to bookmarks',
      description: 'This study guide has been saved to your bookmarks.',
    });
  };

  if (error) {
    return (
      <div className="w-full">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleGoBack}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try again or contact support if the problem persists.
          </AlertDescription>
        </Alert>
        
        <div className="mt-4">
          <Button onClick={() => router.push('/study-guides')}>
            Go to Study Guides
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !studyGuide) {
    return (
      <div className="w-full">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleGoBack}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <StudyGuideDetailSkeleton />
      </div>
    );
  }

  return (
    <CourseProvider>
      <div className="w-full">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleGoBack}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <StudyGuideDetail
          studyGuide={studyGuide}
          onEditClick={handleEditClick}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
          onPrint={handlePrintClick}
          onDownload={handleDownloadClick}
          onShare={handleShareClick}
          onSave={handleSaveClick}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the study guide.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteClick}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CourseProvider>
  );
}

function StudyGuideDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="w-48 h-5 bg-muted rounded animate-pulse" />
        <div className="w-full h-9 bg-muted rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="w-20 h-6 bg-muted rounded animate-pulse" />
          <div className="w-24 h-6 bg-muted rounded animate-pulse" />
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex justify-between">
              <div className="w-32 h-6 bg-muted rounded animate-pulse" />
              <div className="w-20 h-6 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-full h-5 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar skeleton */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="w-40 h-6 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-full h-5 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}