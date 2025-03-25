"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Printer, 
  Share2, 
  Trash2, 
  BookOpen,
  HelpCircle,
  FileQuestion,
  BrainCircuit
} from 'lucide-react';
import { Conversation } from '@/types/conversation';
import { QueryType } from '@/types/query';
import { useConversationStore } from '@/store/conversationStore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

interface ChatControlsProps {
  conversation: Conversation | null;
}

const ChatControls: React.FC<ChatControlsProps> = ({ conversation }) => {
  const { deleteConversation, setCurrentConversation } = useConversationStore();

  if (!conversation) return null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteConversation(conversation.id);
        setCurrentConversation(null);
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    }
  };

  const exportPDF = () => {
    // Implementation for PDF export would go here
    alert('Export to PDF feature will be implemented here');
  };

  const printConversation = () => {
    window.print();
  };

  const shareConversation = () => {
    // Implementation for sharing would go here
    alert('Share conversation feature will be implemented here');
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          <Tabs defaultValue={QueryType.QUESTION_ANSWERING} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger 
                value={QueryType.QUESTION_ANSWERING} 
                className="text-xs px-2 h-7 gap-1 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900"
              >
                <HelpCircle size={14} />
                <span className="hidden sm:inline">Q&A</span>
              </TabsTrigger>
              <TabsTrigger 
                value={QueryType.STUDY_GUIDE} 
                className="text-xs px-2 h-7 gap-1 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900"
              >
                <BookOpen size={14} />
                <span className="hidden sm:inline">Study Guide</span>
              </TabsTrigger>
              <TabsTrigger 
                value={QueryType.PRACTICE_QUESTIONS} 
                className="text-xs px-2 h-7 gap-1 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900"
              >
                <FileQuestion size={14} />
                <span className="hidden sm:inline">Practice</span>
              </TabsTrigger>
              <TabsTrigger 
                value={QueryType.KNOWLEDGE_GAP} 
                className="text-xs px-2 h-7 gap-1 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900"
              >
                <BrainCircuit size={14} />
                <span className="hidden sm:inline">Knowledge Gaps</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={exportPDF}
                  className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Save size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save as PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={printConversation}
                  className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Printer size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={shareConversation}
                  className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Share2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDelete}
                  className="h-8 w-8 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ChatControls;