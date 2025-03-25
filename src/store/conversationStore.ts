// src/store/conversationStore.ts
import { create } from 'zustand';
import { 
  Conversation, 
  ConversationSummary, 
  ConversationCreateRequest,
  ConversationUpdateRequest,
  Message
} from '@/types/conversation';
import { Citation, QueryType, AdditionalParams } from '@/types/query';
import { conversationService } from '@/services/converstation.service';

// Extended ConversationSummary to include extra properties needed for the UI
interface ExtendedConversationSummary extends ConversationSummary {
  lastMessage?: string;
  queryType?: QueryType;
}

interface ConversationState {
  // Data
  conversations: ExtendedConversationSummary[];
  filteredConversations: ExtendedConversationSummary[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  
  // Filter state
  searchTerm: string;
  selectedCourse: string | null;
  selectedQueryType: QueryType | null;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
  setSelectedQueryType: (queryType: QueryType | null) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  
  // Data actions
  fetchConversations: (courseId?: string) => Promise<void>;
  getConversation: (id: string) => Promise<Conversation>;
  createConversation: (data: ConversationCreateRequest) => Promise<Conversation>;
  updateConversation: (id: string, data: ConversationUpdateRequest) => Promise<Conversation>;
  deleteConversation: (id: string) => Promise<void>;
  
  // Message actions
  sendMessage: (
    conversationId: string,
    content: string,
    queryType?: QueryType,
    additionalParams?: AdditionalParams
  ) => Promise<{
    conversation_id: string;
    exchange: Message[];
    citations: Citation[];
  }>;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  // Initial state
  conversations: [],
  filteredConversations: [],
  currentConversation: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedCourse: null,
  selectedQueryType: null,
  
  // Filter setters
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },
  
  setSelectedCourse: (courseId) => {
    set({ selectedCourse: courseId });
    get().applyFilters();
  },
  
  setSelectedQueryType: (queryType) => {
    set({ selectedQueryType: queryType });
    get().applyFilters();
  },
  
  // Filter actions
  applyFilters: () => {
    const { conversations, searchTerm, selectedCourse, selectedQueryType } = get();
    let result = [...conversations];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        conversation => 
          conversation.title.toLowerCase().includes(lowerSearchTerm) ||
          (conversation.lastMessage && 
           conversation.lastMessage.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Apply course filter (redundant if we're already fetching by course)
    if (selectedCourse) {
      result = result.filter(conversation => conversation.courseId === selectedCourse);
    }
    
    // Apply query type filter
    if (selectedQueryType) {
      result = result.filter(conversation => conversation.queryType === selectedQueryType);
    }
    
    set({ filteredConversations: result });
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },
  
  resetFilters: () => {
    set({ 
      searchTerm: '',
      selectedCourse: null,
      selectedQueryType: null,
      filteredConversations: get().conversations
    });
  },
  
  // Data actions
  fetchConversations: async (courseId) => {
    set({ isLoading: true, error: null });
    
    try {
      const conversations = await conversationService.getConversations(courseId);
      set({ 
        conversations, 
        filteredConversations: conversations, 
        isLoading: false,
        selectedCourse: courseId || null
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  getConversation: async (id) => {
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
      
      // Add the new conversation to the list if we're already showing conversations for this course
      if (get().selectedCourse === data.courseId || !get().selectedCourse) {
        set(state => {
          // Create a summary for the list
          const conversationSummary: ExtendedConversationSummary = {
            id: conversation.id,
            title: conversation.title,
            courseId: conversation.courseId,
            moduleId: conversation.moduleId,
            topicId: conversation.topicId,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            messageCount: conversation.messages.length,
            lastMessagePreview: conversation.messages.length > 0 ? conversation.messages[0].content.substring(0, 50) : '',
            active: conversation.active,
            // Extended properties for UI
            lastMessage: conversation.messages.length > 0 ? conversation.messages[0].content : '',
            queryType: QueryType.QUESTION_ANSWERING
          };
          
          const updatedConversations = [...state.conversations, conversationSummary];
          
          return {
            conversations: updatedConversations,
            filteredConversations: updatedConversations,
            currentConversation: conversation,
            isLoading: false
          };
        });
        
        // Re-apply any filters
        get().applyFilters();
      } else {
        set({
          currentConversation: conversation,
          isLoading: false
        });
      }
      
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
      const updatedConversation = await conversationService.updateConversation(id, data);
      
      set(state => {
        // Update the conversation in the list
        const updatedConversations = state.conversations.map(conversation => 
          conversation.id === id 
            ? { 
                ...conversation, 
                title: updatedConversation.title,
                updatedAt: updatedConversation.updatedAt,
                active: updatedConversation.active
              } 
            : conversation
        );
        
        // Update current conversation if it's the one being edited
        const currentConversation = 
          state.currentConversation && state.currentConversation.id === id
            ? updatedConversation
            : state.currentConversation;
        
        return {
          conversations: updatedConversations,
          currentConversation,
          isLoading: false
        };
      });
      
      // Re-apply filters
      get().applyFilters();
      
      return updatedConversation;
    } catch (error) {
      console.error('Error updating conversation:', error);
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
      await conversationService.deleteConversation(id);
      
      set(state => {
        const updatedConversations = state.conversations.filter(
          conversation => conversation.id !== id
        );
        
        // Clear current conversation if it was the one deleted
        const currentConversation = 
          state.currentConversation && state.currentConversation.id === id
            ? null
            : state.currentConversation;
        
        return {
          conversations: updatedConversations,
          filteredConversations: updatedConversations,
          currentConversation,
          isLoading: false
        };
      });
      
      // Re-apply filters
      get().applyFilters();
      
    } catch (error) {
      console.error('Error deleting conversation:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  sendMessage: async (conversationId, content, queryType = QueryType.QUESTION_ANSWERING, additionalParams) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await conversationService.sendMessage(
        conversationId, content, queryType, additionalParams
      );
      
      // Update current conversation with new messages if it's loaded
      const current = get().currentConversation;
      if (current && current.id === conversationId) {
        const updatedConversation = await conversationService.getConversation(conversationId);
        set({ currentConversation: updatedConversation });
      }
      
      // Update the conversation summary in the list
      set(state => {
        const updatedConversations = state.conversations.map(conversation => {
          if (conversation.id === conversationId) {
            return {
              ...conversation,
              lastMessage: content,
              lastMessagePreview: content.substring(0, 50),
              messageCount: (conversation.messageCount || 0) + 2, // User message + AI response
              updatedAt: new Date().toISOString()
            };
          }
          return conversation;
        });
        
        return {
          conversations: updatedConversations,
          isLoading: false
        };
      });
      
      // Re-apply filters
      get().applyFilters();
      
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
}));