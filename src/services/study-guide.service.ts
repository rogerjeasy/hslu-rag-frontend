// src/services/study-guide.service.ts
import { api, handleError } from '@/helpers/api';
import { StudyGuideSummary, DeleteResponse, DeleteAllResponse, StudyGuideResponse } from '@/types/study-guide.types';

class StudyGuideService {
  /**
   * Fetch all study guides for the current user
   */
  async getStudyGuides(limit: number = 10): Promise<StudyGuideSummary[]> {
    try {
      const response = await api.get(`/content/study-guides?limit=${limit}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch study guides: ${errorMessage}`);
    }
  }

  /**
   * Fetch a specific study guide by ID
   */
  async getStudyGuide(guideId: string): Promise<StudyGuideResponse> {
    try {
      const response = await api.get(`/content/study-guides/${guideId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch study guide: ${errorMessage}`);
    }
  }

  /**
   * Delete a specific study guide by ID
   */
  async deleteStudyGuide(guideId: string): Promise<DeleteResponse> {
    try {
      const response = await api.delete(`/content/study-guides/${guideId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete study guide: ${errorMessage}`);
    }
  }

  /**
   * Delete all user content (study guides, practice questions, knowledge gaps)
   */
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
export const studyGuideService = new StudyGuideService();