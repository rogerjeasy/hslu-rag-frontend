// src/store/ragStore.ts
import { create } from 'zustand';
import { 
  RAGResponse,
  StudyGuideRequest,
  PracticeQuestionsRequest,
  Question,
  KnowledgeGap,
  Strength
} from '@/types/rag.types';
import { 
  QueryMessageRequest, 
  StudyGuideRequest as ConversationStudyGuideRequest,
  PracticeQuestionsRequest as ConversationPracticeQuestionsRequest,
  KnowledgeGapRequest
} from '@/types/conversation.types';
import { ragService } from '@/services/rag.service';
import { useConversationStore } from './conversationStore';

interface RAGState {
  // Data
  currentResponse: RAGResponse | null;
  studyGuideResponses: Record<string, RAGResponse>;
  practiceQuestionResponses: Record<string, RAGResponse>;
  knowledgeGapResponses: Record<string, RAGResponse>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  processQuery: (request: QueryMessageRequest) => Promise<RAGResponse>;
  processQueryWithConversation: (request: QueryMessageRequest, conversationId: string) => Promise<{ response: RAGResponse; conversationId: string }>;
  generateStudyGuide: (request: StudyGuideRequest) => Promise<RAGResponse>;
  generateStudyGuideWithConversation: (request: ConversationStudyGuideRequest, conversationId: string) => Promise<{ response: RAGResponse; conversationId: string }>;
  generatePracticeQuestions: (request: PracticeQuestionsRequest) => Promise<RAGResponse>;
  generatePracticeQuestionsWithConversation: (request: ConversationPracticeQuestionsRequest, conversationId: string) => Promise<{ response: RAGResponse; conversationId: string }>;
  analyzeKnowledgeGaps: (request: QueryMessageRequest) => Promise<RAGResponse>;
  analyzeKnowledgeGapsWithConversation: (request: KnowledgeGapRequest, conversationId: string) => Promise<{ response: RAGResponse; conversationId: string }>;
  resetError: () => void;
  setCurrentResponse: (response: RAGResponse | null) => void;
}

export const useRAGStore = create<RAGState>((set, get) => ({
  // Data
  currentResponse: null,
  studyGuideResponses: {},
  practiceQuestionResponses: {},
  knowledgeGapResponses: {},
  isLoading: false,
  error: null,
  
  // Actions
  processQuery: async (request) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await ragService.processQuery(request);
      set({ currentResponse: response, isLoading: false });
      return response;
    } catch (error) {
      console.error('Error processing RAG query:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  processQueryWithConversation: async (request, conversationId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await ragService.processQueryWithConversation(request, conversationId);
      set({ currentResponse: result.response, isLoading: false });
      
      // Fetch the conversation details using the conversation store
      await useConversationStore.getState().fetchConversation(conversationId);
      
      return result;
    } catch (error) {
      console.error('Error processing RAG query with conversation:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  generateStudyGuide: async (request) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await ragService.generateStudyGuide(request);
      
      // Store the response indexed by topic
      set((state) => ({
        currentResponse: response,
        studyGuideResponses: {
          ...state.studyGuideResponses,
          [request.topic]: response
        },
        isLoading: false
      }));
      
      return response;
    } catch (error) {
      console.error('Error generating study guide:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  generateStudyGuideWithConversation: async (request, conversationId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await ragService.generateStudyGuideWithConversation(request, conversationId);
      
      // Store the response indexed by topic
      set((state) => ({
        currentResponse: result.response,
        studyGuideResponses: {
          ...state.studyGuideResponses,
          [request.topic]: result.response
        },
        isLoading: false
      }));
      
      // Fetch the conversation details using the conversation store
      await useConversationStore.getState().fetchConversation(conversationId);
      
      return result;
    } catch (error) {
      console.error('Error generating study guide with conversation:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  generatePracticeQuestions: async (request) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await ragService.generatePracticeQuestions(request);
      
      // Store the response indexed by topic
      set((state) => ({
        currentResponse: response,
        practiceQuestionResponses: {
          ...state.practiceQuestionResponses,
          [request.topic]: response
        },
        isLoading: false
      }));
      
      return response;
    } catch (error) {
      console.error('Error generating practice questions:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  generatePracticeQuestionsWithConversation: async (request, conversationId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await ragService.generatePracticeQuestionsWithConversation(request, conversationId);
      
      // Store the response indexed by topic
      set((state) => ({
        currentResponse: result.response,
        practiceQuestionResponses: {
          ...state.practiceQuestionResponses,
          [request.topic]: result.response
        },
        isLoading: false
      }));
      
      // Fetch the conversation details using the conversation store
      await useConversationStore.getState().fetchConversation(conversationId);
      
      return result;
    } catch (error) {
      console.error('Error generating practice questions with conversation:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  analyzeKnowledgeGaps: async (request) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await ragService.analyzeKnowledgeGaps(request);
      
      // Store the response indexed by query
      set((state) => ({
        currentResponse: response,
        knowledgeGapResponses: {
          ...state.knowledgeGapResponses,
          [request.query]: response
        },
        isLoading: false
      }));
      
      return response;
    } catch (error) {
      console.error('Error analyzing knowledge gaps:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  analyzeKnowledgeGapsWithConversation: async (request, conversationId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await ragService.analyzeKnowledgeGapsWithConversation(request, conversationId);
      
      // Store the response indexed by query
      set((state) => ({
        currentResponse: result.response,
        knowledgeGapResponses: {
          ...state.knowledgeGapResponses,
          [request.query]: result.response
        },
        isLoading: false
      }));
      
      // Fetch the conversation details using the conversation store
      await useConversationStore.getState().fetchConversation(conversationId);
      
      return result;
    } catch (error) {
      console.error('Error analyzing knowledge gaps with conversation:', error);
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
  
  setCurrentResponse: (response) => {
    set({ currentResponse: response });
  }
}));