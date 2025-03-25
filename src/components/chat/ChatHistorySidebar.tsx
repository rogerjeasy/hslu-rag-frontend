"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MessageCircle, Pin, Trash, X, RefreshCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useConversationStore } from '@/store/conversationStore';
import { ExtendedConversationSummary } from '@/types/conversation';
import { formatDistanceToNow } from 'date-fns';
import { QueryType } from '@/types/query';

interface ChatHistorySidebarProps {
  onSelectConversation?: () => void;
  currentCourseId?: string;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ 
  onSelectConversation,
  currentCourseId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    conversations, 
    filteredConversations,
    fetchConversations, 
    setSearchTerm: setStoreSearchTerm, 
    createConversation,
    getConversation,
    deleteConversation,
    updateConversation,
    setCurrentConversation,
    currentConversation,
    isLoading
  } = useConversationStore();
  
  useEffect(() => {
    fetchConversations(currentCourseId);
  }, [fetchConversations, currentCourseId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setStoreSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStoreSearchTerm('');
  };

  const startNewConversation = async () => {
    // Clear the current conversation to show empty state
    setCurrentConversation(null);
    
    if (onSelectConversation) {
      onSelectConversation();
    }
  };

  const selectConversation = async (id: string) => {
    try {
      await getConversation(id);
      
      if (onSelectConversation) {
        onSelectConversation();
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const togglePin = async (conversation: ExtendedConversationSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateConversation(conversation.id, { 
        pinned: !conversation.pinned 
      });
    } catch (error) {
      console.error("Failed to update conversation:", error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      
      // If we deleted the current conversation, clear it
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  // Group conversations by date (today, yesterday, this week, this month, older)
  const groupConversationsByDate = (conversations: ExtendedConversationSummary[]) => {
    const groups: { [key: string]: ExtendedConversationSummary[] } = {
      'Pinned': [],
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'This Month': [],
      'Older': []
    };

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    conversations.forEach(conversation => {
      const date = new Date(conversation.updatedAt);
      
      // Always add pinned conversations to the pinned group
      if (conversation.pinned) {
        groups['Pinned'].push(conversation);
        return;
      }
      
      if (date.toDateString() === now.toDateString()) {
        groups['Today'].push(conversation);
      } else if (date.toDateString() === yesterday.toDateString()) {
        groups['Yesterday'].push(conversation);
      } else if (date > lastWeek) {
        groups['This Week'].push(conversation);
      } else if (date > lastMonth) {
        groups['This Month'].push(conversation);
      } else {
        groups['Older'].push(conversation);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  };

  const groupedConversations = groupConversationsByDate(filteredConversations);

  // Helper to get appropriate icon for query type
  const getQueryTypeIcon = (queryType?: QueryType) => {
    switch (queryType) {
      case QueryType.STUDY_GUIDE:
        return '📚';
      case QueryType.PRACTICE_QUESTIONS:
        return '📝';
      case QueryType.KNOWLEDGE_GAP:
        return '🧠';
      default:
        return '💬';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium mb-4">Conversations</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9 pr-9 h-9"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* New Conversation Button */}
        <Button 
          onClick={startNewConversation} 
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto pb-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          Object.entries(groupedConversations).map(([group, conversations]) => (
            <div key={group} className="mt-4">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-4 mb-1">
                {group}
              </h3>
              <ul>
                {conversations.map(conversation => (
                  <li key={conversation.id} className="px-2">
                    <div 
                      onClick={() => selectConversation(conversation.id)}
                      className={`flex items-start p-2 rounded-md cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        currentConversation?.id === conversation.id 
                          ? 'bg-gray-200 dark:bg-gray-700' 
                          : ''
                      }`}
                    >
                      <div className="mr-3 mt-1">
                        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                          {getQueryTypeIcon(conversation.queryType)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium truncate max-w-[140px]">
                            {conversation.title}
                          </h4>
                          <div className="flex items-center space-x-1 ml-1 flex-shrink-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => togglePin(conversation, e)}
                                    className={`h-6 w-6 ${
                                      conversation.pinned
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
                                    }`}
                                  >
                                    <Pin size={14} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{conversation.pinned ? 'Unpin' : 'Pin'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleDelete(conversation.id, e)}
                                    className="h-6 w-6 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {conversation.lastMessagePreview || 'No messages yet'}
                        </p>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistorySidebar;