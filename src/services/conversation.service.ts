// src/services/conversation.service.ts
import { api, handleError } from '@/helpers/api';
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

// Define interfaces for backend API data formats
interface BackendConversationData {
  id: string;
  user_id: string;
  title: string;
  course_id?: string;
  module_id?: string;
  topic_id?: string;
  messages: BackendMessageData[];
  created_at: number;
  updated_at: number;
}

interface BackendMessageData {
  id: string;
  role: string;
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface BackendQueryResponse {
  user_message: BackendMessageData;
  assistant_message: BackendMessageData;
  rag_response: Record<string, unknown>;
}

class ConversationService {
  /**
   * Create a new conversation
   */
  async createConversation(data: ConversationCreate): Promise<Conversation> {
    try {
      // Use the RAG conversation endpoint
      // The title is used as the initial query content
      const apiData = {
        query: data.title, // Use title as the initial query
        course_id: data.courseId,
        module_id: data.moduleId,
        topic_id: data.topicId,
        prompt_type: 'question_answering', // Default prompt type
        additional_params: data.meta || {} // Pass any metadata as additional params
      };
      
      const response = await api.post('/rag/query/conversation', apiData);
      return this.convertToConversation(response.data.conversation);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to create conversation: ${errorMessage}`);
    }
  }

  /**
   * Get all conversations for current user
   */
  async getConversations(limit = 20): Promise<ConversationSummary[]> {
    try {
      const response = await api.get(`/conversations?limit=${limit}`);
      return response.data.map(this.convertToConversationSummary);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch conversations: ${errorMessage}`);
    }
  }

  /**
   * Get a specific conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return this.convertToConversation(response.data);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch conversation: ${errorMessage}`);
    }
  }

  /**
   * Update conversation metadata
   */
  async updateConversation(
    conversationId: string,
    data: ConversationUpdate
  ): Promise<Conversation> {
    try {
      // Convert camelCase to snake_case for backend
      const apiData: Record<string, string | undefined> = {
        title: data.title,
        course_id: data.courseId,
        module_id: data.moduleId,
        topic_id: data.topicId
      };
      
      const response = await api.put(`/conversations/${conversationId}`, apiData);
      return this.convertToConversation(response.data);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to update conversation: ${errorMessage}`);
    }
  }

  /**
   * Add a message to a conversation
   */
  async addMessage(
    conversationId: string,
    message: MessageCreate
  ): Promise<Message> {
    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, message);
      return this.convertToMessage(response.data);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to add message: ${errorMessage}`);
    }
  }

  /**
   * Process a query in a conversation
   */
  async processQuery(
    conversationId: string,
    queryRequest: QueryMessageRequest
  ): Promise<{ userMessage: Message; assistantMessage: Message }> {
    try {
      // Convert camelCase to snake_case for backend
      const apiData = {
        query: queryRequest.query,
        course_id: queryRequest.courseId,
        module_id: queryRequest.moduleId,
        topic_id: queryRequest.topicId,
        prompt_type: queryRequest.promptType || 'question_answering',
        additional_params: queryRequest.additionalParams
      };
      
      const response = await api.post(`/conversations/${conversationId}/query`, apiData);
      const data = response.data as BackendQueryResponse;
      
      return {
        userMessage: this.convertToMessage(data.user_message),
        assistantMessage: this.convertToMessage(data.assistant_message)
      };
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to process query: ${errorMessage}`);
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<DeleteResponse> {
    try {
      const response = await api.delete(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete conversation: ${errorMessage}`);
    }
  }

  /**
   * Delete all conversations
   */
  async deleteAllConversations(): Promise<DeleteResponse> {
    try {
      const response = await api.delete('/conversations');
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete all conversations: ${errorMessage}`);
    }
  }

  /**
   * Helper to convert backend conversation data to frontend Conversation type
   */
  private convertToConversation(data: BackendConversationData): Conversation {
    return {
      id: data.id,
      title: data.title,
      userId: data.user_id,
      courseId: data.course_id,
      moduleId: data.module_id,
      topicId: data.topic_id,
      messages: data.messages.map(this.convertToMessage),
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Helper to convert backend message data to frontend Message type
   */
  private convertToMessage(data: BackendMessageData): Message {
    return {
      id: data.id,
      role: data.role as 'user' | 'assistant',
      content: data.content,
      timestamp: data.timestamp,
      metadata: data.metadata
    };
  }

  /**
   * Helper to convert backend conversation data to frontend ConversationSummary type
   */
  private convertToConversationSummary(data: BackendConversationData): ConversationSummary {
    // Get the latest message if available
    const latestMessage = data.messages && data.messages.length > 0
      ? data.messages[data.messages.length - 1].content
      : undefined;
    
    // Truncate the latest message if it's too long
    const truncatedMessage = latestMessage && latestMessage.length > 30
      ? `${latestMessage.substring(0, 27)}...`
      : latestMessage;
    
    return {
      id: data.id,
      title: data.title,
      courseId: data.course_id,
      moduleId: data.module_id,
      topicId: data.topic_id,
      messageCount: data.messages ? data.messages.length : 0,
      latestMessage: truncatedMessage,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}

// Export a singleton instance
export const conversationService = new ConversationService();