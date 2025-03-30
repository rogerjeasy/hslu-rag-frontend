// // src/store/practiceQuestionsStore.ts
// import { create } from 'zustand';
// import { 
//   DeleteResponse, 
// } from '@/types/study-guide.types';
// import { practiceQuestionsService, PracticeQuestionsSummary } from '@/services/practice-questions.service';
// import { RAGResponse } from '@/types/rag.types';

// interface PracticeQuestionsState {
//   // Data
//   questionSets: PracticeQuestionsSummary[];
//   filteredQuestionSets: PracticeQuestionsSummary[];
//   currentQuestionSet: RAGResponse | null;
//   isLoading: boolean;
//   error: string | null;
  
//   // Filter state
//   searchTerm: string;
//   selectedCourse: string | null;
//   selectedDifficulty: string | null;
  
//   // Filter actions
//   setSearchTerm: (term: string) => void;
//   setSelectedCourse: (courseId: string | null) => void;
//   setSelectedDifficulty: (difficulty: string | null) => void;
//   applyFilters: () => void;
//   resetFilters: () => void;
  
//   // Data actions
//   fetchQuestionSets: (limit?: number) => Promise<void>;
//   getQuestionSet: (id: string) => Promise<RAGResponse>;
//   deleteQuestionSet: (id: string) => Promise<DeleteResponse>;
//   resetError: () => void;
//   setCurrentQuestionSet: (questionSet: RAGResponse | null) => void;
// }

// export const usePracticeQuestionsStore = create<PracticeQuestionsState>((set, get) => ({
//   // Initial state
//   questionSets: [],
//   filteredQuestionSets: [],
//   currentQuestionSet: null,
//   isLoading: false,
//   error: null,
//   searchTerm: '',
//   selectedCourse: null,
//   selectedDifficulty: null,
  
//   // Filter setters
//   setSearchTerm: (term) => {
//     set({ searchTerm: term });
//     get().applyFilters();
//   },
  
//   setSelectedCourse: (courseId) => {
//     set({ selectedCourse: courseId });
//     get().applyFilters();
//   },
  
//   setSelectedDifficulty: (difficulty) => {
//     set({ selectedDifficulty: difficulty });
//     get().applyFilters();
//   },
  
//   // Filter actions
//   applyFilters: () => {
//     const { questionSets, searchTerm, selectedCourse, selectedDifficulty } = get();
//     let result = [...questionSets];
    
//     // Apply search filter
//     if (searchTerm) {
//       const lowerSearchTerm = searchTerm.toLowerCase();
//       result = result.filter(set => 
//         set.topic.toLowerCase().includes(lowerSearchTerm)
//       );
//     }
    
//     // Apply course filter
//     if (selectedCourse) {
//       result = result.filter(set => set.courseId === selectedCourse);
//     }
    
//     // Apply difficulty filter
//     if (selectedDifficulty) {
//       result = result.filter(set => set.difficulty === selectedDifficulty);
//     }
    
//     set({ filteredQuestionSets: result });
//   },
  
//   resetFilters: () => {
//     set({ 
//       searchTerm: '',
//       selectedCourse: null,
//       selectedDifficulty: null,
//       filteredQuestionSets: get().questionSets
//     });
//   },
  
//   // Data actions
//   fetchQuestionSets: async (limit = 50) => {
//     set({ isLoading: true, error: null });
    
//     try {
//       const questionSets = await practiceQuestionsService.getPracticeQuestionSets(limit);
//       set({ 
//         questionSets, 
//         filteredQuestionSets: questionSets, 
//         isLoading: false 
//       });
//     } catch (error) {
//       console.error('Error fetching practice question sets:', error);
//       set({ 
//         error: error instanceof Error ? error.message : 'An unknown error occurred', 
//         isLoading: false 
//       });
//     }
//   },
  
//   getQuestionSet: async (id) => {
//     set({ isLoading: true, error: null });
    
//     try {
//       const questionSet = await practiceQuestionsService.getPracticeQuestionSet(id);
//       set({ currentQuestionSet: questionSet, isLoading: false });
//       return questionSet;
//     } catch (error) {
//       console.error('Error fetching practice question set:', error);
//       set({ 
//         error: error instanceof Error ? error.message : 'An unknown error occurred', 
//         isLoading: false 
//       });
//       throw error;
//     }
//   },
  
//   deleteQuestionSet: async (id) => {
//     set({ isLoading: true, error: null });
    
//     try {
//       const response = await practiceQuestionsService.deletePracticeQuestionSet(id);
      
//       if (response.success) {
//         // Update the question sets list
//         set(state => ({
//           questionSets: state.questionSets.filter(set => set.id !== id),
//           currentQuestionSet: state.currentQuestionSet && 'meta' in state.currentQuestionSet && 
//             state.currentQuestionSet.meta?.document_id === id ? null : state.currentQuestionSet
//         }));
        
//         // Re-apply filters
//         get().applyFilters();
//       }
      
//       set({ isLoading: false });
//       return response;
//     } catch (error) {
//       console.error('Error deleting practice question set:', error);
//       set({ 
//         error: error instanceof Error ? error.message : 'An unknown error occurred', 
//         isLoading: false 
//       });
//       throw error;
//     }
//   },
  
//   resetError: () => {
//     set({ error: null });
//   },
  
//   setCurrentQuestionSet: (questionSet) => {
//     set({ currentQuestionSet: questionSet });
//   }
// }));