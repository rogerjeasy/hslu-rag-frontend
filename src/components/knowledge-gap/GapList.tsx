// src/components/knowledge-gap/GapList.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { KnowledgeGap, GapSeverity } from '@/types/knowledge-gap';
import { 
  ChevronDown, ChevronUp, Search, Link, ExternalLink, 
  Bookmark, BookmarkCheck, FileText, Book
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GapListProps {
  gaps: KnowledgeGap[];
}

export function GapList({ gaps }: GapListProps) {
  const [expandedGaps, setExpandedGaps] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<GapSeverity | 'all'>('all');
  const [savedGaps, setSavedGaps] = useState<Record<string, boolean>>({});

  const toggleGapExpanded = (id: string) => {
    setExpandedGaps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleSavedGap = (id: string) => {
    setSavedGaps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter the gaps based on search term and severity
  const filteredGaps = gaps.filter(gap => {
    const matchesSearch = 
      gap.concept.toLowerCase().includes(searchTerm.toLowerCase()) || 
      gap.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = selectedSeverity === 'all' || gap.severity === selectedSeverity;
    
    return matchesSearch && matchesSeverity;
  });

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

  const getSeverityLabel = (severity: GapSeverity) => {
    switch (severity) {
      case GapSeverity.HIGH:
        return 'High Priority';
      case GapSeverity.MEDIUM:
        return 'Medium Priority';
      case GapSeverity.LOW:
        return 'Low Priority';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search gaps..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedSeverity === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('all')}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={selectedSeverity === GapSeverity.HIGH ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity(GapSeverity.HIGH)}
            className={`whitespace-nowrap ${selectedSeverity !== GapSeverity.HIGH && 'border-red-200 text-red-800'}`}
          >
            High
          </Button>
          <Button
            variant={selectedSeverity === GapSeverity.MEDIUM ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity(GapSeverity.MEDIUM)}
            className={`whitespace-nowrap ${selectedSeverity !== GapSeverity.MEDIUM && 'border-yellow-200 text-yellow-800'}`}
          >
            Medium
          </Button>
          <Button
            variant={selectedSeverity === GapSeverity.LOW ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity(GapSeverity.LOW)}
            className={`whitespace-nowrap ${selectedSeverity !== GapSeverity.LOW && 'border-green-200 text-green-800'}`}
          >
            Low
          </Button>
        </div>
      </div>

      {filteredGaps.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No matching gaps found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGaps.map((gap) => (
            <Card key={gap.id} className="overflow-hidden">
              <CardHeader 
                className={`p-4 cursor-pointer ${expandedGaps[gap.id] ? 'pb-2' : ''}`}
                onClick={() => toggleGapExpanded(gap.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 pr-8">
                    <Badge className={getSeverityColor(gap.severity)}>
                      {getSeverityLabel(gap.severity)}
                    </Badge>
                    <CardTitle className="text-lg">{gap.concept}</CardTitle>
                  </div>
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSavedGap(gap.id);
                            }}
                          >
                            {savedGaps[gap.id] ? (
                              <BookmarkCheck className="h-4 w-4 text-primary" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {savedGaps[gap.id] ? 'Remove from saved gaps' : 'Save this gap'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {expandedGaps[gap.id] ? (
                      <ChevronUp className="h-5 w-5 ml-2" />
                    ) : (
                      <ChevronDown className="h-5 w-5 ml-2" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {expandedGaps[gap.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 px-4 pb-4">
                      <div className="border-t my-2" />
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{gap.description}</p>
                      
                      {gap.recommendedResources && gap.recommendedResources.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2 flex items-center">
                            <Book className="h-4 w-4 mr-2" />
                            Recommended Resources
                          </h4>
                          <ul className="space-y-2 pl-6 list-disc">
                            {gap.recommendedResources.map((resource, index) => (
                              <li key={index}>
                                {resource.url ? (
                                  <a 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center"
                                  >
                                    {resource.title || resource.description}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                ) : (
                                  <span>{resource.title || resource.description}</span>
                                )}
                                {resource.description && resource.title && (
                                  <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {gap.citations && gap.citations.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Citations
                          </h4>
                          <div className="space-y-2 mt-2">
                            {gap.citations.map((citation, index) => (
                              <div 
                                key={index}
                                className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="font-medium">{citation.title}</div>
                                  {citation.pageNumber && (
                                    <Badge variant="outline">Page {citation.pageNumber}</Badge>
                                  )}
                                </div>
                                <div className="text-gray-500 mt-1">{citation.contentPreview}</div>
                                {citation.fileUrl && (
                                  <div className="mt-2">
                                    <Button variant="outline" size="sm" className="text-xs h-8">
                                      <Link className="h-3 w-3 mr-1" />
                                      View Source
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}