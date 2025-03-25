"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, PlusCircle, Paperclip, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { QueryType } from '@/types/query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatInputProps {
  onSendMessage: (content: string, queryType?: QueryType) => void;
  disabled?: boolean;
  conversationId?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  conversationId 
}) => {
  const [message, setMessage] = useState('');
  const [queryTypeOpen, setQueryTypeOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when conversation changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [conversationId]);

  const handleSend = (queryType: QueryType = QueryType.QUESTION_ANSWERING) => {
    if (message.trim() && !disabled) {
      onSendMessage(message, queryType);
      setMessage('');
      
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Templates for different query types
  const queryTemplates = {
    [QueryType.QUESTION_ANSWERING]: [
      "Can you explain the concept of...",
      "What's the difference between...",
      "How does ... work in the context of...",
    ],
    [QueryType.STUDY_GUIDE]: [
      "Create a study guide for...",
      "Summarize the key points in...",
      "What are the main concepts I need to understand for...",
    ],
    [QueryType.PRACTICE_QUESTIONS]: [
      "Generate practice questions about...",
      "Create a quiz on...",
      "Test my understanding of...",
    ],
    [QueryType.KNOWLEDGE_GAP]: [
      "What topics should I focus on for...",
      "Identify gaps in my understanding of...",
      "Where am I weak in the subject of...",
    ],
  };

  return (
    <div className="p-4 max-w-4xl mx-auto w-full">
      <div className="relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
        {/* Query Type Button */}
        <div className="absolute left-3 top-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Sparkles size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuItem onClick={() => handleSend(QueryType.QUESTION_ANSWERING)}>
                Ask a Question
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSend(QueryType.STUDY_GUIDE)}>
                Generate Study Guide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSend(QueryType.PRACTICE_QUESTIONS)}>
                Generate Practice Questions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSend(QueryType.KNOWLEDGE_GAP)}>
                Identify Knowledge Gaps
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Template Suggestions Button */}
        <div className="absolute right-14 top-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <PlusCircle size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-80 p-0">
              <Tabs defaultValue={QueryType.QUESTION_ANSWERING}>
                <div className="p-3 border-b">
                  <TabsList className="w-full">
                    <TabsTrigger value={QueryType.QUESTION_ANSWERING} className="flex-1">Questions</TabsTrigger>
                    <TabsTrigger value={QueryType.STUDY_GUIDE} className="flex-1">Study</TabsTrigger>
                    <TabsTrigger value={QueryType.PRACTICE_QUESTIONS} className="flex-1">Practice</TabsTrigger>
                  </TabsList>
                </div>
                
                {Object.entries(queryTemplates).map(([type, templates]) => (
                  <TabsContent key={type} value={type} className="mt-0">
                    <div className="py-1">
                      {templates.map((template, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setMessage(template);
                            if (textareaRef.current) {
                              textareaRef.current.focus();
                            }
                          }}
                        >
                          {template}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>

        {/* Attachment Button */}
        <div className="absolute right-3 top-3">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={disabled}
            className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Paperclip size={18} />
          </Button>
        </div>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type your message..."
          className="resize-none min-h-[80px] max-h-[200px] pl-12 pr-24 py-3 rounded-md border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Send Button */}
        <div className="absolute right-3 bottom-3">
          <Button 
            onClick={() => handleSend()} 
            disabled={!message.trim() || disabled}
            size="sm"
            className="h-8 px-3 transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send size={16} className="mr-1" />
            <span>Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;