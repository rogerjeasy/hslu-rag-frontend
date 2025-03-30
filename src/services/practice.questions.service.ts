// import { api, handleError } from '@/helpers/api';
// import { 
//   QuestionSet,
//   QuestionSetSummary,
//   QuestionType,
//   DifficultyLevel,
//   Question
// } from '@/types/practice-questions-old';

// /**
//  * Request to create practice questions
//  */
// interface PracticeQuestionsRequest {
//   topic: string;
//   courseId: string;
//   moduleId?: string;
//   topicId?: string;
//   questionCount?: number;
//   difficulty?: DifficultyLevel;
//   questionTypes?: QuestionType[];
//   modelId?: string;
// }

// /**
//  * Updates allowed for a question set
//  */
// interface QuestionSetUpdateRequest {
//   title?: string;
//   description?: string;
// }

// /**
//  * Shape of answer submission data
//  */
// interface AnswerSubmission {
//   [questionId: string]: string | boolean;
// }

// /**
//  * Result for a single question
//  */
// interface QuestionResult {
//   question_id: string;
//   is_correct: boolean;
//   correct_answer: string | boolean | null;
//   explanation?: string;
//   requires_review?: boolean;
// }

// /**
//  * Results from submitting answers
//  */
// interface SubmissionResults {
//   submission_id: string;
//   total_questions: number;
//   correct_answers: number;
//   score_percentage: number | null;
//   question_results: QuestionResult[];
// }

// /**
//  * Basic response when creating question sets
//  */
// interface CreateQuestionResponse {
//   id: string;
//   title: string;
//   courseId: string;
//   createdAt: string;
// }

// class PracticeQuestionsService {
//   /**
//    * Create a new set of practice questions
//    */
//   async createPracticeQuestions(data: PracticeQuestionsRequest): Promise<CreateQuestionResponse> {
//     try {
//       const response = await api.post('/practice-questions', data);
//       return response.data;
//     } catch (error) {
//       const errorMessage = handleError(error);
//       throw new Error(`Failed to create practice questions: ${errorMessage}`);
//     }
//   }

//   /**
//    * Get all practice question sets for the current user
//    * Optionally filter by course ID
//    */
//   async getPracticeQuestionSets(courseId?: string): Promise<QuestionSetSummary[]> {
//     try {
//       const url = courseId 
//         ? `/practice-questions?course_id=${courseId}` 
//         : '/practice-questions';
      
//       const response = await api.get(url);
//       return response.data;
//     } catch (error) {
//       const errorMessage = handleError(error);
//       throw new Error(`Failed to fetch practice question sets: ${errorMessage}`);
//     }
//   }

//   /**
//    * Get a specific practice question set by ID
//    */
//   async getPracticeQuestionSet(questionSetId: string): Promise<QuestionSet> {
//     try {
//       const response = await api.get(`/practice-questions/${questionSetId}`);
//       return response.data;
//     } catch (error) {
//       const errorMessage = handleError(error);
//       throw new Error(`Failed to fetch practice question set: ${errorMessage}`);
//     }
//   }

//   /**
//    * Update a practice question set's metadata
//    */
//   async updatePracticeQuestionSet(
//     questionSetId: string,
//     data: QuestionSetUpdateRequest
//   ): Promise<QuestionSet> {
//     try {
//       const response = await api.put(`/practice-questions/${questionSetId}`, data);
//       return response.data;
//     } catch (error) {
//       const errorMessage = handleError(error);
//       throw new Error(`Failed to update practice question set: ${errorMessage}`);
//     }
//   }

//   /**
//    * Delete a practice question set
//    */
//   async deletePracticeQuestionSet(questionSetId: string): Promise<void> {
//     try {
//       await api.delete(`/practice-questions/${questionSetId}`);
//     } catch (error) {
//       const errorMessage = handleError(error);
//       throw new Error(`Failed to delete practice question set: ${errorMessage}`);
//     }
//   }

//   /**
//    * Submit answers to questions and get results
//    */
//   async submitAnswers(
//     questionSetId: string,
//     answers: AnswerSubmission
//   ): Promise<SubmissionResults> {
//     try {
//       const response = await api.post(
//         `/practice-questions/${questionSetId}/submit`,
//         answers
//       );
//       return response.data;
//     } catch (error) {
//       const errorMessage = handleError(error);
//       throw new Error(`Failed to submit answers: ${errorMessage}`);
//     }
//   }

//   /**
//    * Start a practice questions conversation
//    * This is a convenience method that creates questions and immediately
//    * fetches the full question set
//    */
//   async startPracticeQuestions(
//     topic: string,
//     courseId: string,
//     questionCount: number = 5,
//     difficulty: DifficultyLevel = DifficultyLevel.MEDIUM,
//     questionTypes: QuestionType[] = [QuestionType.MULTIPLE_CHOICE, QuestionType.SHORT_ANSWER],
//     moduleId?: string,
//     topicId?: string
//   ): Promise<QuestionSet> {
//     try {
//       const data: PracticeQuestionsRequest = {
//         topic,
//         courseId,
//         moduleId,
//         topicId,
//         questionCount,
//         difficulty,
//         questionTypes
//       };

//       // Create the question set
//       const result = await this.createPracticeQuestions(data);

//       // Fetch the complete question set
//       return this.getPracticeQuestionSet(result.id);
//     } catch (error) {
//       const errorMessage = handleError(error);
//       throw new Error(`Failed to start practice questions: ${errorMessage}`);
//     }
//   }

//   /**
//    * Helper method to filter questions by type
//    */
//   filterQuestionsByType(questionSet: QuestionSet, type: QuestionType): Question[] {
//     return questionSet.questions.filter(question => question.type === type);
//   }

//   /**
//    * Helper method to filter questions by difficulty
//    */
//   filterQuestionsByDifficulty(questionSet: QuestionSet, difficulty: DifficultyLevel): Question[] {
//     return questionSet.questions.filter(question => question.difficulty === difficulty);
//   }

//   /**
//    * Helper method to calculate current score for a question set
//    * based on previous submission results
//    */
//   calculateScore(results: SubmissionResults): { score: number; percentage: number } {
//     const scoredQuestions = results.question_results.filter(q => !q.requires_review);
//     if (scoredQuestions.length === 0) {
//       return { score: 0, percentage: 0 };
//     }

//     const correctCount = scoredQuestions.filter(q => q.is_correct).length;
//     return {
//       score: correctCount,
//       percentage: (correctCount / scoredQuestions.length) * 100
//     };
//   }
// }

// // Export a singleton instance
// export const practiceQuestionsService = new PracticeQuestionsService();