"use client";

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatMessage from './ChatMessage';
import { Message } from '@/types/conversation';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement> | null;
}

export default function ChatMessageList({
  messages,
  isLoading,
  messagesEndRef
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted for animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect scroll position to show/hide scroll button
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom);
    
    // Only auto-scroll if user is already near the bottom
    if (isNearBottom) {
      setAutoScrollEnabled(true);
    } else {
      setAutoScrollEnabled(false);
    }
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (containerRef.current && autoScrollEnabled) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, autoScrollEnabled]);

  // Scroll to bottom manually when button is clicked
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setAutoScrollEnabled(true);
    }
  };

  return (
    <div 
      className="relative h-full flex flex-col" 
      style={{ opacity: mounted ? 1 : 0, transition: 'opacity 300ms ease-in-out' }}
    >
      {/* Empty state if no messages */}
      {messages.length === 0 && !isLoading && (
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div className="max-w-md space-y-4">
            <div className="bg-muted/50 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Your conversation will appear here</h3>
            <p className="text-muted-foreground">
              Begin by typing a message or question in the input field below
            </p>
          </div>
        </div>
      )}

      {/* Message container with scroll */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent scrollbar-thumb-rounded-full"
        onScroll={handleScroll}
      >
        <div className="flex flex-col min-h-full justify-end">
          <div className="flex flex-col">
            {/* Time separator for longer conversations */}
            {messages.length > 0 && (
              <div className="sticky top-0 z-10 flex justify-center py-2 bg-gradient-to-b from-background via-background to-transparent">
                <span className="text-xs text-muted-foreground bg-muted/80 px-3 py-1 rounded-full shadow-sm">
                  Today
                </span>
              </div>
            )}

            {/* Message list with animation */}
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id || `message-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <ChatMessage
                    message={message}
                    isLatestMessage={index === messages.length - 1}
                    showTimestamp={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator for when AI is responding */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-6"
              >
                <div className="mx-auto max-w-3xl flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex gap-2 items-center">
                      <span className="font-semibold text-sm md:text-base">AI Assistant</span>
                      <span className="text-xs text-muted-foreground animate-pulse">Thinking...</span>
                    </div>
                    <div className="h-5 w-4/5 bg-muted/50 rounded-md animate-pulse"></div>
                    <div className="h-5 w-2/3 bg-muted/50 rounded-md animate-pulse"></div>
                    <div className="h-5 w-3/4 bg-muted/50 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-6 right-6 z-10"
          >
            <Button
              onClick={scrollToBottom}
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg w-10 h-10 bg-primary/90 text-primary-foreground hover:bg-primary hover:scale-105 transition-all"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}