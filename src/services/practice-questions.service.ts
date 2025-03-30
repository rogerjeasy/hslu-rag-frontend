// src/services/practice-questions.service.ts
import { api, handleError } from '@/helpers/api';
import { DeleteResponse } from '@/types/study-guide.types';
import { RAGResponse } from '@/types/rag.types';

export interface PracticeQuestionsSummary {
  id: string;
  topic: string;
  courseId?: string;
  moduleId?: string;
  createdAt: number;
  difficulty: string;
  questionCount: number;
}

class PracticeQuestionsService {
  /**
   * Fetch all practice question sets for the current user
   */
  async getPracticeQuestionSets(limit: number = 10): Promise<PracticeQuestionsSummary[]> {
    try {
      const response = await api.get(`/content/practice-questions?limit=${limit}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch practice question sets: ${errorMessage}`);
    }
  }

  /**
   * Fetch a specific practice question set by ID
   */
  async getPracticeQuestionSet(questionSetId: string): Promise<RAGResponse> {
    try {
      const response = await api.get(`/content/practice-questions/${questionSetId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch practice question set: ${errorMessage}`);
    }
  }

  /**
   * Delete a specific practice question set by ID
   */
  async deletePracticeQuestionSet(questionSetId: string): Promise<DeleteResponse> {
    try {
      const response = await api.delete(`/content/practice-questions/${questionSetId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete practice question set: ${errorMessage}`);
    }
  }
}

// Export a singleton instance
export const practiceQuestionsService = new PracticeQuestionsService();