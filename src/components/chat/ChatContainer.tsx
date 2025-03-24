"use client";

import { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import ChatControls from './ChatControls';
import ChatHistorySidebar from './ChatHistorySidebar';
import EmptyState from './EmptyState';
import LoadingIndicator from '../ui/LoadingIndicator';
import { Course } from '@/types/course.types';
import { AIModel } from '@/types/chat';
import { QueryType } from '@/types/query';
import { useConversationStore } from '@/store/conversationStore';
import { useCourseStore } from '@/store/courseStore';

export default function ChatContainer() {
  // Get stores
  const conversationStore = useConversationStore();
  const courseStore = useCourseStore();

  // Local state for UI
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Reference to maintain scroll position - Fixed to use HTMLDivElement explicitly
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract data from stores
  const { 
    currentConversation, 
    isLoading: isConversationLoading,
    filteredConversations
  } = conversationStore;

  // Extract messages from current conversation
  const messages = currentConversation?.messages || [];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations and courses on initial render
  useEffect(() => {
    const initialize = async () => {
      setInitialLoading(true);
      
      try {
        // Load courses first
        await courseStore.fetchCourses();
        
        // Then load conversations
        await conversationStore.fetchConversations();
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    initialize();
  }, [courseStore, conversationStore]);

  // Function to send a message
  const sendMessage = async (content: string) => {
    if (!content.trim() || !selectedCourse) return;

    if (!currentConversation) {
      // Create a new conversation first
      const newConversation = await conversationStore.createConversation({
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        courseId: selectedCourse.id,
        initialMessage: content
      });

      // Then send the message
      await conversationStore.sendMessage(
        newConversation.id,
        content,
        QueryType.QUESTION_ANSWERING
      );
    } else {
      // Send message to existing conversation
      await conversationStore.sendMessage(
        currentConversation.id,
        content,
        QueryType.QUESTION_ANSWERING
      );
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    conversationStore.setCurrentConversation(null);
  };

  // Load an existing conversation
  const loadConversation = (conversationId: string) => {
    conversationStore.getConversation(conversationId);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Handle course change
  const handleCourseChange = (course: Course) => {
    setSelectedCourse(course);
  };

  // Display initial loading state
  if (initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <LoadingIndicator size="large" />
          <p className="mt-4 text-muted-foreground">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* History Sidebar - conditionally shown */}
      {showSidebar && (
        <div className="w-64 border-r border-border h-full">
          <ChatHistorySidebar
            conversations={filteredConversations}
            currentConversationId={currentConversation?.id}
            onSelectConversation={loadConversation}
            onStartNewConversation={startNewConversation}
            isLoading={isConversationLoading}
          />
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex flex-col flex-1 h-full">
        <ChatHeader
          course={selectedCourse}
          model={selectedModel}
          onCourseChange={handleCourseChange}
          onModelChange={setSelectedModel}
          onToggleSidebar={toggleSidebar}
          isLoading={isConversationLoading}
          sidebarVisible={showSidebar}
        />

        {/* Chat Messages or Empty State */}
        <div className="flex-1 overflow-hidden relative">
          {messages.length > 0 ? (
            <ChatMessageList 
              messages={messages} 
              isLoading={isConversationLoading} 
              messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>} 
            />
          ) : (
            <EmptyState 
              course={selectedCourse}
              onStartConversation={sendMessage} 
            />
          )}
          
          {/* Overlay loading indicator for conversation changes */}
          {isConversationLoading && messages.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <LoadingIndicator />
              <span className="ml-2">Preparing conversation...</span>
            </div>
          )}
        </div>

        {/* Input Area and Controls */}
        <div className="border-t border-border p-4">
          <ChatInput 
            onSendMessage={sendMessage} 
            isLoading={isConversationLoading} 
            disabled={!selectedCourse}
          />
          <ChatControls 
            onStartNewConversation={startNewConversation} 
            onClearConversation={() => {
              // Clear the current conversation by creating a new one
              if (currentConversation && selectedCourse) {
                conversationStore.createConversation({
                  title: "New Conversation",
                  courseId: selectedCourse.id
                });
              }
            }}
            hasActiveConversation={messages.length > 0}
            isLoading={isConversationLoading}
          />
        </div>
      </div>
    </div>
  );
}