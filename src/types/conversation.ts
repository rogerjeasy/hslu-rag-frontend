/**
 * Updated types for conversations in the HSLU RAG application
 */
import { QueryType, AdditionalParams, Citation } from './query';

// Define a type for metadata to replace "any"
export type MessageMetadata = {
  citations?: Citation[];
  queryType?: QueryType;
  additionalParams?: AdditionalParams;
  [key: string]: unknown;
};

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  metadata?: MessageMetadata;
}

export interface Conversation {
  id: string;
  title: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  active: boolean;
  pinned?: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessagePreview?: string;
  active: boolean;
  pinned?: boolean;
}

export interface ConversationCreateRequest {
  title: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  initialMessage?: string;
  pinned?: boolean;
}

export interface ConversationUpdateRequest {
  title?: string;
  active?: boolean;
  pinned?: boolean;
}

export interface MessageCreateRequest {
  content: string;
  queryType?: QueryType;
  additionalParams?: AdditionalParams;
}

// Extended type for the UI
export interface ExtendedConversationSummary extends ConversationSummary {
  lastMessage?: string;
  queryType?: QueryType;
}