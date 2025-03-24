import { api, handleError } from '@/helpers/api';
import { Citation } from '@/types';
import { 
  StudyGuide,
  StudyGuideSummary,
  StudyGuideCreateResponse,
  DetailLevel,
  StudyGuideFormat,
  StudyGuideSection
} from '@/types/study-guide';

/**
 * Request to create a study guide
 */
interface StudyGuideRequest {
  topic: string;
  courseId: string;
  moduleId?: string;
  topicId?: string;
  detailLevel?: DetailLevel;
  format?: StudyGuideFormat;
  includePracticeQuestions?: boolean;
  modelId?: string;
}

/**
 * Updates allowed for a study guide
 */
interface StudyGuideUpdateRequest {
  title?: string;
  description?: string;
}

class StudyGuideService {
  /**
   * Create a new study guide
   */
  async createStudyGuide(data: StudyGuideRequest): Promise<StudyGuideCreateResponse> {
    try {
      const response = await api.post('/study-guides', data);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to create study guide: ${errorMessage}`);
    }
  }

  /**
   * Get all study guides for the current user
   * Optionally filter by course ID
   */
  async getStudyGuides(courseId?: string): Promise<StudyGuideSummary[]> {
    try {
      const url = courseId 
        ? `/study-guides?course_id=${courseId}` 
        : '/study-guides';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch study guides: ${errorMessage}`);
    }
  }

  /**
   * Get a specific study guide by ID
   */
  async getStudyGuide(guideId: string): Promise<StudyGuide> {
    try {
      const response = await api.get(`/study-guides/${guideId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch study guide: ${errorMessage}`);
    }
  }

  /**
   * Update a study guide's metadata
   */
  async updateStudyGuide(
    guideId: string,
    data: StudyGuideUpdateRequest
  ): Promise<StudyGuide> {
    try {
      const response = await api.put(`/study-guides/${guideId}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to update study guide: ${errorMessage}`);
    }
  }

  /**
   * Delete a study guide
   */
  async deleteStudyGuide(guideId: string): Promise<void> {
    try {
      await api.delete(`/study-guides/${guideId}`);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete study guide: ${errorMessage}`);
    }
  }

  /**
   * Start a study guide session
   * This is a convenience method that creates a guide and immediately
   * fetches the full content
   */
  async startStudyGuide(
    topic: string,
    courseId: string,
    detailLevel: DetailLevel = DetailLevel.MEDIUM,
    format: StudyGuideFormat = StudyGuideFormat.OUTLINE,
    includePracticeQuestions: boolean = false,
    moduleId?: string,
    topicId?: string
  ): Promise<StudyGuide> {
    try {
      const data: StudyGuideRequest = {
        topic,
        courseId,
        moduleId,
        topicId,
        detailLevel,
        format,
        includePracticeQuestions
      };

      // Create the study guide
      const result = await this.createStudyGuide(data);

      // Fetch the complete study guide
      return this.getStudyGuide(result.id);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to start study guide: ${errorMessage}`);
    }
  }

  /**
   * Find specific sections within a study guide by title keywords
   * Useful for locating relevant information in larger guides
   */
  findSectionsByKeywords(studyGuide: StudyGuide, keywords: string[]): StudyGuideSection[] {
    const matchingSections: StudyGuideSection[] = [];
    
    // Recursive function to search through sections and subsections
    const searchSections = (sections: StudyGuideSection[]) => {
      for (const section of sections) {
        // Check if any keyword is in the section title
        const titleMatches = keywords.some(keyword => 
          section.title.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // Check if any keyword is in the section content
        const contentMatches = keywords.some(keyword => 
          section.content.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (titleMatches || contentMatches) {
          matchingSections.push(section);
        }
        
        // Recursively search subsections
        if (section.subSections && section.subSections.length > 0) {
          searchSections(section.subSections);
        }
      }
    };
    
    // Start the search from the top-level sections
    searchSections(studyGuide.sections);
    
    return matchingSections;
  }

  /**
   * Extract a flat list of all citations used in the study guide
   */
  getAllCitations(studyGuide: StudyGuide): Array<{ section: string; citations: Citation[] }> {
    const citationsList: Array<{ section: string; citations: Citation[] }> = [];
    
    // Top-level citations
    if (studyGuide.citations && studyGuide.citations.length > 0) {
      citationsList.push({
        section: 'General',
        citations: studyGuide.citations
      });
    }
    
    // Recursive function to get citations from sections
    const getCitationsFromSections = (sections: StudyGuideSection[], parentTitle: string = '') => {
      for (const section of sections) {
        const sectionTitle = parentTitle 
          ? `${parentTitle} > ${section.title}` 
          : section.title;
        
        if (section.citations && section.citations.length > 0) {
          citationsList.push({
            section: sectionTitle,
            citations: section.citations
          });
        }
        
        // Recursively get citations from subsections
        if (section.subSections && section.subSections.length > 0) {
          getCitationsFromSections(section.subSections, sectionTitle);
        }
      }
    };
    
    // Start getting citations from the top-level sections
    getCitationsFromSections(studyGuide.sections);
    
    return citationsList;
  }
}

// Export a singleton instance
export const studyGuideService = new StudyGuideService();