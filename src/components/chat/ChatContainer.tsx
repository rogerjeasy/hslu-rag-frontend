"use client";

import { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import ChatControls from './ChatControls';
import ChatHistorySidebar from './ChatHistorySidebar';
import EmptyState from '../ui/EmptyState';
import LoadingIndicator from '../ui/LoadingIndicator';
import { Message, Conversation, Subject, AIModel } from '@/types/chat';

export default function ChatContainer() {
  // State for the current conversation
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Reference to maintain scroll position
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations from local storage or API
  useEffect(() => {
    const loadConversations = async () => {
      setInitialLoading(true);
      try {
        // Here you would typically fetch from your backend
        // For now, we'll use mock data from localStorage
        const savedConversations = localStorage.getItem('conversations');
        if (savedConversations) {
          setConversations(JSON.parse(savedConversations));
        }
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Function to send a message
  const sendMessage = async (content: string) => {
    if (!content.trim() || !selectedSubject) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create a new conversation if one doesn't exist
      if (!currentConversation) {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          subject: selectedSubject,
          model: selectedModel,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [userMessage],
        };
        setCurrentConversation(newConversation);
        setConversations((prev) => [newConversation, ...prev]);
      } else {
        // Update existing conversation
        const updatedConversation = {
          ...currentConversation,
          updatedAt: new Date().toISOString(),
          messages: [...currentConversation.messages, userMessage],
        };
        setCurrentConversation(updatedConversation);
        setConversations((prev) =>
          prev.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv))
        );
      }

      // Call your API to get a response from the AI
      // This is a placeholder - replace with your actual API call
      const response = await fetchAIResponse(content, selectedSubject, selectedModel);

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update the conversation with the AI response
      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          updatedAt: new Date().toISOString(),
          messages: [...currentConversation.messages, aiMessage],
        };
        setCurrentConversation(updatedConversation);
        setConversations((prev) =>
          prev.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv))
        );
      }

      // Save to localStorage (in a real app, you'd save to your backend)
      localStorage.setItem('conversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error - display error message to user
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder function for AI response - replace with actual API call
  const fetchAIResponse = async (
    message: string,
    subject: Subject | null,
    model: AIModel | null
  ): Promise<string> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `This is a placeholder response to your question about ${subject?.name}. In a real implementation, this would be a response from the ${model?.name} AI model.`;
  };

  // Start a new conversation
  const startNewConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  // Load an existing conversation
  const loadConversation = (conversationId: string) => {
    setIsLoading(true);
    
    const conversation = conversations.find((conv) => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      setMessages(conversation.messages);
      setSelectedSubject(conversation.subject);
      setSelectedModel(conversation.model);
    }
    
    // Simulate a short loading period for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
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
            conversations={conversations}
            currentConversationId={currentConversation?.id}
            onSelectConversation={loadConversation}
            onStartNewConversation={startNewConversation}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex flex-col flex-1 h-full">
        <ChatHeader
          subject={selectedSubject}
          model={selectedModel}
          onSubjectChange={setSelectedSubject}
          onModelChange={setSelectedModel}
          onToggleSidebar={toggleSidebar}
          isLoading={isLoading}
        />

        {/* Chat Messages or Empty State */}
        <div className="flex-1 overflow-hidden relative">
          {messages.length > 0 ? (
            <ChatMessageList 
              messages={messages} 
              isLoading={isLoading} 
              messagesEndRef={messagesEndRef} 
            />
          ) : (
            <EmptyState 
              subject={selectedSubject} 
              onStartConversation={sendMessage} 
            />
          )}
          
          {/* Overlay loading indicator for conversation changes */}
          {isLoading && messages.length === 0 && (
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
            isLoading={isLoading} 
            disabled={!selectedSubject} 
          />
          <ChatControls 
            onStartNewConversation={startNewConversation} 
            onClearConversation={() => setMessages([])}
            hasActiveConversation={messages.length > 0}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}