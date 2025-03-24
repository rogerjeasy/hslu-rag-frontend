import { api, handleError } from "@/helpers/api";
import {
  QuestionSet,
  QuestionSetSummary,
  CreatePracticeQuestionsRequest,
  SubmitAnswersRequest,
  SubmissionResult
} from '@/types/practice-questions';

// Base URL for all practice questions endpoints
const baseUrl = '/practice-questions';

/**
 * Service for handling practice questions related API requests
 */
export const practiceQuestionsService = {
  /**
   * Get all practice question sets
   * @param courseId Optional course ID to filter by
   * @returns List of question set summaries
   * @throws ApiError with standardized format (except for 404, which returns [])
   */
  async getQuestionSets(courseId?: string): Promise<QuestionSetSummary[]> {
    try {
      const params = courseId ? { course_id: courseId } : {};
      const response = await api.get(baseUrl, { params });
      return response.data;
    } catch (error) {
      // Convert to our standardized ApiError
      const apiError = handleError(error);
      
      // For 404, return empty array instead of throwing an error
      if (apiError.status === 404) {
        console.info(`No practice questions found${courseId ? ` for course ${courseId}` : ''} - returning empty array`);
        return [];
      }
      
      // Enhanced error messages based on status codes
      if (apiError.status === 401) {
        apiError.message = "Your session has expired. Please log in again to view your question sets.";
      } else if (apiError.status === 403) {
        apiError.message = "You don't have permission to access these question sets.";
      } else if (apiError.status >= 500) {
        apiError.message = "We're having trouble retrieving your question sets. Please try again later.";
      }
      
      throw apiError;
    }
  },

  /**
   * Get a specific practice question set by ID
   * @param questionSetId The ID of the question set to retrieve
   * @returns The complete question set with all questions
   * @throws ApiError with standardized format
   */
  async getQuestionSet(questionSetId: string): Promise<QuestionSet> {
    try {
      const response = await api.get(`${baseUrl}/${questionSetId}`);
      return response.data;
    } catch (error) {
      const apiError = handleError(error);
      
      // Add more specific messages for different error cases
      if (apiError.status === 404) {
        apiError.message = "This question set no longer exists or is not available.";
        apiError.detail = `The question set with ID "${questionSetId}" could not be found.`;
      } else if (apiError.status === 401) {
        apiError.message = "Your session has expired. Please log in again to view this question set.";
      } else if (apiError.status === 403) {
        apiError.message = "You don't have permission to access this question set.";
      } else if (apiError.status >= 500) {
        apiError.message = "We're having trouble retrieving this question set. Please try again later.";
      }
      
      throw apiError;
    }
  },

  /**
   * Create a new practice question set
   * @param data The data for creating the question set
   * @returns The created question set summary
   * @throws ApiError with standardized format
   */
  async createQuestionSet(data: CreatePracticeQuestionsRequest): Promise<{ id: string; title: string; createdAt: string }> {
    try {
      const response = await api.post(baseUrl, data);
      return response.data;
    } catch (error) {
      const apiError = handleError(error);
      
      // Enhanced error messages based on status codes
      if (apiError.status === 422) {
        apiError.message = "Invalid question set configuration. Please check your topic and question parameters.";
        // Add more details about what might be wrong
        apiError.detail = apiError.detail || "Possible issues: topic too broad, invalid difficulty level, or unsupported question types.";
      } else if (apiError.status === 401) {
        apiError.message = "Your session has expired. Please log in again to create a question set.";
      } else if (apiError.status === 403) {
        apiError.message = "You don't have permission to create question sets.";
      } else if (apiError.status === 400) {
        apiError.message = "Please provide a valid topic and course to generate questions.";
      } else if (apiError.status >= 500) {
        apiError.message = "We're having trouble creating your question set. Please try again later.";
      }
      
      throw apiError;
    }
  },

  /**
   * Delete a practice question set
   * @param questionSetId The ID of the question set to delete
   * @throws ApiError with standardized format
   */
  async deleteQuestionSet(questionSetId: string): Promise<void> {
    try {
      await api.delete(`${baseUrl}/${questionSetId}`);
    } catch (error) {
      const apiError = handleError(error);
      
      // For 404, treat as success since the resource is already gone
      if (apiError.status === 404) {
        console.info(`Question set ${questionSetId} already deleted or not found - treating as success`);
        return;
      }
      
      // Enhanced error messages with recommendations
      if (apiError.status === 401) {
        apiError.message = "Your session has expired. Please log in again to delete this question set.";
      } else if (apiError.status === 403) {
        apiError.message = "You don't have permission to delete this question set.";
      } else if (apiError.status >= 500) {
        apiError.message = "We're having trouble deleting this question set. Please try again later.";
      }
      
      throw apiError;
    }
  },

  /**
   * Update a practice question set metadata
   * @param questionSetId The ID of the question set to update
   * @param data The data to update (title, description)
   * @returns The updated question set
   * @throws ApiError with standardized format
   */
  async updateQuestionSet(
    questionSetId: string,
    data: { title?: string; description?: string }
  ): Promise<QuestionSet> {
    try {
      const response = await api.put(`${baseUrl}/${questionSetId}`, data);
      return response.data;
    } catch (error) {
      const apiError = handleError(error);
      
      // Detailed error messages for specific scenarios
      if (apiError.status === 404) {
        apiError.message = "The question set you're trying to update could not be found.";
        apiError.detail = `The question set with ID "${questionSetId}" may have been deleted or is no longer available.`;
      } else if (apiError.status === 400) {
        apiError.message = "Please provide valid information for updating the question set.";
        apiError.detail = "Title and description must be in valid format.";
      } else if (apiError.status === 401) {
        apiError.message = "Your session has expired. Please log in again to update this question set.";
      } else if (apiError.status === 403) {
        apiError.message = "You don't have permission to update this question set.";
      } else if (apiError.status >= 500) {
        apiError.message = "We're having trouble updating this question set. Please try again later.";
      }
      
      throw apiError;
    }
  },

  /**
   * Submit answers to practice questions and get results
   * @param questionSetId The ID of the question set
   * @param data The answers to submit
   * @returns The submission results with scoring
   * @throws ApiError with standardized format
   */
  async submitAnswers(
    questionSetId: string,
    data: SubmitAnswersRequest
  ): Promise<SubmissionResult> {
    try {
      const response = await api.post(`${baseUrl}/${questionSetId}/submit`, data);
      return response.data;
    } catch (error) {
      const apiError = handleError(error);
      
      // Enhanced error messaging with actionable guidance
      if (apiError.status === 400) {
        apiError.message = "There was a problem with your answers. Please make sure all required questions are answered.";
        apiError.detail = "Check that all multiple choice questions have a selected option and all text answers are filled out.";
      } else if (apiError.status === 404) {
        apiError.message = "The question set you're trying to submit answers for could not be found.";
        apiError.detail = `The question set with ID "${questionSetId}" may have been deleted or is no longer available.`;
      } else if (apiError.status === 401) {
        apiError.message = "Your session has expired. Please log in again to submit your answers.";
      } else if (apiError.status === 403) {
        apiError.message = "You don't have permission to submit answers to this question set.";
      } else if (apiError.status >= 500) {
        apiError.message = "We're having trouble submitting your answers. Please try again later.";
      }
      
      throw apiError;
    }
  }
};