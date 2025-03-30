// src/store/studyGuideStore.ts
import { create } from 'zustand';
import { 
  StudyGuideSummary, 
  DeleteResponse, 
  DeleteAllResponse,
  DetailLevel,
  StudyGuideFormat,
  StudyGuideResponse
} from '@/types/study-guide.types';
import { studyGuideService } from '@/services/study-guide.service';
import { useRAGStore } from '@/store/ragStore';
import { RAGResponse } from '@/types/rag.types';

interface StudyGuideState {
  // Data
  studyGuides: StudyGuideSummary[];
  filteredGuides: StudyGuideSummary[];
  currentStudyGuide: StudyGuideResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Filter state
  searchTerm: string;
  selectedCourse: string | null;
  selectedFormat: StudyGuideFormat | null;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
  setSelectedFormat: (format: StudyGuideFormat | null) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  
  // Data actions
  fetchStudyGuides: (limit?: number) => Promise<void>;
  getStudyGuide: (id: string) => Promise<StudyGuideResponse>;
  createGuide: (
    topic: string,
    courseId: string,
    detailLevel: DetailLevel,
    format: StudyGuideFormat,
    includePracticeQuestions?: boolean,
    moduleId?: string
  ) => Promise<RAGResponse>;
  deleteStudyGuide: (id: string) => Promise<DeleteResponse>;
  deleteAllContent: () => Promise<DeleteAllResponse>;
  resetError: () => void;
  setCurrentStudyGuide: (guide: StudyGuideResponse | null) => void;
}

export const useStudyGuideStore = create<StudyGuideState>((set, get) => ({
  // Initial state
  studyGuides: [],
  filteredGuides: [],
  currentStudyGuide: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedCourse: null,
  selectedFormat: null,
  
  // Filter setters
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },
  
  setSelectedCourse: (courseId) => {
    set({ selectedCourse: courseId });
    get().applyFilters();
  },
  
  setSelectedFormat: (format) => {
    set({ selectedFormat: format });
    get().applyFilters();
  },
  
  applyFilters: () => {
    const { studyGuides, searchTerm, selectedCourse, selectedFormat } = get();
    let result = [...studyGuides];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(guide => 
        guide.topic.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (selectedCourse) {
      result = result.filter(guide => guide.courseId === selectedCourse);
    }
    
    if (selectedFormat) {
      result = result.filter(guide => guide.format === selectedFormat);
    }
    
    set({ filteredGuides: result });
  },
  
  resetFilters: () => {
    set({ 
      searchTerm: '',
      selectedCourse: null,
      selectedFormat: null,
      filteredGuides: get().studyGuides
    });
  },
  
  // Data actions
  fetchStudyGuides: async (limit = 50) => {
    set({ isLoading: true, error: null });
    
    try {
      const studyGuides = await studyGuideService.getStudyGuides(limit);
      set({ 
        studyGuides, 
        filteredGuides: studyGuides, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching study guides:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  getStudyGuide: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const studyGuide = await studyGuideService.getStudyGuide(id);
      set({ currentStudyGuide: studyGuide, isLoading: false });
      return studyGuide;
    } catch (error) {
      console.error('Error fetching study guide:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  createGuide: async (
    topic,
    courseId,
    detailLevel,
    format,
    includePracticeQuestions = false,
    moduleId
  ) => {
    set({ isLoading: true, error: null });
    
    try {
      const studyGuideRequest = {
        topic,
        moduleId,
        detailLevel,
        format,
        additionalParams: {
          courseId,
          requestId: `guide-${Date.now()}`,
          includePracticeQuestions: includePracticeQuestions
        }
      };
      
      const { generateStudyGuide } = useRAGStore.getState();
      const response = await generateStudyGuide(studyGuideRequest);
      
      await get().fetchStudyGuides();
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      console.error('Error creating study guide:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteStudyGuide: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await studyGuideService.deleteStudyGuide(id);
      
      if (response.success) {
        // Update the study guides list
        set(state => ({
          studyGuides: state.studyGuides.filter(guide => guide.id !== id),
          currentStudyGuide: state.currentStudyGuide && 'meta' in state.currentStudyGuide && 
            state.currentStudyGuide.meta?.document_id === id ? null : state.currentStudyGuide
        }));
        
        // Re-apply filters
        get().applyFilters();
      }
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      console.error('Error deleting study guide:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteAllContent: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await studyGuideService.deleteAllUserContent();
      
      if (response.success) {
        // Clear all study guides
        set({
          studyGuides: [],
          filteredGuides: [],
          currentStudyGuide: null
        });
      }
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      console.error('Error deleting all content:', error);
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
  
  setCurrentStudyGuide: (guide) => {
    set({ currentStudyGuide: guide });
  }
}));