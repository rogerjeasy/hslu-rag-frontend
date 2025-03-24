// src/components/knowledge-gap/KnowledgeGapList.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { KnowledgeAssessmentSummary, GapSeverity } from '@/types/knowledge-gap';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
import { knowledgeGapService } from '@/services/knowledge.gap.service';
import { Search, Filter, MoreVertical, Trash, ExternalLink } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

interface KnowledgeGapListProps {
  assessments: KnowledgeAssessmentSummary[];
  onSelectAssessment: (id: string) => void;
  onDeleteAssessment: (id: string) => void;
  selectedId?: string;
}

export function KnowledgeGapList({ 
  assessments, 
  onSelectAssessment, 
  onDeleteAssessment,
  selectedId 
}: KnowledgeGapListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<GapSeverity | 'all'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter the assessments based on search term and severity
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || assessment.highestSeverity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      await knowledgeGapService.deleteKnowledgeGapAssessment(deleteId);
      onDeleteAssessment(deleteId);
    } catch (error) {
      console.error('Error deleting assessment:', error);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getSeverityColor = (severity?: GapSeverity) => {
    switch (severity) {
      case GapSeverity.HIGH:
        return 'bg-red-100 text-red-800 border-red-200';
      case GapSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case GapSeverity.LOW:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityLabel = (severity?: GapSeverity) => {
    switch (severity) {
      case GapSeverity.HIGH:
        return 'High';
      case GapSeverity.MEDIUM:
        return 'Medium';
      case GapSeverity.LOW:
        return 'Low';
      default:
        return 'None';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Severity
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSeverityFilter('all')}>
              All Severities
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter(GapSeverity.HIGH)}>
              High Severity
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter(GapSeverity.MEDIUM)}>
              Medium Severity
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter(GapSeverity.LOW)}>
              Low Severity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredAssessments.length === 0 ? (
        <EmptyState 
          title="No assessments found"
          description={searchTerm || severityFilter !== 'all' 
            ? "Try adjusting your search or filters" 
            : "Create your first knowledge gap assessment to get started"
          }
          icon={<Search className="h-12 w-12 text-gray-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssessments.map((assessment) => (
            <Card 
              key={assessment.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedId === assessment.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectAssessment(assessment.id)}
            >
              <CardContent className="p-4 relative">
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAssessment(assessment.id);
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(assessment.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold text-lg mb-2 pr-8">{assessment.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">
                      {assessment.gapCount} {assessment.gapCount === 1 ? 'gap' : 'gaps'}
                    </Badge>
                    {assessment.highestSeverity && (
                      <Badge className={getSeverityColor(assessment.highestSeverity)}>
                        {getSeverityLabel(assessment.highestSeverity)} severity
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {format(new Date(assessment.createdAt), 'PPP')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => {
        if (!open) setDeleteId(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this knowledge gap assessment. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}