"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, Plus, Pin, Trash, PinOff, Loader2, MoreHorizontal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChatHistorySidebarProps, Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function ChatHistorySidebar({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onStartNewConversation,
  isLoading = false
}: ChatHistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Mount animation
    setMounted(true);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort conversations: pinned first, then by updated date
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    // Pinned conversations go first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then sort by most recent
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  
  // Pin/unpin a conversation
  const togglePin = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering conversation selection
    // In a real application, you would update this in your database
    console.log(`Toggle pin for conversation: ${conversationId}`);
  };
  
  // Delete a conversation
  const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering conversation selection
    // In a real application, you would remove this from your database
    console.log(`Delete conversation: ${conversationId}`);
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full w-full relative overflow-hidden transition-all duration-500 ease-in-out",
        "bg-gradient-to-b from-background to-background/95 backdrop-blur-sm",
        mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      )}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/3 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      
      {/* Header */}
      <div className="p-2 sm:p-4 border-b border-border/50 backdrop-blur-sm bg-background/50 relative z-10 transition-all duration-300">
        <h2 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2 transition-all duration-300 ease-out">
          <span>Conversation History</span>
          <Sparkles className="h-3.5 w-3.5 text-primary/70 animate-twinkle" />
        </h2>
        
        {/* Search */}
        <div className="relative transition-transform duration-300 hover:scale-[1.01]">
          {isLoading ? (
            <Loader2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
          )}
          <Input
            type="text"
            placeholder={isLoading ? "Loading..." : "Search conversations..."}
            className="pl-8 h-8 sm:h-9 text-xs sm:text-sm border-border/50 bg-background/70 focus:bg-background focus-visible:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        {/* New Chat Button */}
        <Button 
          className={cn(
            "w-full mt-3 sm:mt-4 gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm",
            "transition-all duration-300 ease-out hover:shadow-md",
            "bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90",
            "group overflow-hidden relative"
          )}
          onClick={onStartNewConversation}
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-shine" />
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:scale-110" />
          )}
          <span className="relative z-10">New Conversation</span>
        </Button>
      </div>
      
      {/* Conversation List */}
      <ScrollArea className="flex-1 w-full relative z-10">
        {isLoading && sortedConversations.length === 0 ? (
          <div className="p-4 sm:p-6 flex flex-col items-center justify-center text-center text-muted-foreground">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 mb-2 animate-spin" />
            <p className="text-xs sm:text-sm">Loading conversations...</p>
          </div>
        ) : sortedConversations.length > 0 ? (
          <div className="p-1 sm:p-2">
            {sortedConversations.map((conversation, index) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === currentConversationId}
                onSelect={() => onSelectConversation(conversation.id)}
                onTogglePin={togglePin}
                onDelete={deleteConversation}
                isLoading={isLoading}
                isMobile={isMobile}
                index={index}
              />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="p-3 sm:p-4 text-center text-muted-foreground text-xs sm:text-sm animate-fadeIn">
            No conversations matching "{searchQuery}"
          </div>
        ) : (
          <div className="p-3 sm:p-4 text-center text-muted-foreground text-xs sm:text-sm animate-fadeIn">
            No conversation history
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  isLoading?: boolean;
  isMobile?: boolean;
  index?: number;
}

function ConversationItem({ 
  conversation, 
  isActive, 
  onSelect, 
  onTogglePin, 
  onDelete,
  isLoading = false,
  isMobile = false,
  index = 0
}: ConversationItemProps) {
  // Format the date for display
  const formattedDate = format(new Date(conversation.updatedAt), 'MMM d, yyyy');
  
  return (
    <div
      className={cn(
        "flex flex-col p-2 sm:p-3 rounded-md mb-1.5 cursor-pointer group transition-all duration-300 ease-out",
        "backdrop-blur-sm border border-transparent hover:border-border/40",
        "transform transition-all duration-300 animate-fadeIn",
        {"animate-slideIn": !isLoading},
        {"delay-100": index === 0},
        {"delay-150": index === 1},
        {"delay-200": index === 2},
        {"delay-250": index > 2},
        isActive ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-background/80",
        isLoading && "opacity-70 pointer-events-none"
      )}
      style={{
        animationDelay: `${Math.min(index * 50, 300)}ms`
      }}
      onClick={isLoading ? undefined : onSelect}
    >
      <div className="flex justify-between items-start gap-1">
        {/* Conversation title & subject */}
        <div className="flex-1 min-w-0 max-w-full">
          <div className="font-medium text-xs sm:text-sm truncate group-hover:text-primary/90 transition-colors duration-300">
            {conversation.title}
            {isActive && isLoading && (
              <span className="inline-flex ml-1 sm:ml-2">
                <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin text-muted-foreground" />
              </span>
            )}
          </div>
          {conversation.subject && (
            <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
              {conversation.subject.icon && (
                <span className="flex-shrink-0 group-hover:animate-bounce-subtle">{conversation.subject.icon}</span>
              )}
              <span className="truncate transition-colors duration-300 group-hover:text-muted-foreground/80">{conversation.subject.name}</span>
            </div>
          )}
        </div>
        
        {/* Actions (pin/delete) - Dropdown on mobile */}
        {isMobile ? (
          <div className={cn(
            "flex-shrink-0 transition-opacity duration-300",
            isLoading ? "opacity-0" : ""
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-primary/10"
                  disabled={isLoading}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 animate-fadeIn bg-background/95 backdrop-blur-md border-border/50">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(conversation.id, e as any);
                }}
                className="transition-colors duration-200 focus:bg-primary/10 focus:text-primary"
                >
                  {conversation.pinned ? (
                    <>
                      <PinOff className="h-3.5 w-3.5 mr-2" />
                      <span>Unpin</span>
                    </>
                  ) : (
                    <>
                      <Pin className="h-3.5 w-3.5 mr-2" />
                      <span>Pin</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conversation.id, e as any);
                  }}
                >
                  <Trash className="h-3.5 w-3.5 mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className={cn(
            "flex items-center gap-1 transition-all duration-300 flex-shrink-0",
            isLoading ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          )}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/10"
              onClick={(e) => onTogglePin(conversation.id, e)}
              title={conversation.pinned ? "Unpin conversation" : "Pin conversation"}
              disabled={isLoading}
            >
              {conversation.pinned ? (
                <PinOff className="h-3.5 w-3.5 transition-transform duration-300 hover:scale-110" />
              ) : (
                <Pin className="h-3.5 w-3.5 transition-transform duration-300 hover:scale-110" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive transition-all duration-300 hover:bg-destructive/10"
              onClick={(e) => onDelete(conversation.id, e)}
              title="Delete conversation"
              disabled={isLoading}
            >
              <Trash className="h-3.5 w-3.5 transition-transform duration-300 hover:scale-110" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Date & AI model */}
      <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs text-muted-foreground">
        <span className="truncate transition-colors duration-300 group-hover:text-muted-foreground/80">{formattedDate}</span>
        {conversation.model && (
          <span className="bg-primary/5 px-1.5 py-0.5 rounded text-[10px] sm:text-xs truncate ml-1 flex-shrink-0 transition-all duration-300 group-hover:bg-primary/10">
            {conversation.model.name}
          </span>
        )}
      </div>
      
      {/* Shine effect for pinned conversations */}
      {conversation.pinned && (
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 rounded-l-md animate-pulse-slow"></div>
      )}
    </div>
  );
}