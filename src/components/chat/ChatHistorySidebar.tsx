"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConversationStore } from '@/store/conversationStore';
import { useEnhancedConversationStore } from '@/store/enhancedConversationStore';
import { useRouter, usePathname } from 'next/navigation';
import { ExtendedConversationSummary, QueryType } from '@/types/extended-conversation.types';
import SubjectSelector from './SubjectSelector';
import { Plus, Search, MessageSquare, Trash2, Pin, BookOpen, PenSquare, Loader2, MoreVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";

interface ChatHistorySidebarProps {
  selectedCourse: string | null;
  onSelectCourse: (courseId: string | null) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  selectedCourse,
  onSelectCourse,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('all');
  const [isClient, setIsClient] = useState(false);
  
  // Base conversation store for data operations
  const {
    fetchConversations,
    deleteConversation,
    isLoading,
    error,
  } = useConversationStore();
  
  // Enhanced store for UI operations
  const {
    searchTerm,
    setSearchTerm,
    setSelectedCourse,
    togglePinConversation,
    filteredConversations
  } = useEnhancedConversationStore();

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync with parent component's selected course
  useEffect(() => {
    setSelectedCourse(selectedCourse);
  }, [selectedCourse, setSelectedCourse]);

  // Fetch conversations when component mounts
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleNewChat = () => {
    router.push('/chat');
  };

  const openConversation = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation(id);
    }
  };

  const handleTogglePin = async (e: React.MouseEvent, conversation: ExtendedConversationSummary) => {
    e.stopPropagation();
    await togglePinConversation(conversation.id);
  };

  const filterConversationsByTab = (conversations: ExtendedConversationSummary[]) => {
    switch (activeTab) {
      case 'pinned':
        return conversations.filter(c => c.pinned);
      case 'qa':
        return conversations.filter(c => 
          !c.queryType || c.queryType === QueryType.QUESTION_ANSWERING
        );
      case 'study':
        return conversations.filter(c => 
          c.queryType === QueryType.STUDY_GUIDE || 
          c.queryType === QueryType.KNOWLEDGE_GAP
        );
      case 'practice':
        return conversations.filter(c => c.queryType === QueryType.PRACTICE_QUESTIONS);
      default:
        return conversations;
    }
  };

  // Memoize "today" to ensure consistent rendering between server and client
  const today = React.useMemo(() => new Date().toDateString(), []);

  const filteredByTab = isClient ? filterConversationsByTab(filteredConversations) : [];

  // Format the date to display
  const formatDate = (timestamp: number) => {
    if (!isClient) return '';
    
    const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Group conversations by date
  const groupedConversations = React.useMemo(() => {
    if (!isClient) return {};
    
    return filteredByTab.reduce<Record<string, ExtendedConversationSummary[]>>(
      (groups, conversation) => {
        const date = new Date(conversation.updatedAt * 1000); // Convert timestamp to milliseconds
        const dateStr = date.toDateString();
        
        if (!groups[dateStr]) {
          groups[dateStr] = [];
        }
        
        groups[dateStr].push(conversation);
        return groups;
      },
      {}
    );
  }, [filteredByTab, isClient]);

  // Sort dates newest first
  const sortedDates = React.useMemo(() => {
    if (!isClient) return [];
    
    return Object.keys(groupedConversations).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedConversations, isClient]);

  // Function to render the appropriate icon based on query type
  const renderQueryTypeIcon = (queryType?: QueryType) => {
    switch (queryType) {
      case QueryType.QUESTION_ANSWERING:
        return <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-blue-500" />;
      case QueryType.STUDY_GUIDE:
        return <BookOpen className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />;
      case QueryType.PRACTICE_QUESTIONS:
        return <PenSquare className="h-3.5 w-3.5 mr-1.5 text-amber-500" />;
      case QueryType.KNOWLEDGE_GAP:
        return <PenSquare className="h-3.5 w-3.5 mr-1.5 text-violet-500" />;
      default:
        return <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-blue-500" />;
    }
  };

  // Check if conversation is active based on the current path
  const isActive = (conversationId: string) => {
    return pathname === `/chat/${conversationId}`;
  };

  // Render a conversation item
  const renderConversationItem = (conversation: ExtendedConversationSummary) => (
    <motion.div
      key={conversation.id}
      initial={{ opacity: 0.8, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => openConversation(conversation.id)}
      className={cn(
        "p-3 cursor-pointer rounded-lg transition-all duration-200 mb-2",
        "hover:bg-slate-200/80 dark:hover:bg-slate-800/80 group",
        "border-l-2 border-transparent",
        isActive(conversation.id) && "bg-slate-200/80 dark:bg-slate-800/80 border-l-2 border-blue-500 shadow-sm"
      )}
    >
      <div className="flex justify-between items-start gap-2 mb-1">
        <div className="flex items-center min-w-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 mr-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePin(e as unknown as React.MouseEvent, conversation);
                }}
                className="cursor-pointer"
              >
                <Pin className={cn(
                  "h-4 w-4 mr-2 transition-all duration-200",
                  conversation.pinned
                    ? "fill-amber-500 text-amber-500"
                    : "text-slate-400"
                )} />
                {conversation.pinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation(e as unknown as React.MouseEvent, conversation.id);
                }}
                className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {renderQueryTypeIcon(conversation.queryType)}
          <h3 className="text-sm font-medium truncate max-w-[150px] sm:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px]">
            {conversation.title}
          </h3>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 dark:text-slate-400 truncate ml-7">
        {conversation.lastMessagePreview || 'No messages'}
      </p>
      
      <div className="flex justify-between items-center mt-2 ml-7">
        {conversation.courseId && (
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-slate-100 dark:bg-slate-800 truncate max-w-[120px]">
            {conversation.courseId}
          </Badge>
        )}
        <span className="text-xs text-slate-400 ml-auto">
          {formatDate(conversation.updatedAt)}
        </span>
      </div>
    </motion.div>
  );
  
  // Render content for a specific tab
  const renderTabContent = (tabValue: string) => (
    <TabsContent value={tabValue} className="mt-2 p-0 overflow-hidden">
      {!isClient ? (
        <div className="p-4 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : isLoading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400"
        >
          <Loader2 className="h-8 w-8 animate-spin mb-2 text-blue-500" />
          <p className="text-sm">Loading conversations...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 text-center text-red-500 bg-red-100/50 dark:bg-red-900/20 rounded-lg"
        >
          Error loading conversations: {error}
        </motion.div>
      ) : filteredByTab.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 text-center text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg"
        >
          {searchTerm
            ? 'No conversations found for your search'
            : tabValue === 'pinned' 
              ? 'No pinned conversations' 
              : 'No conversations yet'}
        </motion.div>
      ) : (
        <div className="py-2 px-1">
          {sortedDates.map(dateStr => (
            <div key={dateStr} className="mb-2">
              <div className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 sticky top-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm z-10 rounded-md">
                {dateStr === today
                  ? 'Today'
                  : new Date(dateStr).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
              </div>
              
              {groupedConversations[dateStr]?.map(renderConversationItem)}
              <Separator className="my-2 opacity-30" />
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );

  // Render initial loading state or full component
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Chat History</h2>
        
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleNewChat}
            className="w-full mb-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium shadow-sm transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" /> New Conversation
          </Button>
        </motion.div>
        
        <SubjectSelector
          selectedCourse={selectedCourse}
          onSelectCourse={onSelectCourse}
          className="mb-4"
        />
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-2 pt-2 border-b border-slate-200 dark:border-slate-800">
          <TabsList className="w-full flex overflow-x-auto hide-scrollbar justify-start bg-slate-100 dark:bg-slate-800/50 p-0.5 rounded-lg">
            <TabsTrigger 
              value="all" 
              className="text-sm flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="pinned" 
              className="text-sm flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Pinned
            </TabsTrigger>
            <TabsTrigger 
              value="qa" 
              className="text-sm flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Q&A
            </TabsTrigger>
            <TabsTrigger 
              value="study" 
              className="text-sm flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Study
            </TabsTrigger>
            <TabsTrigger 
              value="practice" 
              className="text-sm flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Practice
            </TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1 px-2 py-1 overflow-y-auto">
          {renderTabContent('all')}
          {renderTabContent('pinned')}
          {renderTabContent('qa')}
          {renderTabContent('study')}
          {renderTabContent('practice')}
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ChatHistorySidebar;