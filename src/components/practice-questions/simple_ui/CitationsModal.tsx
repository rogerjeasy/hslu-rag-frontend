"use client";
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ContextType } from '@/types/practice-questions-responses.types';
import { BookOpenIcon, ExternalLinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  citationNumbers: number[];
  context?: ContextType[];
}

const CitationsModal: React.FC<CitationsModalProps> = ({
  isOpen,
  onClose,
  citationNumbers,
  context = [],
}) => {
  // Filter context to show only the relevant citations
  const citations = context.filter(
    (ctx) => citationNumbers.includes(ctx.citationNumber)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <BookOpenIcon className="h-5 w-5 mr-2 text-blue-500" />
            Source Citations
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            References from course materials
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-2 max-h-[60vh] pr-4">
          {citations.length > 0 ? (
            <div className="space-y-6">
              {citations.map((citation) => (
                <div key={citation.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {citation.title || `Citation ${citation.citationNumber}`}
                    </h3>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {citation.citationNumber}
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">{citation.content}</p>
                  </div>
                  
                  {citation.sourceUrl && (
                    <div className="flex items-center text-sm">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-600 hover:text-blue-800"
                        asChild
                      >
                        <a href={citation.sourceUrl} target="_blank" rel="noopener noreferrer">
                          View Source Material
                          <ExternalLinkIcon className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                      {citation.sourcePage !== null && (
                        <span className="ml-2 text-gray-500">Page {citation.sourcePage}</span>
                      )}
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No citation details available</p>
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CitationsModal;