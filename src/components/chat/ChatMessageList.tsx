"use client";

import React, { RefObject } from 'react';
import { Message } from '@/types/conversation';
import ChatMessage from './ChatMessage';
import LoadingIndicator from '../ui/LoadingIndicator';

interface ChatMessageListProps {
  messages: Message[];
  isLoading?: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ 
  messages, 
  isLoading = false,
  messagesEndRef 
}) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4 mt-1">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              AI
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-3xl">
            <LoadingIndicator />
          </div>
        </div>
      )}
      
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;