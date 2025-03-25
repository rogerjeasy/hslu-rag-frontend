"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, MessageCreateRequest } from '@/types/conversation';
import { QueryType } from '@/types/query';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import ChatHistorySidebar from './ChatHistorySidebar';
import ChatControls from './ChatControls';
import EmptyState from './EmptyState';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useConversationStore } from '@/store/conversationStore';

interface ChatContainerProps {
  currentCourse?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ currentCourse }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { 
    currentConversation, 
    sendMessage, 
    createConversation,
    isLoading 
  } = useConversationStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);

  const handleSendMessage = async (content: string, queryType: QueryType = QueryType.QUESTION_ANSWERING) => {
    if (!content.trim()) return;
    
    if (!currentConversation) {
      // Create a new conversation if none exists
      const newConversation = await createConversation({
        title: content.length > 30 ? `${content.substring(0, 30)}...` : content,
        courseId: currentCourse || '',
        initialMessage: content
      });
    } else {
      // Add to existing conversation
      await sendMessage(
        currentConversation.id,
        content,
        queryType
      );
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`fixed lg:relative z-10 lg:z-auto w-full sm:w-80 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } h-full border-r border-gray-200 dark:border-gray-700 overflow-y-auto`}
      >
        <ChatHistorySidebar 
          onSelectConversation={() => setSidebarOpen(false)} 
          currentCourseId={currentCourse}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden relative">
        {/* Mobile sidebar toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="lg:hidden absolute top-3 left-3 z-20"
        >
          <Menu />
        </Button>

        {/* Chat Header */}
        <ChatHeader 
          conversation={currentConversation} 
          courseId={currentCourse} 
        />

        {/* Chat Messages or Empty State */}
        <div className="flex-1 overflow-hidden">
          {currentConversation ? (
            <ChatMessageList 
              messages={currentConversation.messages} 
              isLoading={isLoading} 
              messagesEndRef={messagesEndRef}
            />
          ) : (
            <EmptyState courseId={currentCourse} onStartConversation={handleSendMessage} />
          )}
        </div>

        {/* Chat Controls */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <ChatControls conversation={currentConversation} />
          
          {/* Chat Input */}
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            conversationId={currentConversation?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;