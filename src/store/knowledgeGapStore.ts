// src/store/knowledgeGapStore.ts
import { create } from 'zustand';
import { 
  DeleteResponse, 
} from '@/types/study-guide.types';
import { knowledgeGapService, KnowledgeGapSummary } from '@/services/knowledge-gap.service';
import { useRAGStore } from '@/store/ragStore';
import { KnowledgeGapResponse } from '@/types/rag.types';

interface KnowledgeGapState {
  // Data
  analyses: KnowledgeGapSummary[];
  filteredAnalyses: KnowledgeGapSummary[];
  currentAnalysis: KnowledgeGapResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Filter state
  searchTerm: string;
  selectedCourse: string | null;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  
  // Data actions
  fetchAnalyses: (limit?: number) => Promise<void>;
  getAnalysis: (id: string) => Promise<KnowledgeGapResponse>;
  deleteAnalysis: (id: string) => Promise<DeleteResponse>;
  resetError: () => void;
  setCurrentAnalysis: (analysis: KnowledgeGapResponse | null) => void;
}

export const useKnowledgeGapStore = create<KnowledgeGapState>((set, get) => ({
  // Initial state
  analyses: [],
  filteredAnalyses: [],
  currentAnalysis: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedCourse: null,
  
  // Filter setters
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },
  
  setSelectedCourse: (courseId) => {
    set({ selectedCourse: courseId });
    get().applyFilters();
  },
  
  // Filter actions
  applyFilters: () => {
    const { analyses, searchTerm, selectedCourse } = get();
    let result = [...analyses];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(analysis => 
        analysis.topic.toLowerCase().includes(lowerSearchTerm) ||
        analysis.query.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply course filter
    if (selectedCourse) {
      result = result.filter(analysis => analysis.courseId === selectedCourse);
    }
    
    set({ filteredAnalyses: result });
  },
  
  resetFilters: () => {
    set({ 
      searchTerm: '',
      selectedCourse: null,
      filteredAnalyses: get().analyses
    });
  },
  
  // Data actions
  fetchAnalyses: async (limit = 50) => {
    set({ isLoading: true, error: null });
    
    try {
      const analyses = await knowledgeGapService.getKnowledgeGapAnalyses(limit);
      set({ 
        analyses, 
        filteredAnalyses: analyses, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching knowledge gap analyses:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  getAnalysis: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const analysis = await knowledgeGapService.getKnowledgeGapAnalysis(id);
      set({ currentAnalysis: analysis, isLoading: false });
      return analysis;
    } catch (error) {
      console.error('Error fetching knowledge gap analysis:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteAnalysis: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await knowledgeGapService.deleteKnowledgeGapAnalysis(id);
      
      if (response.success) {
        // Update the analyses list
        set(state => ({
          analyses: state.analyses.filter(analysis => analysis.id !== id),
          currentAnalysis: state.currentAnalysis && 'meta' in state.currentAnalysis && 
            state.currentAnalysis.meta?.document_id === id ? null : state.currentAnalysis
        }));
        
        // Re-apply filters
        get().applyFilters();
      }
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      console.error('Error deleting knowledge gap analysis:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  resetError: () => {
    set({ error: null });
  },
  
  setCurrentAnalysis: (analysis) => {
    set({ currentAnalysis: analysis });
  }
}));