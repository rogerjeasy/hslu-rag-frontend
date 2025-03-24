/**
 * Types for conversations in the HSLU RAG application
 */
import { QueryType, AdditionalParams } from './query';

// Define a type for metadata to replace "any"
export type MessageMetadata = Record<string, unknown>;

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
  pinned?: boolean; // Added pinned property
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
  pinned?: boolean; // Added pinned property
}

export interface ConversationCreateRequest {
  title: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  initialMessage?: string;
  pinned?: boolean; // Added pinned property
}

export interface ConversationUpdateRequest {
  title?: string;
  active?: boolean;
  pinned?: boolean; // Added pinned property
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