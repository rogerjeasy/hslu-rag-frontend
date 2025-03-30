// src/store/enhancedConversationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useConversationStore } from './conversationStore';
import { ConversationSummary } from '@/types/conversation.types';
import { ExtendedConversationSummary, QueryType, ExtendedConversationStoreState } from '@/types/extended-conversation.types';

/**
 * Enhanced conversation store that adds UI-specific state and actions
 * on top of the base conversation store
 */
export const useEnhancedConversationStore = create<ExtendedConversationStoreState>()(
  persist(
    (set, get) => ({
      // UI state
      searchTerm: '',
      selectedCourse: null,
      
      // Actions
      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
      },
      
      setSelectedCourse: (courseId: string | null) => {
        set({ selectedCourse: courseId });
      },
      
      togglePinConversation: async (conversationId: string) => {
        // Get the base conversation store
        const { updateConversation, conversations } = useConversationStore.getState();
        
        // Find the conversation
        const conversation = conversations.find(c => c.id === conversationId);
        
        if (!conversation) {
          throw new Error(`Conversation with ID ${conversationId} not found`);
        }
        
        // Create meta object if it doesn't exist
        const currentMeta = conversation.meta || {};
        
        // Get current pinned status or default to false
        const currentPinned = (currentMeta.pinned as boolean) || false;
        
        // Update the conversation with new pinned status
        await updateConversation(conversationId, {
          meta: {
            ...currentMeta,
            pinned: !currentPinned
          }
        });
      },
      
      // Derived data
      get filteredConversations() {
        const { conversations } = useConversationStore.getState();
        const { searchTerm, selectedCourse } = get();
        
        // Filter by course if selected
        const courseFiltered = selectedCourse 
          ? conversations.filter(c => c.courseId === selectedCourse)
          : conversations;
        
        // Filter by search term
        const searchFiltered = searchTerm 
          ? courseFiltered.filter(c => 
              c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (c.latestMessage ? c.latestMessage.toLowerCase().includes(searchTerm.toLowerCase()) : false)
            )
          : courseFiltered;
        
        // Extend with UI properties
        return searchFiltered.map((conversation): ExtendedConversationSummary => {
          // Handle case where meta might be undefined
          const meta = conversation.meta || {};
          
          // Determine query type based on meta or content
          const queryType = determineQueryType(conversation);
          
          return {
            ...conversation,
            pinned: (meta.pinned as boolean) || false,
            queryType,
            lastMessagePreview: conversation.latestMessage,
            meta: meta
          };
        });
      }
    }),
    {
      name: 'enhanced-conversation-store',
      partialize: (state) => ({
        searchTerm: state.searchTerm,
        selectedCourse: state.selectedCourse
      })
    }
  )
);

/**
 * Determine the query type based on metadata or content
 */
function determineQueryType(conversation: ConversationSummary): QueryType {
  // Create meta object if it doesn't exist
  const meta = conversation.meta || {};
  
  // If we have metadata with query type, use that
  if (meta.queryType) {
    return meta.queryType as QueryType;
  }
  
  // Otherwise try to infer from title or latest message
  const title = conversation.title.toLowerCase();
  const latestMessage = conversation.latestMessage ? conversation.latestMessage.toLowerCase() : '';
  
  if (title.includes('study guide') || latestMessage.includes('study guide')) {
    return QueryType.STUDY_GUIDE;
  }
  
  if (title.includes('practice') || title.includes('quiz') || 
      latestMessage.includes('practice') || latestMessage.includes('quiz')) {
    return QueryType.PRACTICE_QUESTIONS;
  }
  
  if (title.includes('knowledge gap') || title.includes('gap analysis') ||
      latestMessage.includes('knowledge gap') || latestMessage.includes('gap analysis')) {
    return QueryType.KNOWLEDGE_GAP;
  }
  
  // Default to question answering
  return QueryType.QUESTION_ANSWERING;
}