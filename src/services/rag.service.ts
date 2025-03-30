// src/services/rag.service.ts
import { api, handleError } from '@/helpers/api';
import { 
  QueryMessageRequest, 
  StudyGuideRequest as ConversationStudyGuideRequest,
  PracticeQuestionsRequest as ConversationPracticeQuestionsRequest,
  KnowledgeGapRequest 
} from '@/types/conversation.types';
import { 
  RAGResponse, 
  RAGContext, 
  StudyGuideRequest, 
  PracticeQuestionsRequest 
} from '@/types/rag.types';

// Define interface for the backend API response
interface BackendRAGResponse {
  answer: string;
  citations: number[];
  context: BackendRAGContext[];
  meta?: Record<string, unknown>;
}

interface BackendRAGContext {
  id: string;
  title: string;
  content: string;
  citation_number: number;
  material_id?: string;
  source_url?: string;
  source_page?: number;
  score?: number;
}

// Define interfaces for API request data
interface StudyGuideApiData {
  topic: string;
  course_id?: string;
  module_id?: string;
  detail_level?: string;
  format?: string;
  prompt_type?: string;
}

interface PracticeQuestionsApiData {
  topic: string;
  course_id?: string;
  module_id?: string;
  question_count?: number;
  difficulty?: string;
  question_types?: string[];
  prompt_type?: string;
}

class RAGService {
  /**
   * Process a RAG query
   */
  async processQuery(request: QueryMessageRequest): Promise<RAGResponse> {
    try {
      // Convert camelCase to snake_case for backend
      const apiData = {
        query: request.query,
        course_id: request.courseId,
        module_id: request.moduleId,
        topic_id: request.topicId,
        prompt_type: request.promptType || 'question_answering',
        additional_params: request.additionalParams
      };
      
      const response = await api.post('/rag/query', apiData);
      return this.convertToRAGResponse(response.data);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to process RAG query: ${errorMessage}`);
    }
  }

  /**
   * Process a RAG query and save it in a conversation
   */
  async processQueryWithConversation(
    request: QueryMessageRequest,
    conversationId: string
  ): Promise<{ response: RAGResponse; conversationId: string }> {
    try {
      // Convert camelCase to snake_case for backend
      const apiData = {
        query: request.query,
        course_id: request.courseId,
        module_id: request.moduleId,
        topic_id: request.topicId,
        prompt_type: request.promptType || 'question_answering',
        additional_params: request.additionalParams
      };
      
      // If we have a conversation ID, add it to the URL as a query param
      const url = `/conversations/${conversationId}/query`;
      
      const response = await api.post(url, apiData);
      const data = response.data;
      
      // Extract RAG response from the response data
      const ragResponse = this.convertToRAGResponse({
        answer: data.assistant_message.content,
        citations: data.assistant_message.metadata?.citations || [],
        context: data.context || [],
        meta: data.meta || {}
      });
      
      return {
        response: ragResponse,
        conversationId: conversationId
      };
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to process RAG query with conversation: ${errorMessage}`);
    }
  }

  /**
 * Generate a study guide
 */
async generateStudyGuide(request: StudyGuideRequest): Promise<RAGResponse> {
  try {
    // Define the API data structure with proper TypeScript typing
    interface StudyGuideApiData {
      topic: string;
      module_id?: string;
      detail_level: string;
      format: string;
      course_id?: string;
      meta?: {
        // course_id: string;
        course_name: string;
      };
    }
    
    // Create the properly typed object
    const apiData: StudyGuideApiData = {
      topic: request.topic,
      module_id: request.moduleId,
      course_id: request.courseId,
      detail_level: request.detailLevel || 'medium',
      format: request.format || 'outline'
    };
    
    // Add meta data if we have courseId in additionalParams
    if (request.additionalParams?.courseId) {
      apiData.meta = {
        // course_id: request.additionalParams.courseId,
        course_name: request.additionalParams.courseName || ''
      };
    }
    
    const response = await api.post('/rag/study-guide', apiData);
    return this.convertToRAGResponse(response.data);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(`Failed to generate study guide: ${errorMessage}`);
  }
}

  /**
   * Generate a study guide in a conversation
   */
  async generateStudyGuideWithConversation(
    request: ConversationStudyGuideRequest,
    conversationId: string
  ): Promise<{ response: RAGResponse; conversationId: string }> {
    try {
      // Convert camelCase to snake_case for backend
      const apiData: StudyGuideApiData = {
        topic: request.topic,
        course_id: request.courseId,
        module_id: request.moduleId,
        detail_level: request.detailLevel || 'medium',
        format: request.format || 'outline'
      };
      
      // If we have a conversation ID, use the conversation-specific endpoint
      const url = `/conversations/${conversationId}/query`;
      
      // Add study guide query type to the request
      apiData.prompt_type = 'study_guide';
      
      const response = await api.post(url, apiData);
      const data = response.data;
      
      // Extract RAG response from the response data
      const ragResponse = this.convertToRAGResponse({
        answer: data.assistant_message.content,
        citations: data.assistant_message.metadata?.citations || [],
        context: data.context || [],
        meta: data.meta || {}
      });
      
      return {
        response: ragResponse,
        conversationId: conversationId
      };
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to generate study guide with conversation: ${errorMessage}`);
    }
  }

  /**
   * Generate practice questions
   */
  async generatePracticeQuestions(request: PracticeQuestionsRequest): Promise<RAGResponse> {
    try {
      // Convert camelCase to snake_case for backend
      const apiData = {
        topic: request.topic,
        course_id: request.courseId,
        module_id: request.moduleId,
        question_count: request.questionCount || 5,
        difficulty: request.difficulty || 'medium',
        question_types: request.questionTypes || ['multiple_choice', 'short_answer']
      };
      
      const response = await api.post('/rag/practice-questions', apiData);
      return this.convertToRAGResponse(response.data);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to generate practice questions: ${errorMessage}`);
    }
  }

  /**
   * Generate practice questions in a conversation
   */
  async generatePracticeQuestionsWithConversation(
    request: ConversationPracticeQuestionsRequest,
    conversationId: string
  ): Promise<{ response: RAGResponse; conversationId: string }> {
    try {
      // Convert camelCase to snake_case for backend
      const apiData: PracticeQuestionsApiData = {
        topic: request.topic,
        course_id: request.courseId,
        module_id: request.moduleId,
        question_count: request.questionCount || 5,
        difficulty: request.difficulty || 'medium',
        question_types: request.questionTypes || ['multiple_choice', 'short_answer']
      };
      
      // If we have a conversation ID, use the conversation-specific endpoint
      const url = `/conversations/${conversationId}/query`;
      
      // Add practice questions query type to the request
      apiData.prompt_type = 'practice_questions';
      
      const response = await api.post(url, apiData);
      const data = response.data;
      
      // Extract RAG response from the response data
      const ragResponse = this.convertToRAGResponse({
        answer: data.assistant_message.content,
        citations: data.assistant_message.metadata?.citations || [],
        context: data.context || [],
        meta: data.meta || {}
      });
      
      return {
        response: ragResponse,
        conversationId: conversationId
      };
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to generate practice questions with conversation: ${errorMessage}`);
    }
  }

  /**
   * Analyze knowledge gaps
   */
  async analyzeKnowledgeGaps(request: QueryMessageRequest): Promise<RAGResponse> {
    try {
      // Convert camelCase to snake_case for backend
      const apiData = {
        query: request.query,
        course_id: request.courseId,
        module_id: request.moduleId,
        topic_id: request.topicId,
        additional_params: request.additionalParams
      };
      
      const response = await api.post('/rag/knowledge-gap', apiData);
      return this.convertToRAGResponse(response.data);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to analyze knowledge gaps: ${errorMessage}`);
    }
  }

  /**
   * Analyze knowledge gaps in a conversation
   */
  async analyzeKnowledgeGapsWithConversation(
    request: KnowledgeGapRequest,
    conversationId: string
  ): Promise<{ response: RAGResponse; conversationId: string }> {
    try {
      // Convert camelCase to snake_case for backend
      const apiData: Record<string, unknown> = {
        query: request.query,
        course_id: request.courseId,
        module_id: request.moduleId,
        prompt_type: 'knowledge_gap'
      };
      
      // If we have a conversation ID, use the conversation-specific endpoint
      const url = `/conversations/${conversationId}/query`;
      
      const response = await api.post(url, apiData);
      const data = response.data;
      
      // Extract RAG response from the response data
      const ragResponse = this.convertToRAGResponse({
        answer: data.assistant_message.content,
        citations: data.assistant_message.metadata?.citations || [],
        context: data.context || [],
        meta: data.meta || {}
      });
      
      return {
        response: ragResponse,
        conversationId: conversationId
      };
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to analyze knowledge gaps with conversation: ${errorMessage}`);
    }
  }

  /**
   * Helper to convert backend RAG response to frontend RAGResponse type
   */
  private convertToRAGResponse(data: BackendRAGResponse): RAGResponse {
    return {
      answer: data.answer,
      citations: data.citations,
      context: Array.isArray(data.context) 
        ? data.context.map(this.convertToRAGContext)
        : [],
      meta: data.meta
    };
  }

  /**
   * Helper to convert backend RAG context to frontend RAGContext type
   */
  private convertToRAGContext(data: BackendRAGContext): RAGContext {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      citationNumber: data.citation_number,
      materialId: data.material_id,
      sourceUrl: data.source_url,
      sourcePage: data.source_page,
      score: data.score
    };
  }
}

// Export a singleton instance
export const ragService = new RAGService();