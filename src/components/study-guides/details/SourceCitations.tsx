import React from 'react';
import { ExternalLinkIcon, FileTextIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RAGContext } from '@/types/rag.types';

interface SourceCitationsProps {
  context: RAGContext[];
  citations: number[];
}

export function SourceCitations({ context, citations }: SourceCitationsProps) {
  // Sort context by citation number for consistent display
  const sortedContext = [...context].sort((a, b) => a.citationNumber - b.citationNumber);
  
  // Map of citation numbers to highlight
  const citationMap = new Set(citations);
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Below are the sources used to create this study guide. Citations referenced in the guide are highlighted.
      </div>
      
      <div className="space-y-4">
        {sortedContext.map((source) => (
          <SourceCitationCard 
            key={source.id} 
            source={source} 
            isHighlighted={citationMap.has(source.citationNumber)}
          />
        ))}
      </div>
    </div>
  );
}

interface SourceCitationCardProps {
  source: RAGContext;
  isHighlighted: boolean;
}

function SourceCitationCard({ source, isHighlighted }: SourceCitationCardProps) {
  return (
    <Card className={`overflow-hidden transition-all ${
      isHighlighted 
        ? 'border-blue-400 dark:border-blue-500 shadow-sm' 
        : 'border-gray-200 dark:border-gray-800'
    }`}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Badge 
                variant={isHighlighted ? "default" : "outline"}
                className={isHighlighted ? "bg-blue-500" : ""}
              >
                [{source.citationNumber}]
              </Badge>
              <h3 className="font-medium text-lg">{source.title || 'Source'}</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              {source.score !== undefined && (
                <Badge variant="outline" className="text-xs">
                  Score: {(source.score * 100).toFixed(0)}%
                </Badge>
              )}
            </div>
          </div>
          
          <blockquote className={`
            pl-4 border-l-4 italic text-muted-foreground
            ${isHighlighted ? 'border-blue-400 dark:border-blue-500' : 'border-gray-200 dark:border-gray-700'}
          `}>
            &quot;{source.content}&quot;
          </blockquote>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {source.materialId && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <FileTextIcon className="h-3 w-3" />
                Material ID: {source.materialId.substring(0, 8)}...
              </Badge>
            )}
            
            {source.sourcePage && (
              <Badge variant="outline" className="text-xs">
                Page {source.sourcePage}
              </Badge>
            )}
            
            {source.sourceUrl && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={() => window.open(source.sourceUrl, '_blank')}
              >
                View Source
                <ExternalLinkIcon className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}