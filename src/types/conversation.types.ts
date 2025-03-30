// src/types/conversation.types.ts
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  citations?: number[];
  query_id?: string;
  document_id?: string;
  [key: string]: unknown;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  courseId?: string;
  moduleId?: string;
  topicId?: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  meta?: Record<string, unknown>; 
}

export interface ConversationSummary {
  id: string;
  title: string;
  courseId?: string;
  moduleId?: string;
  topicId?: string;
  messageCount: number;
  latestMessage?: string;
  createdAt: number;
  updatedAt: number;
  meta?: Record<string, unknown>; 
}

export interface ConversationCreate {
  title?: string;
  courseId?: string;
  moduleId?: string;
  topicId?: string;
  meta?: Record<string, unknown>;
}

export interface ConversationUpdate {
  title?: string;
  courseId?: string;
  moduleId?: string;
  topicId?: string;
  meta?: Record<string, unknown>;
}

export interface MessageCreate {
  content: string;
  role?: MessageRole;
  metadata?: MessageMetadata;
}

export interface QueryMessageRequest {
  query: string;
  courseId?: string;
  moduleId?: string;
  topicId?: string;
  promptType?: string;
  additionalParams?: Record<string, unknown>;
}

export interface StudyGuideRequest {
  topic: string;
  courseId?: string;
  moduleId?: string;
  detailLevel?: 'basic' | 'medium' | 'comprehensive';
  format?: 'outline' | 'notes' | 'flashcards' | 'mind_map' | 'summary';
}

export interface PracticeQuestionsRequest {
  topic: string;
  courseId?: string;
  moduleId?: string;
  questionCount?: number;
  difficulty?: string;
  questionTypes?: string[];
}

export interface KnowledgeGapRequest {
  query: string;
  courseId?: string;
  moduleId?: string;
  promptType?: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}