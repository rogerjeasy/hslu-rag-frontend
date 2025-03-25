"use client";

import React, { useState } from 'react';
import { Message } from '@/types/conversation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, Check, BookOpen, ExternalLink } from 'lucide-react';
import Markdown from '@/components/ui/Markdown';
import { Citation } from '@/types/query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [citationsOpen, setCitationsOpen] = useState(false);
  
  const isUser = message.role === 'user';
  const citations = message.metadata?.citations as Citation[] | undefined;
  const hasCitations = citations && citations.length > 0;
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDateTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  return (
    <div 
      className={cn(
        "group relative px-4 py-6 sm:px-6 rounded-lg transition-colors",
        isUser 
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30" 
          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      )}
    >
      <div className="flex gap-4">
        <Avatar className={cn(
          "h-8 w-8 rounded-full",
          isUser ? "bg-primary" : "bg-emerald-500"
        )}>
          <AvatarFallback>
            {isUser ? 'U' : 'AI'}
          </AvatarFallback>
          {isUser ? (
            <AvatarImage src="/user-avatar.png" alt="User" />
          ) : (
            <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
          )}
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div className="font-medium text-sm">
              {isUser ? 'You' : 'AI Assistant'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {formatDateTime(message.timestamp)}
            </div>
          </div>
          
          <div className="prose prose-slate dark:prose-invert prose-p:my-2 prose-p:leading-relaxed prose-pre:my-2 max-w-none">
            <Markdown content={message.content} />
          </div>
          
          {hasCitations && (
            <Collapsible
              open={citationsOpen}
              onOpenChange={setCitationsOpen}
              className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-0 space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {citationsOpen ? 'Hide Sources' : `${citations.length} Source${citations.length > 1 ? 's' : ''}`}
                    </span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="mt-3">
                <div className="space-y-3">
                  {citations.map((citation, index) => (
                    <div 
                      key={`${citation.materialId}-${index}`}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-primary/10 text-xs">
                          {citation.pageNumber ? `Page ${citation.pageNumber}` : 'Document'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Chunk {citation.chunkIndex}
                        </Badge>
                      </div>
                      
                      <h4 className="text-sm font-medium mb-1 line-clamp-1">
                        {citation.title || `Source ${index + 1}`}
                      </h4>
                      
                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 mb-2">
                        {citation.contentPreview}
                      </p>
                      
                      {citation.fileUrl && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs"
                          onClick={() => window.open(citation.fileUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View source
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
      
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleCopyContent}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {copied ? 'Copied!' : 'Copy message'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChatMessage;