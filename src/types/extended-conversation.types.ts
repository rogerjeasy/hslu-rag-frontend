// src/types/extended-conversation.types.ts
import { ConversationSummary } from './conversation.types';

/**
 * Extended conversation summary with UI-specific properties 
 */
export interface ExtendedConversationSummary extends ConversationSummary {
  pinned?: boolean;
  queryType?: QueryType;
  lastMessagePreview?: string;
  meta?: Record<string, unknown>;
}

/**
 * Query types for categorizing conversations
 */
export enum QueryType {
  QUESTION_ANSWERING = 'question_answering',
  STUDY_GUIDE = 'study_guide',
  PRACTICE_QUESTIONS = 'practice_questions',
  KNOWLEDGE_GAP = 'knowledge_gap'
}

/**
 * Update to conversation store to handle UI-specific state
 */
export interface ExtendedConversationStoreState {
  // Filtering state 
  searchTerm: string;
  selectedCourse: string | null;
  
  // UI actions
  setSearchTerm: (term: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
  togglePinConversation: (conversationId: string) => Promise<void>;
  
  // Derived data
  filteredConversations: ExtendedConversationSummary[];
}