'use client';

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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { ContextType } from '@/types/practice-questions.types';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  citation: number | undefined;
  context: ContextType | undefined;
}

export function CitationModal({
  isOpen,
  onClose,
  citation,
  context,
}: CitationModalProps) {
  const handleExternalLink = () => {
    if (context?.sourceUrl) {
      window.open(context.sourceUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Source {citation || ''}
          </DialogTitle>
          {context?.title && (
            <DialogDescription className="text-base">
              {context.title}
              {context.materialId && (
                <Badge variant="outline" className="ml-2">
                  ID: {context.materialId.substring(0, 8)}...
                </Badge>
              )}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-2">
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200">
            {context?.content ? (
              <p className="whitespace-pre-wrap">{context.content}</p>
            ) : (
              <p className="text-slate-500 italic">
                Citation content not available.
              </p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {context?.sourceUrl && (
            <Button
              variant="outline"
              className="sm:mr-auto flex items-center gap-2"
              onClick={handleExternalLink}
            >
              <LinkIcon className="h-4 w-4" />
              Open Source
            </Button>
          )}
          
          {context?.sourcePage && (
            <div className="text-sm text-slate-500">
              Page: {context.sourcePage}
            </div>
          )}
          
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}