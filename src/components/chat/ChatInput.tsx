"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Loader2, 
  Paperclip, 
  Image, 
  File, 
  Mic, 
  X, 
  Smile, 
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
  placeholder = "Type your message here..."
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize the textarea as the user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
   
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
   
    // Calculate the new height (with a maximum)
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && attachments.length === 0) || isLoading || disabled) return;
    onSendMessage(message, attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert FileList to array and add to attachments
    const newFiles = Array.from(files);
    
    // Filter files based on type if needed
    const filteredFiles = type === 'image' 
      ? newFiles.filter(file => file.type.startsWith('image/'))
      : newFiles;
    
    setAttachments(prev => [...prev, ...filteredFiles]);
    
    // Reset the input
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const toggleRecording = () => {
    // In a real app, you would implement actual audio recording functionality here
    setIsRecording(!isRecording);
    if (isRecording) {
      // Handle stopping recording and processing the audio
      console.log('Recording stopped');
    } else {
      console.log('Recording started');
    }
  };

  // Truncate file name for display
  const formatFileName = (name: string) => {
    if (name.length <= 20) return name;
    const ext = name.split('.').pop();
    const baseName = name.substring(0, name.length - (ext?.length || 0) - 1);
    return `${baseName.substring(0, 15)}...${ext ? `.${ext}` : ''}`;
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    }
    return <File className="w-4 h-4 text-orange-500" />;
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-4xl mx-auto">
      {/* Hidden file inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleFileUpload(e, 'file')} 
        className="hidden" 
        multiple 
      />
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={(e) => handleFileUpload(e, 'image')} 
        accept="image/*" 
        className="hidden" 
        multiple 
      />

      {/* Attachment preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 p-2 mt-2 mb-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            {attachments.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 text-xs group"
              >
                {getFileIcon(file)}
                <span className="max-w-[150px] truncate">{formatFileName(file.name)}</span>
                <button 
                  type="button" 
                  onClick={() => removeAttachment(index)}
                  className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pr-24 sm:pr-28 pl-12 py-3 max-h-[200px] resize-none",
            "focus-visible:ring-1 focus-visible:ring-offset-0",
            "rounded-xl border border-slate-300 dark:border-slate-700",
            "bg-white dark:bg-slate-900",
            "placeholder:text-slate-500 dark:placeholder:text-slate-400",
            "shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed",
            "text-sm sm:text-base"
          )}
          disabled={disabled || isLoading}
        />

        {/* Attachment button */}
        <Popover open={showAttachmentMenu} onOpenChange={setShowAttachmentMenu}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute left-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-8 w-8 transition-all"
              disabled={disabled || isLoading}
            >
              <motion.div
                animate={{ rotate: showAttachmentMenu ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Paperclip className="h-5 w-5" />
              </motion.div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" side="top" align="start" sideOffset={8}>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="ghost"
                className="flex justify-start items-center gap-2 text-sm h-9"
                onClick={handleImageButtonClick}
              >
                <Image className="h-4 w-4 text-blue-500" />
                <span>Upload Image</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="flex justify-start items-center gap-2 text-sm h-9"
                onClick={handleFileButtonClick}
              >
                <File className="h-4 w-4 text-orange-500" />
                <span>Upload Document</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="flex justify-start items-center gap-2 text-sm h-9"
                onClick={toggleRecording}
              >
                <Mic className={cn("h-4 w-4", isRecording ? "text-red-500" : "text-green-500")} />
                <span>{isRecording ? "Stop Recording" : "Voice Message"}</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Emoji button (placeholder) */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-[4.5rem] sm:right-20 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-8 w-8 transition-all"
                disabled={disabled || isLoading}
                onClick={() => console.log('Emoji picker not implemented')}
              >
                <Smile className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Add emoji</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Send button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={(!message.trim() && attachments.length === 0) || isLoading || disabled}
                className={cn(
                  "absolute right-2",
                  "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
                  "text-white",
                  "disabled:bg-blue-400 disabled:cursor-not-allowed",
                  "transition-all duration-200",
                  "flex items-center justify-center",
                  "h-10 w-10 rounded-lg",
                  "shadow-sm"
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  animate={isLoading ? { rotate: 360 } : {}}
                  transition={isLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Send message</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-right flex items-center justify-end gap-2">
        <Info className="w-3 h-3" />
        <span>Press Shift+Enter for a new line</span>
      </div>
    </form>
  );
};

export default ChatInput;