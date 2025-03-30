"use client";
import React, { useState } from 'react';
import { format } from 'date-fns';
import { StudyGuideResponse, DetailLevel, StudyGuideFormat } from '@/types/study-guide.types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookmarkIcon,
  PenSquareIcon,
  Clock,
  BarChart3Icon,
  FileBadgeIcon
} from 'lucide-react';
import { StudyGuideHeader } from './StudyGuideHeader';
import { SourceCitations } from './SourceCitations';
import { FormattedContent } from './FormattedContent';
import { ActionButtons } from './ActionButtons';
import { MetadataDisplay } from './MetadataDisplay';
import { StudyProgress } from './/StudyProgress';

interface StudyGuideDetailProps {
  studyGuide: StudyGuideResponse;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export default function StudyGuideDetail({
  studyGuide,
  onEditClick,
  onDeleteClick,
  onPrint,
  onDownload,
  onShare,
  onSave
}: StudyGuideDetailProps) {
//   const router = useRouter();
  const [activeTab, setActiveTab] = useState('content');
  
  const formattedDate = studyGuide.timestamp 
    ? format(new Date(studyGuide.timestamp), 'PPP')
    : 'Unknown date';
  
  const handleStartStudying = () => {
    // Implement study session logic
    console.log('Starting study session for', studyGuide.queryId);
  };

  // Get format and detail level from meta
  const guideFormat = studyGuide.meta?.format as StudyGuideFormat || StudyGuideFormat.OUTLINE;
  const detailLevel = studyGuide.meta?.detail_level as DetailLevel || DetailLevel.MEDIUM;
  
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <StudyGuideHeader 
        title={studyGuide.query}
        format={guideFormat}
        detailLevel={detailLevel}
        createdAt={formattedDate}
        courseId={studyGuide.meta?.course_id as string}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Study Guide</CardTitle>
                <CardDescription>
                  {guideFormat.replace('_', ' ')} format • {detailLevel} detail
                </CardDescription>
              </div>
              <ActionButtons 
                onEdit={onEditClick}
                onDelete={onDeleteClick}
                onPrint={onPrint}
                onDownload={onDownload}
                onShare={onShare}
                onSave={onSave}
              />
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="content" className="mt-0">
                <CardContent className="pt-6">
                  <FormattedContent content={studyGuide.answer} citations={studyGuide.citations} />
                </CardContent>
              </TabsContent>
              
              <TabsContent value="sources" className="mt-0">
                <CardContent className="pt-6">
                  <SourceCitations context={studyGuide.context} citations={studyGuide.citations} />
                </CardContent>
              </TabsContent>
              
              <TabsContent value="stats" className="mt-0">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <div className="text-sm font-medium mb-2">Reading Time</div>
                        <div className="text-2xl font-bold flex items-center gap-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          {Math.ceil(studyGuide.answer.length / 1000)} min
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="text-sm font-medium mb-2">Sources</div>
                        <div className="text-2xl font-bold flex items-center gap-2">
                          <FileBadgeIcon className="h-5 w-5 text-muted-foreground" />
                          {studyGuide.context.length}
                        </div>
                      </div>
                    </div>
                    
                    <StudyProgress studyGuideId={studyGuide.queryId} />
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t pt-6">
              <Button onClick={handleStartStudying} size="lg" className="w-full sm:w-auto">
                Start Studying
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-6">
            <MetadataDisplay 
              studyGuide={studyGuide}
              courseId={studyGuide.meta?.course_id as string}
              format={guideFormat}
              detailLevel={detailLevel}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3Icon className="mr-2 h-4 w-4" />
                    Practice Questions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PenSquareIcon className="mr-2 h-4 w-4" />
                    Knowledge Gap Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookmarkIcon className="mr-2 h-4 w-4" />
                    Saved Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}