"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, Plus, Pin, Trash, PinOff, Loader2, MoreHorizontal, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  // DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useConversationStore } from '@/store/conversationStore';
import { ExtendedConversationSummary } from '@/types/conversation';
import { QueryType } from '@/types/query';

interface ChatHistorySidebarProps {
  conversations: ExtendedConversationSummary[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onStartNewConversation: () => void;
  isLoading?: boolean;
}

export default function ChatHistorySidebar({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onStartNewConversation,
  isLoading = false
}: ChatHistorySidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get the conversation store
  const conversationStore = useConversationStore();
  
  // Extract state from the store
  const { 
    searchTerm, 
    setSearchTerm, 
    selectedQueryType, 
    setSelectedQueryType,
    resetFilters 
  } = conversationStore;
  
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
  
  // Sort conversations: pinned first, then by updated date
  const sortedConversations = [...conversations].sort((a, b) => {
    // Pinned conversations go first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then sort by most recent
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  
  // Pin/unpin a conversation
  const togglePin = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const currentState = conversations.find(conv => conv.id === conversationId);
    
    if (currentState) {
      conversationStore.updateConversation(conversationId, { 
        pinned: !currentState.pinned 
      });
    }
  };
  
  // Delete a conversation
  const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (conversationId) {
      conversationStore.deleteConversation(conversationId);
    }
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle query type filter
  const handleQueryTypeFilter = (queryType: QueryType | null) => {
    setSelectedQueryType(queryType);
    setShowFilters(false);
  };

  // Toggle filters view
  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
        
        <div className="flex items-center gap-2 mb-3">
          {/* Search */}
          <div className="relative transition-transform duration-300 hover:scale-[1.01] flex-1">
            {isLoading ? (
              <Loader2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
            )}
            <Input
              type="text"
              placeholder={isLoading ? "Loading..." : "Search conversations..."}
              className="pl-8 h-8 sm:h-9 text-xs sm:text-sm border-border/50 bg-background/70 focus:bg-background focus-visible:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={isLoading}
            />
          </div>
          
          {/* Filter button */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleFilters}
            disabled={isLoading}
            className={cn(
              "h-8 w-8 sm:h-9 sm:w-9 border-border/50 transition-all duration-300",
              selectedQueryType ? "bg-primary/10 text-primary" : "bg-background/70 text-muted-foreground"
            )}
          >
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="sr-only">Filter conversations</span>
          </Button>
        </div>
        
        {/* Filter dropdown */}
        {showFilters && (
          <div className="mb-3 p-3 rounded-md border border-border/50 bg-background/70 shadow-md animate-fadeIn text-xs">
            <div className="font-medium mb-2">Filter by type:</div>
            <div className="space-y-1">
              <div 
                onClick={() => handleQueryTypeFilter(null)} 
                className={cn(
                  "p-1.5 rounded cursor-pointer flex items-center",
                  !selectedQueryType ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted transition-colors duration-200"
                )}
              >
                All conversations
              </div>
              <div 
                onClick={() => handleQueryTypeFilter(QueryType.QUESTION_ANSWERING)} 
                className={cn(
                  "p-1.5 rounded cursor-pointer flex items-center",
                  selectedQueryType === QueryType.QUESTION_ANSWERING ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted transition-colors duration-200"
                )}
              >
                Q&A
              </div>
              <div 
                onClick={() => handleQueryTypeFilter(QueryType.STUDY_GUIDE)} 
                className={cn(
                  "p-1.5 rounded cursor-pointer flex items-center",
                  selectedQueryType === QueryType.STUDY_GUIDE ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted transition-colors duration-200"
                )}
              >
                Study Guides
              </div>
              <div 
                onClick={() => handleQueryTypeFilter(QueryType.PRACTICE_QUESTIONS)} 
                className={cn(
                  "p-1.5 rounded cursor-pointer flex items-center",
                  selectedQueryType === QueryType.PRACTICE_QUESTIONS ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted transition-colors duration-200"
                )}
              >
                Practice Questions
              </div>
              <div 
                onClick={() => handleQueryTypeFilter(QueryType.KNOWLEDGE_GAP)} 
                className={cn(
                  "p-1.5 rounded cursor-pointer flex items-center",
                  selectedQueryType === QueryType.KNOWLEDGE_GAP ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted transition-colors duration-200"
                )}
              >
                Knowledge Gap Analysis
              </div>
              
              {(searchTerm || selectedQueryType) && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    resetFilters();
                    setShowFilters(false);
                  }}
                  className="w-full h-7 mt-1 text-xs"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        )}
        
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
        ) : searchTerm ? (
          <div className="p-3 sm:p-4 text-center text-muted-foreground text-xs sm:text-sm animate-fadeIn">
            No conversations matching &quot;{searchTerm}&quot;
          </div>
        ) : selectedQueryType ? (
          <div className="p-3 sm:p-4 text-center text-muted-foreground text-xs sm:text-sm animate-fadeIn">
            No {getQueryTypeName(selectedQueryType)} conversations found
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

// Helper function to get the friendly name of a query type
function getQueryTypeName(queryType: QueryType): string {
  switch (queryType) {
    case QueryType.QUESTION_ANSWERING:
      return 'Q&A';
    case QueryType.STUDY_GUIDE:
      return 'Study Guide';
    case QueryType.PRACTICE_QUESTIONS:
      return 'Practice Questions';
    case QueryType.KNOWLEDGE_GAP:
      return 'Knowledge Gap Analysis';
    default:
      return '';
  }
}

interface ConversationItemProps {
  conversation: ExtendedConversationSummary;
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
        {/* Conversation title & course */}
        <div className="flex-1 min-w-0 max-w-full">
          <div className="font-medium text-xs sm:text-sm truncate group-hover:text-primary/90 transition-colors duration-300">
            {conversation.title}
            {isActive && isLoading && (
              <span className="inline-flex ml-1 sm:ml-2">
                <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin text-muted-foreground" />
              </span>
            )}
          </div>
          {conversation.queryType && (
            <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
              <span className="truncate transition-colors duration-300 group-hover:text-muted-foreground/80">
                {getQueryTypeName(conversation.queryType)}
              </span>
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
              <DropdownMenuItem onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  onTogglePin(conversation.id, e);
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
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    onDelete(conversation.id, e);
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
      
      {/* Date & Message preview */}
      <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs text-muted-foreground">
        <span className="truncate transition-colors duration-300 group-hover:text-muted-foreground/80">{formattedDate}</span>
        {conversation.lastMessagePreview && (
          <span className="truncate ml-1 max-w-[60%]" title={conversation.lastMessagePreview}>
            {conversation.lastMessagePreview.substring(0, 20)}...
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