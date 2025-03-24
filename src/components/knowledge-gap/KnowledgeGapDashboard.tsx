'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KnowledgeAssessment, KnowledgeAssessmentSummary } from '@/types/knowledge-gap';
import { knowledgeGapService } from '@/services/knowledge.gap.service';
import { KnowledgeGapList } from './KnowledgeGapList';
import { KnowledgeGapDetail } from './KnowledgeGapDetail';
import { KnowledgeGapCreator } from './KnowledgeGapCreator';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  PlusIcon, 
  RefreshCw, 
  List, 
  FileText, 
  PencilRuler, 
  Brain, 
  Lightbulb,
  PlusCircle,
  Filter
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

export default function KnowledgeGapDashboard({ courseId }: { courseId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  
  const [assessments, setAssessments] = useState<KnowledgeAssessmentSummary[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<KnowledgeAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(selectedId ? 'detail' : 'list');
  const [isCreating, setIsCreating] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'gaps'>('date');

  useEffect(() => {
    fetchAssessments();
  }, [courseId]);

  useEffect(() => {
    if (selectedId) {
      fetchAssessmentDetail(selectedId);
      setActiveTab('detail');
    } else {
      setSelectedAssessment(null);
    }
  }, [selectedId]);

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await knowledgeGapService.getKnowledgeGapAssessments(courseId);
      setAssessments(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessmentDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await knowledgeGapService.getKnowledgeGapAssessment(id);
      setSelectedAssessment(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load assessment details');
      setSelectedAssessment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setActiveTab('create');
    // Clear the selected assessment when creating a new one
    if (selectedId) {
      router.push('/knowledge-gaps');
    }
  };

  const handleAssessmentCreated = (assessment: KnowledgeAssessment) => {
    setIsCreating(false);
    setActiveTab('detail');
    setSelectedAssessment(assessment);
    fetchAssessments(); // Refresh the list
    router.push(`/knowledge-gaps?id=${assessment.id}`);
  };

  const handleAssessmentDeleted = (id: string) => {
    setSelectedAssessment(null);
    setActiveTab('list');
    router.push('/knowledge-gaps');
    // Update the assessments list by filtering out the deleted one
    setAssessments(prevAssessments => prevAssessments.filter(a => a.id !== id));
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setActiveTab('list');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAssessments();
    if (selectedId) {
      await fetchAssessmentDetail(selectedId);
    }
    setRefreshing(false);
  };

  const sortedAssessments = [...assessments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.gapCount - a.gapCount;
    }
  });

  const renderLoadingState = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[250px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[130px]" />
        </div>
      </div>
      
      <Skeleton className="h-12 w-full" />
      
      <div className="space-y-4 mt-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-10 w-[120px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 shadow-md overflow-hidden">
        <CardContent className="p-6">
          <ErrorAlert 
            title="Something went wrong" 
            message={error} 
            onRetry={handleRefresh} 
          />
        </CardContent>
      </Card>
    );
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'list':
        return <List className="h-4 w-4 mr-2" />;
      case 'detail':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'create':
        return <PencilRuler className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Knowledge Analysis
          </h2>
          {assessments.length > 0 && (
            <Badge variant="outline" className="ml-2 bg-primary/5">
              {assessments.length} {assessments.length === 1 ? 'assessment' : 'assessments'}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center bg-white hover:bg-gray-50 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                {sortBy === 'date' ? 'Sort by Date' : 'Sort by Gaps'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                <Badge variant={sortBy === 'date' ? 'default' : 'outline'} className="mr-2">
                  {sortBy === 'date' ? '✓' : ' '}
                </Badge>
                Date Created
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('gaps')}>
                <Badge variant={sortBy === 'gaps' ? 'default' : 'outline'} className="mr-2">
                  {sortBy === 'gaps' ? '✓' : ' '}
                </Badge>
                Number of Gaps
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex items-center bg-white hover:bg-gray-50 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            onClick={handleCreateNew}
            disabled={loading || isCreating}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            New Assessment
          </Button>
        </div>
      </div>

      {(loading && !refreshing && !isCreating) ? renderLoadingState() : (
        <Card className="border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full rounded-none bg-gray-50 border-b border-primary/10 p-0">
                <TabsTrigger 
                  value="list" 
                  className="flex items-center data-[state=active]:bg-white rounded-none border-r border-primary/10 flex-1 py-3"
                >
                  {getTabIcon('list')}
                  Assessments
                  {assessments.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {assessments.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="detail" 
                  disabled={!selectedAssessment}
                  className="flex items-center data-[state=active]:bg-white rounded-none border-r border-primary/10 flex-1 py-3"
                >
                  {getTabIcon('detail')}
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="create" 
                  disabled={!isCreating}
                  className="flex items-center data-[state=active]:bg-white rounded-none flex-1 py-3"
                >
                  {getTabIcon('create')}
                  Create New
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="list" className="p-0 m-0">
                    {assessments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                        <div className="p-4 bg-primary/5 rounded-full mb-4">
                          <Lightbulb className="h-8 w-8 text-primary/40" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No assessments yet</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                          Start by creating your first knowledge gap assessment to identify areas for improvement.
                        </p>
                        <Button 
                          onClick={handleCreateNew}
                          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Create Your First Assessment
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <KnowledgeGapList 
                          assessments={sortedAssessments} 
                          onSelectAssessment={(id) => {
                            router.push(`/knowledge-gaps?id=${id}`);
                          }}
                          onDeleteAssessment={handleAssessmentDeleted}
                          selectedId={selectedId || undefined}
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="detail" className="p-0 m-0">
                    {selectedAssessment ? (
                      <KnowledgeGapDetail 
                        assessment={selectedAssessment} 
                        onDelete={() => handleAssessmentDeleted(selectedAssessment.id)}
                        onUpdate={() => fetchAssessmentDetail(selectedAssessment.id)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                        <div className="p-4 bg-primary/5 rounded-full mb-4">
                          <FileText className="h-8 w-8 text-primary/40" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No assessment selected</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                          Select an assessment from the list to view its details.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => setActiveTab('list')}
                          className="bg-white hover:bg-gray-50 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <List className="h-4 w-4 mr-2" />
                          View List
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="create" className="p-0 m-0">
                    <KnowledgeGapCreator 
                      courseId={courseId || ''} 
                      onCreated={handleAssessmentCreated}
                      onCancel={handleCancelCreate}
                    />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}