// services/practiceQuestionsService.ts
import { api, handleError } from "@/helpers/api";
import { 
    PracticeQuestionSetResponse,
    PracticeQuestionsSetType,
    QuestionType,
    QuestionTypeEnum,
    transformPracticeQuestionResponse
  } from '@/types/practice-questions.types';
  
  class PracticeQuestionsService {
    private readonly API_URL = '/content';
    // Store all currently fetched questions
    private currentQuestions: Record<string, QuestionType[]> = {};
  
    // Fetch all practice question sets for a user
    async fetchPracticeQuestionSets(): Promise<PracticeQuestionsSetType[]> {
        try {
          const response = await api.get(`${this.API_URL}/practice-questions`);
          
          // If the API returns an array of the new response format, transform each item
          if (response.data && Array.isArray(response.data)) {
            if (response.data.length > 0 && 'meta' in response.data[0]) {
              // Response is in the new format, transform each item
              return response.data.map((item: PracticeQuestionSetResponse) => 
                transformPracticeQuestionResponse(item)
              );
            }
            // Response is already in the expected format
            return response.data;
          }
          
          return [];
        } catch (error) {
          console.error('Failed to fetch practice question sets:', error);
          throw error;
        }
      }
  
    // Fetch a specific practice question set by ID
    async fetchPracticeQuestionSet(id: string): Promise<PracticeQuestionSetResponse> {
        try {
          // API call returns PracticeQuestionSetResponse format
          const response = await api.get(`${this.API_URL}/practice-questions/${id}`);
          
          // Development-only logs - force immediate output
          if (process.env.NODE_ENV !== 'production') {
            console.group(`--- fetchPracticeQuestionSet(${id}) ---`);
            console.log('Raw API response:', JSON.stringify(response.data, null, 2));
            console.log('Response has meta field:', response.data && 'meta' in response.data);
            
            if (response.data) {
              console.log('Response keys:', Object.keys(response.data));
              
              if ('meta' in response.data && response.data.meta) {
                console.log('Meta keys:', Object.keys(response.data.meta));
                
                if ('questions' in response.data.meta) {
                  console.log('Questions is array:', Array.isArray(response.data.meta.questions));
                  console.log('Questions length:', Array.isArray(response.data.meta.questions) ? 
                    response.data.meta.questions.length : 'not an array');
                  
                  // Store questions in our cache
                  if (Array.isArray(response.data.meta.questions)) {
                    this.currentQuestions[id] = response.data.meta.questions;
                  }
                } else {
                  console.warn('Meta is missing questions field');
                }
              }
            }
            console.groupEnd();
          } else {
            // For production, still store the questions
            if (response.data && 
                response.data.meta && 
                Array.isArray(response.data.meta.questions)) {
              this.currentQuestions[id] = response.data.meta.questions;
            }
          }
          
          // Return the raw response data as PracticeQuestionSetResponse
          return response.data as PracticeQuestionSetResponse;
        } catch (error) {
          console.error(`Failed to fetch practice question set with ID ${id}:`, error);
          throw error;
        }
      }
      
    // Get currently cached questions for a specific set ID
    getCurrentQuestions(id: string): QuestionType[] | null {
      return this.currentQuestions[id] || null;
    }
  
    // Delete a practice question set
    async deletePracticeQuestionSet(id: string): Promise<{ success: boolean; message: string }> {
      try {
        const response = await api.delete(`${this.API_URL}/practice-questions/${id}`);
        
        // Clean up the questions from cache when deleted
        if (this.currentQuestions[id]) {
          delete this.currentQuestions[id];
        }
        
        return response.data;
        
      } catch (error) {
        console.error(`Failed to delete practice question set with ID ${id}:`, error);
        throw error;
      }
    }
  
    // Generate new practice questions
    async generatePracticeQuestions(params: {
      topic: string;
      questionCount: number;
      difficulty: string;
      questionTypes: string[];
      courseId?: string;
      moduleId?: string;
    }): Promise<PracticeQuestionsSetType> {
      try {
        const response = await api.post(`${this.API_URL}/rag/practice-questions`, params);
        
        // If the response contains questions, store them in our cache
        if (response.data && response.data.id && response.data.questions) {
          this.currentQuestions[response.data.id] = response.data.questions;
        }
        
        return response.data;
        
      } catch (error) {
        console.error('Failed to generate practice questions:', error);
        throw error;
      }
    }
  
    // Helper method to get question type icon name
    getQuestionTypeIcon(type: QuestionTypeEnum): string {
      switch (type) {
        case QuestionTypeEnum.MULTIPLE_CHOICE:
          return 'CheckSquare';
        case QuestionTypeEnum.SHORT_ANSWER:
          return 'AlignLeft';
        case QuestionTypeEnum.TRUE_FALSE:
          return 'ToggleLeft';
        case QuestionTypeEnum.FILL_IN_BLANK:
          return 'TextCursorInput';
        case QuestionTypeEnum.MATCHING:
          return 'ArrowLeftRight';
        default:
          return 'HelpCircle';
      }
    }
  
    // Helper method to get readable question type name
    getQuestionTypeName(type: QuestionTypeEnum): string {
      switch (type) {
        case QuestionTypeEnum.MULTIPLE_CHOICE:
          return 'Multiple Choice';
        case QuestionTypeEnum.SHORT_ANSWER:
          return 'Short Answer';
        case QuestionTypeEnum.TRUE_FALSE:
          return 'True/False';
        case QuestionTypeEnum.FILL_IN_BLANK:
          return 'Fill in the Blank';
        case QuestionTypeEnum.MATCHING:
          return 'Matching';
        default:
          return 'Unknown';
      }
    }
  
    // Helper method to get question difficulty color
    getDifficultyColor(difficulty: string): string {
      switch (difficulty.toLowerCase()) {
        case 'basic':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'medium':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'advanced':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  }
  
  export const practiceQuestionsService = new PracticeQuestionsService();