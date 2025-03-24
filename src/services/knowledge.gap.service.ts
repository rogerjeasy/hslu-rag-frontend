import { api, handleError } from '@/helpers/api';
import { 
  KnowledgeAssessment, 
  KnowledgeAssessmentSummary, 
  KnowledgeGap,
  GapSeverity
} from '@/types/knowledge-gap';
// import { QueryType, Citation } from '@/types/query';

interface KnowledgeGapAnalysisRequest {
  query: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  modelId?: string;
  pastInteractionsCount?: number;
}

interface StudyPlanRequest {
  timeFrame?: string;
  hoursPerWeek?: number;
  modelId?: string;
}

class KnowledgeGapService {
  /**
   * Create a new knowledge gap assessment for a topic or question
   */
  async createKnowledgeGapAssessment(data: KnowledgeGapAnalysisRequest): Promise<{ 
    id: string;
    title: string;
    courseId: string;
    createdAt: string;
  }> {
    try {
      const response = await api.post('/knowledge-gaps', data);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to create knowledge gap assessment: ${errorMessage}`);
    }
  }

  /**
   * Get all knowledge gap assessments for the current user
   * Optionally filter by course ID
   */
  async getKnowledgeGapAssessments(courseId?: string): Promise<KnowledgeAssessmentSummary[]> {
    try {
      const url = courseId 
        ? `/knowledge-gaps?course_id=${courseId}` 
        : '/knowledge-gaps';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch knowledge gap assessments: ${errorMessage}`);
    }
  }

  /**
   * Get a specific knowledge gap assessment by ID with all details
   */
  async getKnowledgeGapAssessment(assessmentId: string): Promise<KnowledgeAssessment> {
    try {
      const response = await api.get(`/knowledge-gaps/${assessmentId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch knowledge gap assessment: ${errorMessage}`);
    }
  }

  /**
   * Delete a knowledge gap assessment
   */
  async deleteKnowledgeGapAssessment(assessmentId: string): Promise<void> {
    try {
      await api.delete(`/knowledge-gaps/${assessmentId}`);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete knowledge gap assessment: ${errorMessage}`);
    }
  }

  /**
   * Generate a personalized study plan based on knowledge gaps
   */
  async generateStudyPlan(
    assessmentId: string, 
    options: StudyPlanRequest = {}
  ): Promise<{
    assessment_id: string;
    study_plan: string;
    time_frame: string;
    hours_per_week: number;
  }> {
    try {
      const response = await api.post(
        `/knowledge-gaps/${assessmentId}/study-plan`, 
        options
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to generate study plan: ${errorMessage}`);
    }
  }

  /**
   * Start a new knowledge gap analysis conversation
   * This is a helper method that wraps the conversation service functionality
   * and creates a knowledge gap assessment in one step
   */
  async startKnowledgeGapAnalysis(
    query: string,
    courseId: string,
    pastInteractionsCount: number = 10,
    moduleId?: string,
    topicId?: string,
    modelId?: string
  ): Promise<KnowledgeAssessment> {
    try {
      const data: KnowledgeGapAnalysisRequest = {
        query,
        courseId,
        moduleId,
        topicId,
        pastInteractionsCount,
        modelId
      };

      // Create the knowledge gap assessment
      const result = await this.createKnowledgeGapAssessment(data);

      // Fetch the complete assessment
      return this.getKnowledgeGapAssessment(result.id);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to start knowledge gap analysis: ${errorMessage}`);
    }
  }

  /**
   * Get knowledge gaps filtered by severity
   * Helper method to extract gaps from an assessment based on severity
   */
  getGapsBySeverity(assessment: KnowledgeAssessment, severity?: GapSeverity): KnowledgeGap[] {
    if (!severity) {
      return assessment.gaps;
    }
    
    return assessment.gaps.filter(gap => gap.severity === severity);
  }

  /**
   * Helper method to get the highest severity gap in an assessment
   */
  getHighestSeverityGap(assessment: KnowledgeAssessment): KnowledgeGap | null {
    // Check for high severity gaps first
    const highSeverityGaps = this.getGapsBySeverity(assessment, GapSeverity.HIGH);
    if (highSeverityGaps.length > 0) {
      return highSeverityGaps[0];
    }
    
    // Then check for medium severity gaps
    const mediumSeverityGaps = this.getGapsBySeverity(assessment, GapSeverity.MEDIUM);
    if (mediumSeverityGaps.length > 0) {
      return mediumSeverityGaps[0];
    }
    
    // Finally check for low severity gaps
    const lowSeverityGaps = this.getGapsBySeverity(assessment, GapSeverity.LOW);
    if (lowSeverityGaps.length > 0) {
      return lowSeverityGaps[0];
    }
    
    // No gaps found
    return null;
  }
}

// Export a singleton instance
export const knowledgeGapService = new KnowledgeGapService();