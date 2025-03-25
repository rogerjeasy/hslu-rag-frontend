"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Plus, 
  Settings, 
  BookOpen, 
  Copy, 
  Share2, 
  Trash2,
  Calendar
} from 'lucide-react';
import { Conversation } from '@/types/conversation';
import ModelSelector from './ModelSelector';
import { useRouter } from 'next/navigation';
import { useConversationStore } from '@/store/conversationStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/toast-provider';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  conversation: Conversation | null;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onNewChat: () => void;
  onSettings: () => void;
  onToggleSidebar: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  selectedModel,
  onSelectModel,
  onNewChat,
  onSettings,
  onToggleSidebar,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isDesktop, setIsDesktop] = useState(true);
  const [showFullTitle, setShowFullTitle] = useState(false);
  
  const { deleteConversation } = useConversationStore();

  // Set up media query on client side only
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handleResize = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleDelete = async () => {
    if (!conversation) return;
    
    if (confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteConversation(conversation.id);
        router.push('/chat');
        toast({
          title: "Success",
          description: "Conversation deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete conversation",
          variant: "destructive",
        });
        console.error("Error deleting conversation:", error);
      }
    }
  };

  const handleCopyLink = () => {
    if (!conversation) return;
    
    const url = `${window.location.origin}/chat/${conversation.id}`;
    navigator.clipboard.writeText(url);
    
    toast({
      title: "Link copied",
      description: "Conversation link copied to clipboard",
    });
  };

  const handleExport = () => {
    if (!conversation) return;
    
    // Format conversation as markdown
    const markdownContent = conversation.messages
      .map(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        return `## ${role}\n\n${msg.content}\n\n`;
      })
      .join('---\n\n');
    
    // Create and download file
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Conversation exported",
      description: "Conversation has been exported as Markdown",
    });
  };

  // Format the creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 sticky top-0 z-10 backdrop-blur-md backdrop-saturate-150">
      <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 min-w-0">
          {!isDesktop && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden rounded-full h-8 w-8 flex items-center justify-center text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          )}
          
          {conversation ? (
            <div 
              className="flex flex-col min-w-0"
              onClick={() => setShowFullTitle(!showFullTitle)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h1 className={cn(
                      "font-semibold transition-all duration-200 flex items-center gap-1",
                      showFullTitle ? "text-base sm:text-lg max-w-full" : "text-base sm:text-lg truncate max-w-[180px] xs:max-w-[200px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-[450px]"
                    )}>
                      <BookOpen className="h-4 w-4 mr-1 text-blue-500 flex-shrink-0" />
                      {conversation.title}
                    </h1>
                  </TooltipTrigger>
                  {!showFullTitle && (
                    <TooltipContent side="bottom">
                      {conversation.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="h-3 w-3 inline flex-shrink-0" />
                {formatDate(conversation.createdAt)}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center"
            >
              <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              <h1 className="text-lg font-semibold">New Conversation</h1>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <ModelSelector 
              selectedModel={selectedModel} 
              onSelectModel={onSelectModel} 
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onNewChat}
                  className="rounded-full h-8 w-8 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  asChild
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">New Chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {conversation && (
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="rounded-full h-8 w-8 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        asChild
                      >
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="h-5 w-5"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </motion.button>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Options</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-56 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2">
                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer flex items-center py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Copy className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport} className="cursor-pointer flex items-center py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Share2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Export Conversation</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="cursor-pointer flex items-center py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Delete Conversation</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onSettings}
                  className="rounded-full h-8 w-8 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  asChild
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="h-5 w-5" />
                  </motion.button>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;