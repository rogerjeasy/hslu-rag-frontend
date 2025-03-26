import { api, handleError } from '@/helpers/api';
import { 
  Conversation, 
  ConversationSummary, 
  ConversationCreateRequest,
  ConversationUpdateRequest,
  MessageCreateRequest,
  Message
} from '@/types/conversation';
import { Citation, QueryType, AdditionalParams } from '@/types/query';

class ConversationService {
  /**
   * Create a new conversation
   */
  async createConversation(data: ConversationCreateRequest): Promise<Conversation> {
    try {
      const response = await api.post('/conversations', data);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to create conversation: ${errorMessage}`);
    }
  }

  /**
   * Get all conversations for the current user
   * Optionally filter by course ID
   */
  async getConversations(courseId?: string): Promise<ConversationSummary[]> {
    try {
      const url = courseId 
        ? `/conversations?course_id=${courseId}` 
        : '/conversations';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch conversations: ${errorMessage}`);
    }
  }

  /**
   * Get a specific conversation by ID with all messages
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch conversation: ${errorMessage}`);
    }
  }

  /**
   * Update conversation metadata (title, active status)
   */
  async updateConversation(
    conversationId: string, 
    data: ConversationUpdateRequest
  ): Promise<Conversation> {
    try {
      const response = await api.put(`/conversations/${conversationId}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to update conversation: ${errorMessage}`);
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await api.delete(`/conversations/${conversationId}`);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete conversation: ${errorMessage}`);
    }
  }

  /**
   * Add a message to a conversation and get AI response
   */
  async sendMessage(
    conversationId: string,
    content: string,
    queryType: QueryType = QueryType.QUESTION_ANSWERING,
    additionalParams?: AdditionalParams
  ): Promise<{
    conversation_id: string;
    exchange: Message[];
    citations: Citation[];
  }> {
    try {
      const messageData: MessageCreateRequest = {
        content,
        queryType,
        additionalParams
      };

      const response = await api.post(
        `/conversations/${conversationId}/messages`, 
        messageData
      );
      
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to send message: ${errorMessage}`);
    }
  }

}

// Export a singleton instance
export const conversationService = new ConversationService();