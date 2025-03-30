// src/services/knowledge-gap.service.ts
import { api, handleError } from '@/helpers/api';
import { DeleteResponse } from '@/types/study-guide.types';
import { KnowledgeGapResponse } from '@/types/rag.types';

export interface KnowledgeGapSummary {
  id: string;
  topic: string;
  courseId?: string;
  moduleId?: string;
  createdAt: number;
  query: string;
  gapCount: number;
  strengthCount: number;
}

class KnowledgeGapService {
  /**
   * Fetch all knowledge gap analyses for the current user
   */
  async getKnowledgeGapAnalyses(limit: number = 10): Promise<KnowledgeGapSummary[]> {
    try {
      const response = await api.get(`/content/knowledge-gaps?limit=${limit}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch knowledge gap analyses: ${errorMessage}`);
    }
  }

  /**
   * Fetch a specific knowledge gap analysis by ID
   */
  async getKnowledgeGapAnalysis(analysisId: string): Promise<KnowledgeGapResponse> {
    try {
      const response = await api.get(`/content/knowledge-gaps/${analysisId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch knowledge gap analysis: ${errorMessage}`);
    }
  }

  /**
   * Delete a specific knowledge gap analysis by ID
   */
  async deleteKnowledgeGapAnalysis(analysisId: string): Promise<DeleteResponse> {
    try {
      const response = await api.delete(`/content/knowledge-gaps/${analysisId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete knowledge gap analysis: ${errorMessage}`);
    }
  }
}

// Export a singleton instance
export const knowledgeGapService = new KnowledgeGapService();