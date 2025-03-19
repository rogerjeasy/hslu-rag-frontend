"use client";

import { Plus, Trash2, Download, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Chat Controls Props
export interface ChatControlsProps {
  onStartNewConversation: () => void;
  onClearConversation: () => void;
  hasActiveConversation: boolean;
  isLoading?: boolean;
  isMobile?: boolean;
}

export default function ChatControls({
  onStartNewConversation,
  onClearConversation,
  hasActiveConversation,
  isLoading = false,
  isMobile = false
}: ChatControlsProps) {
  // Function to export conversation as a text file
  const exportConversation = () => {
    // This would normally retrieve current chat from state or context
    // and generate a file for download
    console.log(isMobile ? 'Export chat' : 'Export conversation');
    console.log('Export conversation');
  };

  // Function to save conversation to favorites
  const saveToFavorites = () => {
    // This would normally mark the current conversation as favorited in your database
    console.log('Save to favorites');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={onStartNewConversation}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New Chat
        </Button>
       
        {hasActiveConversation && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-destructive hover:text-destructive"
            onClick={onClearConversation}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Clear Chat
          </Button>
        )}
      </div>
     
      {hasActiveConversation && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={saveToFavorites}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Save</span>
          </Button>
         
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={exportConversation}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      )}
    </div>
  );
}