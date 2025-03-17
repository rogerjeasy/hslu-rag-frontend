"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextareaAutosize from 'react-textarea-autosize';
import { ChatInputProps } from '@/types/chat';
import { cn } from '@/lib/utils';

export default function ChatInput({
  onSendMessage,
  isLoading,
  disabled
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check viewport size and focus the textarea
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkScreenSize();
    
    // Focus the textarea
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [disabled]);

  // Handle sending the message
  const handleSendMessage = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Refocus the textarea after sending
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // Handle Enter key to send message (with Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSendMessage();
    }
  };
  
  // Character counter color logic
  const getCounterColor = () => {
    if (message.length > 500) return "text-amber-500";
    if (message.length > 1000) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div className="relative w-full max-w-full transition-all duration-300">
      <div className={cn(
        "flex items-end border rounded-lg p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm transition-all duration-300",
        "hover:border-primary/20 shadow-sm",
        isFocused ? "border-primary/30 shadow-md ring-1 ring-primary/10" : "border-border",
        isLoading && "opacity-80"
      )}>
        {/* Message Input */}
        <TextareaAutosize
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={disabled 
            ? "Select a subject to start chatting..." 
            : isLoading 
              ? "Processing..." 
              : "Type your message..."}
          className={cn(
            "flex-1 resize-none border-0 bg-transparent py-2 px-2 sm:px-3",
            "focus:ring-0 focus:outline-none max-h-40 min-h-[2.5rem]",
            "text-sm placeholder:text-muted-foreground/70 transition-colors duration-200",
            "scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent",
            disabled && "cursor-not-allowed opacity-70"
          )}
          maxRows={isMobile ? 4 : 5}
          disabled={isLoading || disabled}
        />
       
        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pl-1.5 flex-shrink-0">
          {/* Attachment Button - Optional */}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={isLoading || disabled}
            title="Attach files"
            className={cn(
              "h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300",
              "hover:bg-primary/10 text-muted-foreground hover:text-primary"
            )}
          >
            <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Attach files</span>
          </Button>
         
          {/* Send Button */}
          <Button
            type="button"
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading || disabled}
            title="Send message"
            className={cn(
              "h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300",
              !message.trim() || isLoading || disabled 
                ? "opacity-70 bg-primary/70" 
                : "bg-primary hover:bg-primary/90 group overflow-hidden relative"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            ) : message.trim().length > 0 ? (
              <>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-shine" />
                <Send className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
              </>
            ) : (
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
     
      {/* Helper Text - Hide on very small screens or show compact version */}
      <div className={cn(
        "flex justify-between items-center text-[10px] sm:text-xs mt-1.5 transition-opacity duration-300",
        disabled && "opacity-0"
      )}>
        <div className="hidden xs:flex items-center">
          <span className="text-muted-foreground">Press <kbd className="bg-muted/50 px-1.5 py-0.5 rounded text-[10px] mx-1 border border-border/50">Enter</kbd> to send</span>
        </div>
        <div className="flex items-center gap-1">
          {message.length > 0 && (
            <Sparkles className={cn(
              "h-2.5 w-2.5 sm:h-3 sm:w-3",
              message.length > 0 ? "opacity-100" : "opacity-0",
              "transition-opacity duration-300",
              getCounterColor()
            )} />
          )}
          <span className={cn(
            "transition-colors duration-300 flex-shrink-0",
            getCounterColor()
          )}>
            {message.length} {!isMobile && "characters"}
          </span>
        </div>
      </div>
    </div>
  );
}