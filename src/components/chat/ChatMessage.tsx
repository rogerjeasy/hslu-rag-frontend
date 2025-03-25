"use client";

import React, { useState } from 'react';
import { Message } from '@/types/conversation';
import { Citation } from '@/types/query';
import Markdown from '../ui/Markdown';
import { formatDistanceToNow } from 'date-fns';
import { Copy, Check, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [citationsOpen, setCitationsOpen] = useState(false);

  // Whether this is a user message or AI message
  const isUser = message.role === 'user';
  
  // Format the message timestamp
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  
  // Get citations from message metadata if available
  const citations: Citation[] = message.metadata?.citations as Citation[] || [];
  const hasCitations = citations.length > 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : ''}`}>
      {/* Avatar/Icon */}
      {!isUser && (
        <div className="flex-shrink-0 mr-4 mt-1">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            AI
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-3xl ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`p-3 rounded-lg ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <Markdown content={message.content} />
          )}
        </div>
        
        {/* Message Metadata */}
        <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
          <span>{formattedTime}</span>
          
          {!isUser && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? 'Copied!' : 'Copy message'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {hasCitations && (
                <Collapsible
                  open={citationsOpen}
                  onOpenChange={setCitationsOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Info size={12} />
                      <span>{citations.length} {citations.length === 1 ? 'Source' : 'Sources'}</span>
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-2 border rounded-md p-2 bg-gray-50 dark:bg-gray-800 text-sm">
                    <h4 className="font-medium mb-2">Sources</h4>
                    <ul className="space-y-2">
                      {citations.map((citation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">{citation.title}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                              {citation.pageNumber && `Page ${citation.pageNumber}`}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                              {citation.contentPreview}
                            </p>
                            {citation.fileUrl && (
                              <a 
                                href={citation.fileUrl} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs flex items-center gap-1 mt-1"
                              >
                                <ExternalLink size={10} />
                                <span>View Source</span>
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Avatar (right-aligned) */}
      {isUser && (
        <div className="flex-shrink-0 ml-4 mt-1">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300">
            U
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;