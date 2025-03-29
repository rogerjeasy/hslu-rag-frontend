// src/store/conversationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Conversation, 
  ConversationSummary, 
  ConversationCreate,
  ConversationUpdate,
  Message,
  MessageCreate,
  QueryMessageRequest,
  DeleteResponse
} from '@/types/conversation.types';
import { conversationService } from '@/services/conversation.service';
import { ragService } from '@/services/rag.service';
import { RAGResponse } from '@/types/rag.types';

interface ConversationState {
  // Data
  conversations: ConversationSummary[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: (limit?: number) => Promise<void>;
  fetchConversation: (id: string) => Promise<Conversation>;
  createConversation: (data: ConversationCreate) => Promise<Conversation>;
  updateConversation: (id: string, data: ConversationUpdate) => Promise<Conversation>;
  addMessage: (conversationId: string, message: MessageCreate) => Promise<Message>;
  processQuery: (conversationId: string, request: QueryMessageRequest) => Promise<{ userMessage: Message; assistantMessage: Message }>;
  processQueryWithNewConversation: (request: QueryMessageRequest) => Promise<{ response: RAGResponse; conversation: Conversation }>;
  deleteConversation: (id: string) => Promise<DeleteResponse>;
  deleteAllConversations: () => Promise<DeleteResponse>;
  resetError: () => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      // Data
      conversations: [],
      currentConversation: null,
      isLoading: false,
      error: null,
      
      // Actions
      fetchConversations: async (limit = 20) => {
        set({ isLoading: true, error: null });
        
        try {
          const conversations = await conversationService.getConversations(limit);
          console.log('Conversations:', conversations);
          set({ conversations, isLoading: false });
        } catch (error) {
          console.error('Error fetching conversations:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false 
          });
        }
      },
      
      fetchConversation: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const conversation = await conversationService.getConversation(id);
          set({ currentConversation: conversation, isLoading: false });
          return conversation;
        } catch (error) {
          console.error('Error fetching conversation:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      createConversation: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const conversation = await conversationService.createConversation(data);
          
          // Add to conversations list and set as current
          set((state) => ({
            conversations: [
              {
                id: conversation.id,
                title: conversation.title,
                courseId: conversation.courseId,
                moduleId: conversation.moduleId,
                topicId: conversation.topicId,
                messageCount: conversation.messages.length,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt
              },
              ...state.conversations
            ],
            currentConversation: conversation,
            isLoading: false
          }));
          
          return conversation;
        } catch (error) {
          console.error('Error creating conversation:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateConversation: async (id, data) => {
        set({ isLoading: true, error: null });
        
        try {
          const conversation = await conversationService.updateConversation(id, data);
          
          // Update in conversations list and current conversation if it's the same
          set((state) => {
            const updatedConversations = state.conversations.map(conv => 
              conv.id === id 
                ? {
                    ...conv,
                    title: conversation.title,
                    courseId: conversation.courseId,
                    moduleId: conversation.moduleId,
                    topicId: conversation.topicId,
                    updatedAt: conversation.updatedAt
                  }
                : conv
            );
            
            return {
              conversations: updatedConversations,
              currentConversation: state.currentConversation?.id === id 
                ? conversation 
                : state.currentConversation,
              isLoading: false
            };
          });
          
          return conversation;
        } catch (error) {
          console.error('Error updating conversation:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      addMessage: async (conversationId, message) => {
        set({ isLoading: true, error: null });
        
        try {
          const addedMessage = await conversationService.addMessage(conversationId, message);
          
          // Update the current conversation if it's the same
          set((state) => {
            if (state.currentConversation?.id === conversationId) {
              return {
                currentConversation: {
                  ...state.currentConversation,
                  messages: [...state.currentConversation.messages, addedMessage],
                  updatedAt: Date.now()
                },
                isLoading: false
              };
            }
            
            return { isLoading: false };
          });
          
          // Update the conversation in the list
          set((state) => {
            const updatedConversations = state.conversations.map(conv => 
              conv.id === conversationId 
                ? {
                    ...conv,
                    messageCount: conv.messageCount + 1,
                    latestMessage: message.content.length > 30 
                      ? `${message.content.substring(0, 27)}...` 
                      : message.content,
                    updatedAt: Date.now()
                  }
                : conv
            );
            
            return { conversations: updatedConversations };
          });
          
          return addedMessage;
        } catch (error) {
          console.error('Error adding message:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      processQuery: async (conversationId, request) => {
        set({ isLoading: true, error: null });
        
        try {
          const { userMessage, assistantMessage } = await conversationService.processQuery(
            conversationId,
            request
          );
          
          // Update the current conversation if it's the same
          set((state) => {
            if (state.currentConversation?.id === conversationId) {
              return {
                currentConversation: {
                  ...state.currentConversation,
                  messages: [...state.currentConversation.messages, userMessage, assistantMessage],
                  updatedAt: Date.now()
                },
                isLoading: false
              };
            }
            
            return { isLoading: false };
          });
          
          // Update the conversation in the list
          set((state) => {
            const updatedConversations = state.conversations.map(conv => 
              conv.id === conversationId 
                ? {
                    ...conv,
                    messageCount: conv.messageCount + 2, // +2 for user and assistant message
                    latestMessage: assistantMessage.content.length > 30 
                      ? `${assistantMessage.content.substring(0, 27)}...` 
                      : assistantMessage.content,
                    updatedAt: Date.now()
                  }
                : conv
            );
            
            return { conversations: updatedConversations };
          });
          
          return { userMessage, assistantMessage };
        } catch (error) {
          console.error('Error processing query:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      processQueryWithNewConversation: async (request) => {
        set({ isLoading: true, error: null });
        
        try {
          // First create a new conversation
          const conversation = await conversationService.createConversation({
            title: request.query.substring(0, 50), // Use first 50 chars of query as title
            courseId: request.courseId,
            moduleId: request.moduleId,
            topicId: request.topicId
          });
          
          // Then process the query in this new conversation
          const { response, conversationId } = await ragService.processQueryWithConversation(
            request,
            conversation.id
          );
          
          // Fetch the updated conversation to get all details with messages
          const updatedConversation = await conversationService.getConversation(conversation.id);
          
          // Add to conversations list and set as current
          set((state) => ({
            conversations: [
              {
                id: updatedConversation.id,
                title: updatedConversation.title,
                courseId: updatedConversation.courseId,
                moduleId: updatedConversation.moduleId,
                topicId: updatedConversation.topicId,
                messageCount: updatedConversation.messages.length,
                latestMessage: response.answer.length > 30 
                  ? `${response.answer.substring(0, 27)}...` 
                  : response.answer,
                createdAt: updatedConversation.createdAt,
                updatedAt: updatedConversation.updatedAt
              },
              ...state.conversations
            ],
            currentConversation: updatedConversation,
            isLoading: false
          }));
          
          return { response, conversation: updatedConversation };
        } catch (error) {
          console.error('Error processing query with new conversation:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      deleteConversation: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await conversationService.deleteConversation(id);
          
          // Remove from conversations list and clear current if it's the same
          set((state) => ({
            conversations: state.conversations.filter(conv => conv.id !== id),
            currentConversation: state.currentConversation?.id === id 
              ? null 
              : state.currentConversation,
            isLoading: false
          }));
          
          return response;
        } catch (error) {
          console.error('Error deleting conversation:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      deleteAllConversations: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await conversationService.deleteAllConversations();
          
          // Clear conversations list and current conversation
          set({
            conversations: [],
            currentConversation: null,
            isLoading: false
          });
          
          return response;
        } catch (error) {
          console.error('Error deleting all conversations:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      resetError: () => {
        set({ error: null });
      },
      
      setCurrentConversation: (conversation) => {
        set({ currentConversation: conversation });
      }
    }),
    {
      name: 'conversation-store',
      // Only persist conversations list, not currentConversation or loading states
      partialize: (state) => ({ conversations: state.conversations }),
    }
  )
);