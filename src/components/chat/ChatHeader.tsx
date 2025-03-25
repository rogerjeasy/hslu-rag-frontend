"use client";

import React, { useState } from 'react';
import { Clock, Settings, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/conversation';
import SubjectSelector from './SubjectSelector';
import ModelSelector from './ModelSelector';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useConversationStore } from '@/store/conversationStore';

interface ChatHeaderProps {
  conversation?: Conversation | null;
  courseId?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation?.title || 'New Conversation');
  const { updateConversation } = useConversationStore();

  const handleTitleUpdate = () => {
    if (conversation && title.trim() !== conversation.title) {
      updateConversation(conversation.id, { title });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(conversation?.title || 'New Conversation');
    }
  };

  // Format the creation time elegantly
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    const date = new Date(timeString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between sticky top-0 z-10">
      <div className="ml-8 lg:ml-0 flex-1 flex flex-col min-w-0">
        {isEditing ? (
          <div className="flex items-center w-full max-w-md">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleUpdate}
              onKeyDown={handleKeyDown}
              autoFocus
              className="font-medium text-base sm:text-lg"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-base sm:text-lg truncate max-w-xs sm:max-w-sm">
              {conversation?.title || 'New Conversation'}
            </h2>
            {conversation && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Edit2 size={14} />
              </Button>
            )}
          </div>
        )}
        
        {conversation && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
            <Clock size={12} />
            <span>{formatTime(conversation.createdAt)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end">
        <SubjectSelector courseId={courseId} />
        <ModelSelector />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Settings size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Dark Mode</DropdownMenuItem>
            <DropdownMenuItem>Font Size</DropdownMenuItem>
            <DropdownMenuItem>Citations Format</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;