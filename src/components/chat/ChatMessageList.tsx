"use client";

import React from 'react';
import { Message } from '@/types/conversation';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ 
  messages, 
  isLoading 
}) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: Math.min(index * 0.05, 0.3) 
            }}
          >
            <ChatMessage message={message} />
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center py-4"
          >
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Generating response...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-slate-500 dark:text-slate-400 py-12">
          <p>No messages yet. Start a conversation by typing a message below.</p>
        </div>
      )}
    </div>
  );
};

export default ChatMessageList;