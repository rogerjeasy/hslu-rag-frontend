// src/store/studyGuideStore.ts
import { create } from 'zustand';
import { 
  StudyGuide,
  StudyGuideSummary,
  DetailLevel,
  StudyGuideFormat,
  StudyGuideSection
} from '@/types/study-guide';
import { studyGuideService } from '@/services/study.guides.service';

interface StudyGuideState {
  // Data
  guides: StudyGuideSummary[];
  filteredGuides: StudyGuideSummary[];
  currentGuide: StudyGuide | null;
  isLoading: boolean;
  error: string | null;
  
  // Filter state
  searchTerm: string;
  selectedCourse: string | null;
  selectedFormat: StudyGuideFormat | null;
  selectedDetailLevel: DetailLevel | null;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
  setSelectedFormat: (format: StudyGuideFormat | null) => void;
  setSelectedDetailLevel: (detailLevel: DetailLevel | null) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  
  // Data actions
  fetchGuides: (courseId?: string) => Promise<void>;
  getGuide: (id: string) => Promise<StudyGuide>;
  createGuide: (
    topic: string, 
    courseId: string, 
    detailLevel?: DetailLevel,
    format?: StudyGuideFormat,
    includePracticeQuestions?: boolean,
    moduleId?: string, 
    topicId?: string
  ) => Promise<StudyGuide>;
  updateGuide: (id: string, title?: string, description?: string) => Promise<StudyGuide>;
  deleteGuide: (id: string) => Promise<void>;
  findSectionsByKeywords: (keywords: string[]) => StudyGuideSection[];
}

export const useStudyGuideStore = create<StudyGuideState>((set, get) => ({
  // Initial state
  guides: [],
  filteredGuides: [],
  currentGuide: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedCourse: null,
  selectedFormat: null,
  selectedDetailLevel: null,
  
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
  
  setSelectedDetailLevel: (detailLevel) => {
    set({ selectedDetailLevel: detailLevel });
    get().applyFilters();
  },
  
  // Filter actions
  applyFilters: () => {
    const { 
      guides, 
      searchTerm, 
      selectedCourse, 
      selectedFormat, 
      selectedDetailLevel 
    } = get();
    
    let result = [...guides];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        guide => guide.title.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply course filter (redundant if we're already fetching by course)
    if (selectedCourse) {
      result = result.filter(guide => guide.courseId === selectedCourse);
    }
    
    // Apply format filter
    if (selectedFormat) {
      result = result.filter(guide => guide.format === selectedFormat);
    }
    
    // Apply detail level filter
    if (selectedDetailLevel) {
      result = result.filter(guide => guide.detailLevel === selectedDetailLevel);
    }
    
    set({ filteredGuides: result });
  },
  
  resetFilters: () => {
    set({ 
      searchTerm: '',
      selectedCourse: null,
      selectedFormat: null,
      selectedDetailLevel: null,
      filteredGuides: get().guides
    });
  },
  
  // Data actions
  fetchGuides: async (courseId) => {
    set({ isLoading: true, error: null });
    
    try {
      const guides = await studyGuideService.getStudyGuides(courseId);
      set({ 
        guides, 
        filteredGuides: guides, 
        isLoading: false,
        selectedCourse: courseId || null
      });
    } catch (error) {
      console.error('Error fetching study guides:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  getGuide: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const guide = await studyGuideService.getStudyGuide(id);
      set({ currentGuide: guide, isLoading: false });
      return guide;
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
    detailLevel = DetailLevel.MEDIUM,
    format = StudyGuideFormat.OUTLINE,
    includePracticeQuestions = false,
    moduleId, 
    topicId
  ) => {
    set({ isLoading: true, error: null });
    
    try {
      const guide = await studyGuideService.startStudyGuide(
        topic, courseId, detailLevel, format, includePracticeQuestions, moduleId, topicId
      );
      
      // Add the new guide to the list if we're already showing guides for this course
      if (get().selectedCourse === courseId || !get().selectedCourse) {
        set(state => {
          // Create a summary version for the list
          const guideSummary: StudyGuideSummary = {
            id: guide.id,
            title: guide.title,
            courseId: guide.courseId,
            moduleId: guide.moduleId,
            topicId: guide.topicId,
            createdAt: guide.createdAt,
            updatedAt: guide.updatedAt,
            detailLevel: guide.detailLevel,
            format: guide.format,
            sectionCount: guide.sections.length
          };
          
          const updatedGuides = [...state.guides, guideSummary];
          
          return {
            guides: updatedGuides,
            filteredGuides: updatedGuides,
            currentGuide: guide,
            isLoading: false
          };
        });
        
        // Re-apply any filters
        get().applyFilters();
      } else {
        set({
          currentGuide: guide,
          isLoading: false
        });
      }
      
      return guide;
    } catch (error) {
      console.error('Error creating study guide:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateGuide: async (id, title, description) => {
    set({ isLoading: true, error: null });
    
    try {
      const updateData: { title?: string; description?: string } = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      
      const updatedGuide = await studyGuideService.updateStudyGuide(id, updateData);
      
      set(state => {
        // Update the guide in the list
        const updatedGuides = state.guides.map(guide => 
          guide.id === id 
            ? { 
                ...guide, 
                title: updatedGuide.title 
              } 
            : guide
        );
        
        // Update current guide if it's the one being edited
        const currentGuide = 
          state.currentGuide && state.currentGuide.id === id
            ? updatedGuide
            : state.currentGuide;
        
        return {
          guides: updatedGuides,
          currentGuide,
          isLoading: false
        };
      });
      
      // Re-apply filters
      get().applyFilters();
      
      return updatedGuide;
    } catch (error) {
      console.error('Error updating study guide:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteGuide: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await studyGuideService.deleteStudyGuide(id);
      
      set(state => {
        const updatedGuides = state.guides.filter(guide => guide.id !== id);
        
        // Clear current guide if it was the one deleted
        const currentGuide = 
          state.currentGuide && state.currentGuide.id === id
            ? null
            : state.currentGuide;
        
        return {
          guides: updatedGuides,
          filteredGuides: updatedGuides,
          currentGuide,
          isLoading: false
        };
      });
      
      // Re-apply filters
      get().applyFilters();
      
    } catch (error) {
      console.error('Error deleting study guide:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  findSectionsByKeywords: (keywords) => {
    const { currentGuide } = get();
    
    if (!currentGuide) {
      return [];
    }
    
    return studyGuideService.findSectionsByKeywords(currentGuide, keywords);
  }
}));