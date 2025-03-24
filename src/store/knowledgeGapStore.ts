// src/store/knowledgeGapStore.ts
import { create } from 'zustand';
import { 
  KnowledgeAssessment, 
  KnowledgeAssessmentSummary,
  GapSeverity
} from '@/types/knowledge-gap';
import { knowledgeGapService } from '@/services/knowledge.gap.service';

interface KnowledgeGapState {
  // Data
  assessments: KnowledgeAssessmentSummary[];
  filteredAssessments: KnowledgeAssessmentSummary[];
  currentAssessment: KnowledgeAssessment | null;
  isLoading: boolean;
  error: string | null;
  
  // Filter state
  searchTerm: string;
  selectedCourse: string | null;
  selectedSeverity: GapSeverity | null;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
  setSelectedSeverity: (severity: GapSeverity | null) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  
  // Data actions
  fetchAssessments: (courseId?: string) => Promise<void>;
  getAssessment: (id: string) => Promise<KnowledgeAssessment>;
  createAssessment: (query: string, courseId: string, pastInteractionsCount?: number, moduleId?: string, topicId?: string) => Promise<KnowledgeAssessment>;
  deleteAssessment: (id: string) => Promise<void>;
  generateStudyPlan: (assessmentId: string, timeFrame?: string, hoursPerWeek?: number) => Promise<{ assessment_id: string; study_plan: string; time_frame: string; hours_per_week: number; }>;
}

export const useKnowledgeGapStore = create<KnowledgeGapState>((set, get) => ({
  // Initial state
  assessments: [],
  filteredAssessments: [],
  currentAssessment: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedCourse: null,
  selectedSeverity: null,
  
  // Filter setters
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },
  
  setSelectedCourse: (courseId) => {
    set({ selectedCourse: courseId });
    get().applyFilters();
  },
  
  setSelectedSeverity: (severity) => {
    set({ selectedSeverity: severity });
    get().applyFilters();
  },
  
  // Filter actions
  applyFilters: () => {
    const { assessments, searchTerm, selectedCourse, selectedSeverity } = get();
    let result = [...assessments];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        assessment => assessment.title.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply course filter (this is redundant if we're already fetching by course)
    if (selectedCourse) {
      result = result.filter(assessment => assessment.courseId === selectedCourse);
    }
    
    // Apply severity filter
    if (selectedSeverity && result.length > 0) {
      result = result.filter(assessment => assessment.highestSeverity === selectedSeverity);
    }
    
    set({ filteredAssessments: result });
  },
  
  resetFilters: () => {
    set({ 
      searchTerm: '',
      selectedCourse: null,
      selectedSeverity: null,
      filteredAssessments: get().assessments
    });
  },
  
  // Data actions
  fetchAssessments: async (courseId) => {
    set({ isLoading: true, error: null });
    
    try {
      const assessments = await knowledgeGapService.getKnowledgeGapAssessments(courseId);
      set({ 
        assessments, 
        filteredAssessments: assessments, 
        isLoading: false,
        selectedCourse: courseId || null
      });
    } catch (error) {
      console.error('Error fetching knowledge gap assessments:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  getAssessment: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const assessment = await knowledgeGapService.getKnowledgeGapAssessment(id);
      set({ currentAssessment: assessment, isLoading: false });
      return assessment;
    } catch (error) {
      console.error('Error fetching knowledge gap assessment:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  createAssessment: async (query, courseId, pastInteractionsCount = 10, moduleId, topicId) => {
    set({ isLoading: true, error: null });
    
    try {
      const assessment = await knowledgeGapService.startKnowledgeGapAnalysis(
        query, courseId, pastInteractionsCount, moduleId, topicId
      );
      
      // Add the new assessment to the list if we're already showing assessments for this course
      if (get().selectedCourse === courseId || !get().selectedCourse) {
        set(state => {
          // Create a summary version for the list
          const assessmentSummary: KnowledgeAssessmentSummary = {
            id: assessment.id,
            title: assessment.title,
            courseId: assessment.courseId,
            moduleId: assessment.moduleId,
            topicId: assessment.topicId,
            createdAt: assessment.createdAt,
            updatedAt: assessment.updatedAt,
            gapCount: assessment.gaps.length,
            highestSeverity: knowledgeGapService.getHighestSeverityGap(assessment)?.severity
          };
          
          const updatedAssessments = [...state.assessments, assessmentSummary];
          
          return {
            assessments: updatedAssessments,
            filteredAssessments: updatedAssessments,
            currentAssessment: assessment,
            isLoading: false
          };
        });
        
        // Re-apply any filters
        get().applyFilters();
      } else {
        set({
          currentAssessment: assessment,
          isLoading: false
        });
      }
      
      return assessment;
    } catch (error) {
      console.error('Error creating knowledge gap assessment:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteAssessment: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await knowledgeGapService.deleteKnowledgeGapAssessment(id);
      
      set(state => {
        const updatedAssessments = state.assessments.filter(
          assessment => assessment.id !== id
        );
        
        // Clear current assessment if it was the one deleted
        const currentAssessment = 
          state.currentAssessment && state.currentAssessment.id === id
            ? null
            : state.currentAssessment;
        
        return {
          assessments: updatedAssessments,
          filteredAssessments: updatedAssessments,
          currentAssessment,
          isLoading: false
        };
      });
      
      // Re-apply filters
      get().applyFilters();
      
    } catch (error) {
      console.error('Error deleting knowledge gap assessment:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  generateStudyPlan: async (assessmentId, timeFrame, hoursPerWeek) => {
    set({ isLoading: true, error: null });
    
    try {
      const options = {
        timeFrame,
        hoursPerWeek
      };
      
      const studyPlanResult = await knowledgeGapService.generateStudyPlan(assessmentId, options);
      
      // Get a reference to the current assessment first to avoid null reference errors
      const currentAssessment = get().currentAssessment;
      
      // Update the current assessment with the study plan if it's loaded
      if (currentAssessment && currentAssessment.id === assessmentId) {
        set({
          currentAssessment: { 
            ...currentAssessment, 
            recommendedStudyPlan: studyPlanResult.study_plan 
          },
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
      
      return studyPlanResult;
    } catch (error) {
      console.error('Error generating study plan:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  }
}));