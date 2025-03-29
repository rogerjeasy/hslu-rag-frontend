// src/services/content.service.ts
import { api, handleError } from '@/helpers/api';
import { 
  StudyGuideSummary, 
  DeleteResponse,
  DeleteAllResponse
} from '@/types/study-guide.types';
import { RAGResponse, KnowledgeGapResponse } from '@/types/rag.types';
import { PracticeQuestionsSummary } from '@/services/practice-questions.service';
import { KnowledgeGapSummary } from '@/services/knowledge-gap.service';

/**
 * Combined service for handling all content-related operations
 * Includes study guides, practice questions, and knowledge gap analyses
 */
class ContentService {
  // Study Guide Methods
  async getStudyGuides(limit: number = 10): Promise<StudyGuideSummary[]> {
    try {
      const response = await api.get(`/content/study-guides?limit=${limit}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch study guides: ${errorMessage}`);
    }
  }

  async getStudyGuide(guideId: string): Promise<RAGResponse> {
    try {
      const response = await api.get(`/content/study-guides/${guideId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch study guide: ${errorMessage}`);
    }
  }

  async deleteStudyGuide(guideId: string): Promise<DeleteResponse> {
    try {
      const response = await api.delete(`/content/study-guides/${guideId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete study guide: ${errorMessage}`);
    }
  }

  // Practice Questions Methods
  async getPracticeQuestionSets(limit: number = 10): Promise<PracticeQuestionsSummary[]> {
    try {
      const response = await api.get(`/content/practice-questions?limit=${limit}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch practice question sets: ${errorMessage}`);
    }
  }

  async getPracticeQuestionSet(questionSetId: string): Promise<RAGResponse> {
    try {
      const response = await api.get(`/content/practice-questions/${questionSetId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch practice question set: ${errorMessage}`);
    }
  }

  async deletePracticeQuestionSet(questionSetId: string): Promise<DeleteResponse> {
    try {
      const response = await api.delete(`/content/practice-questions/${questionSetId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete practice question set: ${errorMessage}`);
    }
  }

  // Knowledge Gap Methods
  async getKnowledgeGapAnalyses(limit: number = 10): Promise<KnowledgeGapSummary[]> {
    try {
      const response = await api.get(`/content/knowledge-gaps?limit=${limit}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch knowledge gap analyses: ${errorMessage}`);
    }
  }

  async getKnowledgeGapAnalysis(analysisId: string): Promise<KnowledgeGapResponse> {
    try {
      const response = await api.get(`/content/knowledge-gaps/${analysisId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch knowledge gap analysis: ${errorMessage}`);
    }
  }

  async deleteKnowledgeGapAnalysis(analysisId: string): Promise<DeleteResponse> {
    try {
      const response = await api.delete(`/content/knowledge-gaps/${analysisId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete knowledge gap analysis: ${errorMessage}`);
    }
  }

  // General Content Methods
  async deleteAllUserContent(): Promise<DeleteAllResponse> {
    try {
      const response = await api.delete('/content/user-content');
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete all user content: ${errorMessage}`);
    }
  }
}

// Export a singleton instance
export const contentService = new ContentService();