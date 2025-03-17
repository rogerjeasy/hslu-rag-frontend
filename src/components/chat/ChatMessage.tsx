"use client";

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Copy, Check, ExternalLink, User, Bot, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Markdown from '../ui/Markdown';
import { ChatMessageProps, Citation } from '@/types/chat';

export default function ChatMessage({ 
  message, 
  showTimestamp = true,
  isLatestMessage = false
}: ChatMessageProps & { isLatestMessage?: boolean }) {
  const [copied, setCopied] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === 'user';
  
  // Add a highlight animation for new messages
  useEffect(() => {
    if (isLatestMessage && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLatestMessage]);

  // Format timestamp
  const formattedTime = message.timestamp
    ? format(new Date(message.timestamp), 'HH:mm')
    : '';
  
  const formattedDate = message.timestamp
    ? format(new Date(message.timestamp), 'MMM d, yyyy')
    : '';

  // Copy message content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={messageRef}
      className={cn(
        "group w-full px-4 py-6 transition-all duration-300",
        isLatestMessage && "animate-fade-in",
        isUser ? "bg-muted/30" : "bg-background hover:bg-muted/10"
      )}
    >
      <div className="mx-auto max-w-3xl flex items-start gap-4">
        {/* Avatar */}
        <div 
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
            isUser 
              ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white" 
              : "bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
          )}
          aria-label={isUser ? "User avatar" : "AI assistant avatar"}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Message Header */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm md:text-base">
                {isUser ? 'You' : 'AI Assistant'}
              </span>
              
              {showTimestamp && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5">
                        <Clock className="h-3 w-3" />
                        <span>{formattedTime}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {formattedDate}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {!isUser && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                >
                  {copied ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Message Body */}
          <div className={cn(
            "prose prose-sm md:prose-base dark:prose-invert max-w-none",
            isUser ? "prose-purple" : "prose-blue"
          )}>
            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            ) : (
              <div className="relative">
                <Markdown content={message.content} />
              </div>
            )}
          </div>

          {/* Citations if they exist */}
          {message.citations && message.citations.length > 0 && (
            <Card className="mt-4 overflow-hidden border-t border-border p-3">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>Sources</span>
              </h4>
              <ul className="space-y-3">
                {message.citations.map((citation: Citation) => (
                  <li key={citation.id} className="group/citation text-sm">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="h-6 text-xs px-2 rounded-sm">
                          {citation.source.split('.')[0]}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm mb-1 font-medium">{citation.text}</p>
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline flex items-center gap-1 group-hover/citation:text-blue-600"
                        >
                          <span>{citation.source}</span>
                          {citation.page && <span>- Page {citation.page}</span>}
                          <ExternalLink className="h-3 w-3 inline opacity-50 group-hover/citation:opacity-100" />
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}