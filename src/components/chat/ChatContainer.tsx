// src/components/chat/ChatContainer.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useConversationStore } from '@/store/conversationStore';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Sparkles,
  Search,
  PanelLeft,
  GraduationCap,
  Brain,
  BookOpen
} from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import ChatHistorySidebar from './ChatHistorySidebar';
import SubjectSelector from './SubjectSelector';
import ChatSettings from './ChatSettings';
import ChatMainLayout from './ChatMainLayout';
import { QueryType, AdditionalParams } from '@/types/query';
import { 
  Sheet, 
  SheetContent, 
  SheetTitle
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/toast-provider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ChatContainer: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4");
  const [queryType, setQueryType] = useState<QueryType>(QueryType.QUESTION_ANSWERING);
  const [additionalParams, setAdditionalParams] = useState<AdditionalParams>({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // Default to true
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Conversation store
  const { 
    currentConversation,
    getConversation,
    createConversation,
    sendMessage,
    setCurrentConversation
  } = useConversationStore();

  // References
  const messageEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Setup media query on client side only
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handleResize = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    
    // Clean up listener on component unmount
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Handle conversation ID from URL
  useEffect(() => {
    if (!params) return;
    
    const conversationId = params?.id as string; 
    
    if (conversationId && (!currentConversation || currentConversation.id !== conversationId)) {
      const fetchConversation = async () => {
        try {
          setIsLoading(true);
          await getConversation(conversationId);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load conversation",
            variant: "destructive",
          });
          console.error("Error loading conversation:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchConversation();
    }
  }, [params, currentConversation, getConversation, toast]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);

  // Set scroll shadow effect on list scroll and show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setIsScrolled(scrollTop > 10);
        
        // Show scroll button if we've scrolled up significantly
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        setShowScrollButton(distanceFromBottom > 300);
      }
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
      return () => currentContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handlers
  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    
    if (!currentConversation) {
      try {
        setIsLoading(true);
        const newConversation = await createConversation({
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          courseId: selectedCourse || '',
          initialMessage: content
        });
        
        if (newConversation.id) {
          router.push(`/chat/${newConversation.id}`);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create new conversation",
          variant: "destructive",
        });
        console.error("Error creating conversation:", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      await sendMessage(
        currentConversation.id,
        content,
        queryType,
        additionalParams
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentConversation(null);
    router.push('/chat');
  };

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };

  // Get query type icon
  const getQueryTypeIcon = (type: QueryType) => {
    switch(type) {
      case QueryType.QUESTION_ANSWERING:
        return <Search className="h-5 w-5 text-blue-500" />;
      case QueryType.STUDY_GUIDE:
        return <BookOpen className="h-5 w-5 text-emerald-500" />;
      case QueryType.PRACTICE_QUESTIONS:
        return <GraduationCap className="h-5 w-5 text-amber-500" />;
      case QueryType.KNOWLEDGE_GAP:
        return <Brain className="h-5 w-5 text-violet-500" />;
      default:
        return <Search className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 h-full hidden md:flex flex-col">
          <ChatHistorySidebar 
            selectedCourse={selectedCourse}
            onSelectCourse={setSelectedCourse}
          />
        </div>
      )}
      
      {/* Mobile Sidebar */}
      {!isDesktop && (
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="w-full sm:w-[350px] p-0 overflow-hidden">
            <SheetTitle className="sr-only">Chat History</SheetTitle>
            <div className="h-full flex flex-col">
              <ChatHistorySidebar 
                selectedCourse={selectedCourse}
                onSelectCourse={(course) => {
                  setSelectedCourse(course);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <ChatHeader 
          conversation={currentConversation}
          onNewChat={handleNewChat}
          onSettings={handleSettingsToggle}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />

        {/* Query type badge - shown when in conversation */}
        {currentConversation && queryType && (
          <div className="absolute top-16 right-4 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm py-1 px-2 flex items-center gap-1 shadow-sm">
                    {getQueryTypeIcon(queryType)}
                    <span className="hidden sm:inline">
                      {queryType === QueryType.QUESTION_ANSWERING ? "Q&A" : 
                       queryType === QueryType.STUDY_GUIDE ? "Study Guide" :
                       queryType === QueryType.PRACTICE_QUESTIONS ? "Practice" : 
                       "Knowledge Gap"}
                    </span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {queryType === QueryType.QUESTION_ANSWERING ? "Question Answering Mode" : 
                   queryType === QueryType.STUDY_GUIDE ? "Study Guide Generation Mode" :
                   queryType === QueryType.PRACTICE_QUESTIONS ? "Practice Questions Mode" : 
                   "Knowledge Gap Analysis Mode"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <div 
          ref={containerRef}
          className={cn(
            "flex-1 overflow-y-auto px-4 py-2 sm:px-6 relative",
            isScrolled ? "shadow-[inset_0_8px_8px_-8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_8px_8px_-8px_rgba(0,0,0,0.3)]" : ""
          )}
        >
          {!currentConversation ? (
            <ChatMainLayout maxWidth="2xl">
              <div className="h-full flex flex-col items-center justify-center w-full px-4 py-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="text-center mb-12">
                    <div className="bg-blue-100 dark:bg-blue-900/30 inline-flex items-center justify-center p-3 rounded-full mb-3">
                      <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">HSLU Data Science Assistant</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto text-lg">
                      Get course-specific answers, generate study guides, and practice with questions based on your materials.
                    </p>
                  </div>
                  
                  <div className="max-w-lg mx-auto mb-12">
                    <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Select your course</CardTitle>
                        <CardDescription>Choose a course to personalize your experience</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SubjectSelector 
                          selectedCourse={selectedCourse}
                          onSelectCourse={setSelectedCourse}
                          className="mb-0"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </ChatMainLayout>
          ) : (
            <ChatMainLayout maxWidth="2xl">
              <ChatMessageList 
                messages={currentConversation.messages} 
                isLoading={isLoading}
              />
            
              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="sticky bottom-4 w-full flex justify-center"
                  >
                    <Button
                      onClick={scrollToBottom}
                      size="sm"
                      className="rounded-full py-1 px-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md"
                    >
                      <ArrowLeft className="h-4 w-4 rotate-90 mr-1" />
                      <span>New messages</span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messageEndRef} />
            </ChatMainLayout>
          )}
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
          <ChatMainLayout maxWidth="2xl">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              disabled={!selectedCourse && !currentConversation}
              placeholder={
                !selectedCourse && !currentConversation 
                  ? "Please select a course first" 
                  : `Type your ${
                      queryType === QueryType.QUESTION_ANSWERING ? "question" :
                      queryType === QueryType.STUDY_GUIDE ? "topic for study guide" :
                      queryType === QueryType.PRACTICE_QUESTIONS ? "topic for practice questions" :
                      "knowledge gap concerns"
                    }...`
              }
            />
            {!selectedCourse && !currentConversation && (
              <div className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <PanelLeft className="h-3 w-3" />
                <span>Select a course from the sidebar to start chatting</span>
              </div>
            )}
          </ChatMainLayout>
        </div>
      </div>
      
      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="w-80 border-l border-slate-200 dark:border-slate-800 h-full hidden md:block">
          <ChatSettings 
            queryType={queryType}
            onQueryTypeChange={setQueryType}
            additionalParams={additionalParams}
            onAdditionalParamsChange={setAdditionalParams}
            onClose={handleSettingsToggle}
          />
        </div>
      )}
      
      {/* Mobile Settings Panel */}
      {!isDesktop && isSettingsOpen && (
        <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <SheetContent side="right" className="w-full sm:w-[350px] p-0 overflow-hidden">
            <SheetTitle className="sr-only">Chat Settings</SheetTitle>
            <ChatSettings
              queryType={queryType}
              onQueryTypeChange={setQueryType}
              additionalParams={additionalParams}
              onAdditionalParamsChange={setAdditionalParams}
              onClose={() => setIsSettingsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ChatContainer;