// services/practice-questions-responses.service.ts
import { PracticeQuestionsSetType, QuestionType, QuestionTypeEnum, DifficultyLevel } from '@/types/practice-questions-responses.types';
import { api } from '@/helpers/api';

export interface PracticeQuestionsSummary {
  id: string;
  topic: string;
  difficulty: string;
  createdAt: number;
  questionCount: number;
}

// Define the API response structure with more flexible types
interface ApiResponse {
  queryId: string;
  query: string;
  answer: string;
  context: Array<{
    id: string;
    title: string;
    content: string;
    citationNumber: number;
    materialId: string;
    sourceUrl: string;
    sourcePage: number | null;
    score: number;
  }>;
  citations: number[];
  promptType: string;
  timestamp: string;
  meta: {
    courseId: string | null;
    moduleId: string | null;
    topic: string;
    difficulty: string;
    questionCount: number;
    questions: any[]; // Use any[] first, we'll cast to the right type later
    documentId: string;
  };
}

class PracticeQuestionsResponsesService {
  private readonly baseUrl = '/content/practice-questions';

  /**
   * Fetch a list of practice question sets
   * @param limit Maximum number of sets to return
   * @returns Array of practice question set summaries
   */
  async getPracticeQuestionSets(limit: number = 10): Promise<PracticeQuestionsSummary[]> {
    try {
      const response = await api.get(`${this.baseUrl}?limit=${limit}`);
      
      const data = await response.data;
      
      // Transform API response to match our expected format
      // This assumes your API returns data in a specific format, adjust as needed
      return data.map((item: any) => ({
        id: item.id || item.queryId || item.documentId,
        topic: item.topic || item.meta?.topic || item.query || 'Untitled Practice Set',
        difficulty: item.difficulty || item.meta?.difficulty || 'medium',
        createdAt: item.createdAt || new Date(item.timestamp || Date.now()).getTime(),
        questionCount: item.questionCount || item.meta?.questionCount || (item.meta?.questions?.length || 0)
      }));
    } catch (error) {
      console.error('Error fetching practice question sets:', error);
      
      // Fallback to a single mock item for development if API is not available
      return [
        {
          id: "3b309095-b62e-4cf1-ae01-5352a78be70d",
          topic: "Data Quality",
          difficulty: "medium",
          createdAt: Date.now() - 86400000, // 1 day ago
          questionCount: 5
        }
      ];
    }
  }

  /**
   * Fetch a specific practice question set by ID
   * @param id Practice question set ID
   * @returns Complete practice question set
   */
  async getPracticeQuestionSet(id: string): Promise<PracticeQuestionsSetType> {
    try {
      console.log(`Fetching practice question set with ID: ${id}`);
      
      const response = await api.get(`${this.baseUrl}/${id}`);
      
      const data: ApiResponse = await response.data;
      console.log("Received API response:", data);
      
      // Process questions to ensure they match our expected types
      const processedQuestions: QuestionType[] = data.meta.questions.map(q => {
        // Create the appropriate question type based on the type field
        switch(q.type) {
          case 'multiple_choice':
            return {
              id: q.id,
              text: q.text,
              type: q.type,
              difficulty: q.difficulty,
              explanation: q.explanation,
              citations: q.citations,
              options: q.options,
            } as QuestionType;
          case 'short_answer':
            return {
              id: q.id,
              text: q.text,
              type: q.type,
              difficulty: q.difficulty,
              explanation: q.explanation,
              citations: q.citations,
              sampleAnswer: q.sampleAnswer,
            } as QuestionType;
          case 'true_false':
            // Create a copy of the question to avoid mutating the original
            const trueFalseQuestion = {
              id: q.id,
              text: q.text,
              type: q.type as 'true_false',
              difficulty: q.difficulty,
              explanation: q.explanation,
              citations: q.citations,
              // Ensure options exist, if not, create default options
              options: Array.isArray(q.options) && q.options.length > 0 
                ? q.options 
                : [
                    { id: 'true', text: 'True', isCorrect: false },
                    { id: 'false', text: 'False', isCorrect: false }
                  ]
            };
            
            // If we have a way to determine the correct answer, we can set it here
            // For example, if there's a correctAnswer field in the API response
            if (q.correctAnswer) {
              trueFalseQuestion.options = trueFalseQuestion.options.map((option: { id: string; text: string; isCorrect: boolean }) => ({
                ...option,
                isCorrect: option.id === q.correctAnswer
              }));
            }
            
            return trueFalseQuestion as QuestionType;
          case 'fill_in_blank':
            return {
              id: q.id,
              text: q.text,
              type: q.type,
              difficulty: q.difficulty,
              explanation: q.explanation,
              citations: q.citations,
              blanks: q.blanks || [],
            } as QuestionType;
          case 'matching':
            return {
              id: q.id,
              text: q.text,
              type: q.type,
              difficulty: q.difficulty,
              explanation: q.explanation,
              citations: q.citations,
              pairs: q.pairs || [],
            } as QuestionType;
          default:
            console.warn(`Unknown question type: ${q.type}`);
            return {
              id: q.id,
              text: q.text,
              type: q.type,
              difficulty: q.difficulty,
              explanation: q.explanation,
              citations: q.citations,
            } as QuestionType;
        }
      });
      
      // Transform the API response to match our application's data structure
      const practiceSet: PracticeQuestionsSetType = {
        id: data.queryId,
        topic: data.meta.topic,
        difficulty: data.meta.difficulty,
        questionCount: data.meta.questionCount,
        courseId: data.meta.courseId || undefined,
        moduleId: data.meta.moduleId || undefined,
        createdAt: new Date(data.timestamp).getTime(),
        answer: data.answer,
        questions: processedQuestions,
        citations: data.citations,
        context: data.context
      };
      
      console.log("Transformed practice set data:", practiceSet);
      return practiceSet;
    } catch (error) {
      console.error(`Error fetching practice question set ${id}:`, error);
      throw error;
    }
  }

  /**
   * Submit user answers for a practice question set
   * @param questionSetId ID of the practice question set
   * @param answers User answers to the questions
   * @returns Score and feedback
   */
  async submitAnswers(
    questionSetId: string, 
    answers: Record<string, string | string[] | Record<string, string>>
  ): Promise<{
    score: number;
    correctCount: number;
    totalCount: number;
    feedback: Record<string, { isCorrect: boolean; explanation: string }>;
  }> {
    try {
      console.log(`Submitting answers for question set ${questionSetId}:`, answers);
      
      const response = await fetch(`${this.baseUrl}/${questionSetId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit answers: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting answers:', error);
      
      // Fallback mock response for development
      return {
        score: 80,
        correctCount: 4,
        totalCount: 5,
        feedback: {
          q1: { isCorrect: true, explanation: "Correct! Accuracy is a primary characteristic of high-quality data." },
          q2: { isCorrect: true, explanation: "Your answer correctly identifies the key points about reliability and decision-making." },
          q3: { isCorrect: true, explanation: "Correct! Data cleansing is a method to improve data quality, not assess it." },
          q4: { isCorrect: true, explanation: "Your answer correctly explains the concept of timeliness in data quality." },
          q5: { isCorrect: false, explanation: "The correct answer is Lecture 01, not Lecture 03." }
        }
      };
    }
  }
}

// Export a singleton instance
export const practiceQuestionsService = new PracticeQuestionsResponsesService();