// src/store/materialStore.ts
import { create } from 'zustand';
import { 
  MaterialProcessingStatus, 
  Material, 
  MaterialUploadRequest, 
  MaterialUploadResponse 
} from '@/types/material.types';
import { materialService } from '@/services/material.service';

interface FileProgress {
  name: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
}

interface MaterialState {
  // Data
  materials: Material[];
  currentMaterial: Material | null;
  processingStatuses: Record<string, MaterialProcessingStatus>;
  isLoading: boolean;
  error: string | null;
  
  // Upload state
  uploadProgress: {
    current: number;
    total: number;
    currentFileName: string;
    isUploading: boolean;
    isSuccess: boolean;
    files: Record<string, FileProgress>;
  };
  
  // Actions
  fetchMaterials: (courseId?: string, moduleId?: string, topicId?: string, materialType?: string) => Promise<void>;
  fetchMaterial: (id: string) => Promise<Material>;
  uploadMaterial: (file: File, data: MaterialUploadRequest) => Promise<Material>;
  uploadMultipleMaterials: (files: File[], data: MaterialUploadRequest, metadata?: Record<string, { title?: string, description?: string }>) => Promise<MaterialUploadResponse[]>;
  getProcessingStatus: (materialId: string) => Promise<MaterialProcessingStatus>;
  trackProcessingStatus: (materialId: string) => Promise<void>;
  deleteMaterial: (materialId: string) => Promise<void>;
  resetUploadState: () => void;
}

export const useMaterialStore = create<MaterialState>((set, get) => ({
  // Data
  materials: [],
  currentMaterial: null,
  processingStatuses: {},
  isLoading: false,
  error: null,
  
  // Upload state
  uploadProgress: {
    current: 0,
    total: 0,
    currentFileName: '',
    isUploading: false,
    isSuccess: false,
    files: {}
  },
  
  // Actions
  fetchMaterials: async (courseId, moduleId, topicId, materialType) => {
    set({ isLoading: true, error: null });
    
    try {
      const materials = await materialService.getMaterials(courseId, moduleId, topicId, materialType);
      set({ materials, isLoading: false });
    } catch (error) {
      console.error('Error fetching materials:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  fetchMaterial: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const material = await materialService.getMaterial(id);
      set({ currentMaterial: material, isLoading: false });
      return material;
    } catch (error) {
      console.error('Error fetching material:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  uploadMaterial: async (file, data) => {
    const initialProgress: FileProgress = {
      name: file.name,
      progress: 0,
      status: 'uploading'
    };
    
    set({ 
      isLoading: true, 
      error: null,
      uploadProgress: {
        current: 1,
        total: 1,
        currentFileName: file.name,
        isUploading: true,
        isSuccess: false,
        files: {
          [file.name]: initialProgress
        }
      }
    });
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      const currentProgress = get().uploadProgress.files[file.name]?.progress || 0;
      if (currentProgress < 90) {
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            files: {
              ...state.uploadProgress.files,
              [file.name]: {
                ...state.uploadProgress.files[file.name],
                progress: currentProgress + 5
              }
            }
          }
        }));
      } else {
        clearInterval(progressInterval);
      }
    }, 300);
    
    try {
      const material = await materialService.uploadMaterial(file, data);
      
      // Clear interval if it's still running
      clearInterval(progressInterval);
      
      // Start tracking processing status
      get().trackProcessingStatus(material.id);
      
      set(state => ({
        materials: [material, ...state.materials],
        uploadProgress: {
          ...state.uploadProgress,
          isSuccess: true,
          isUploading: false,
          files: {
            ...state.uploadProgress.files,
            [file.name]: {
              name: file.name,
              progress: 100,
              status: 'completed'
            }
          }
        },
        isLoading: false
      }));
      
      return material;
    } catch (error) {
      // Clear interval if it's still running
      clearInterval(progressInterval);
      
      console.error('Error uploading material:', error);
      set((state) => ({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        uploadProgress: {
          ...state.uploadProgress,
          isUploading: false,
          isSuccess: false,
          files: {
            ...state.uploadProgress.files,
            [file.name]: {
              name: file.name,
              progress: state.uploadProgress.files[file.name]?.progress || 0,
              status: 'failed'
            }
          }
        },
        isLoading: false 
      }));
      throw error;
    }
  },
  
  uploadMultipleMaterials: async (files, data, metadata) => {
    // Initialize progress tracking for all files
    const fileProgresses: Record<string, FileProgress> = {};
    files.forEach((file, index) => {
      fileProgresses[file.name] = {
        name: file.name,
        progress: 0,
        status: index === 0 ? 'uploading' : 'pending'
      };
    });
    
    set({ 
      isLoading: true, 
      error: null,
      uploadProgress: {
        current: 0,
        total: files.length,
        currentFileName: files[0]?.name || '',
        isUploading: true,
        isSuccess: false,
        files: fileProgresses
      }
    });
    
    try {
      // We'll track all responses to return at the end
      const responses: MaterialUploadResponse[] = [];
      
      // Process files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update current file info
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            current: i,
            currentFileName: file.name,
            files: {
              ...state.uploadProgress.files,
              [file.name]: {
                ...state.uploadProgress.files[file.name],
                status: 'uploading'
              }
            }
          }
        }));
        
        // Simulate progress updates for current file
        const progressInterval = setInterval(() => {
          const currentProgress = get().uploadProgress.files[file.name]?.progress || 0;
          if (currentProgress < 90) {
            set((state) => ({
              uploadProgress: {
                ...state.uploadProgress,
                files: {
                  ...state.uploadProgress.files,
                  [file.name]: {
                    ...state.uploadProgress.files[file.name],
                    progress: currentProgress + 5
                  }
                }
              }
            }));
          } else {
            clearInterval(progressInterval);
          }
        }, 300);
        
        try {
          // Get file-specific metadata if available
          const fileMetadata = metadata?.[file.name];
          const fileData = {
            ...data,
            title: fileMetadata?.title || data.title,
            description: fileMetadata?.description || data.description
          };
          
          // Upload this file
          const response = await materialService.uploadMaterial(file, fileData);
          responses.push(response);
          
          // Mark as completed
          set((state) => ({
            uploadProgress: {
              ...state.uploadProgress,
              files: {
                ...state.uploadProgress.files,
                [file.name]: {
                  name: file.name,
                  progress: 100,
                  status: 'completed'
                }
              }
            }
          }));
          
          // Track processing status for this material
          get().trackProcessingStatus(response.id);
          
        } catch (error) {
          // Mark this file as failed but continue with others
          set((state) => ({
            uploadProgress: {
              ...state.uploadProgress,
              files: {
                ...state.uploadProgress.files,
                [file.name]: {
                  name: file.name,
                  progress: state.uploadProgress.files[file.name]?.progress || 0,
                  status: 'failed'
                }
              }
            }
          }));
          
          console.error(`Error uploading file ${file.name}:`, error);
        } finally {
          // Clear interval if it's still running
          clearInterval(progressInterval);
        }
      }
      
      // All uploads attempted
      set((state) => ({
        materials: [...responses.map(r => r as unknown as Material), ...state.materials],
        uploadProgress: {
          current: files.length,
          total: files.length,
          currentFileName: '',
          isUploading: false,
          isSuccess: responses.length > 0,
          files: state.uploadProgress.files
        },
        isLoading: false
      }));
      
      if (responses.length === 0) {
        throw new Error('All uploads failed');
      }
      
      return responses;
    } catch (error) {
      console.error('Error uploading materials:', error);
      set((state) => ({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        uploadProgress: {
          ...state.uploadProgress,
          isUploading: false,
          isSuccess: false
        },
        isLoading: false 
      }));
      throw error;
    }
  },
  
  getProcessingStatus: async (materialId) => {
    try {
      const status = await materialService.getProcessingStatus(materialId);
      
      set((state) => ({
        processingStatuses: {
          ...state.processingStatuses,
          [materialId]: status
        }
      }));
      
      return status;
    } catch (error) {
      console.error('Error getting processing status:', error);
      throw error;
    }
  },
  
  trackProcessingStatus: async (materialId) => {
    try {
      // Initial status check
      const status = await get().getProcessingStatus(materialId);
      
      // If not yet completed, poll every 5 seconds
      if (status.status === 'processing') {
        const interval = setInterval(async () => {
          try {
            const updatedStatus = await get().getProcessingStatus(materialId);
            
            if (updatedStatus.status !== 'processing' || updatedStatus.progress >= 1) {
              clearInterval(interval);
              
              // If we have the completed material, update our materials list
              if (updatedStatus.status === 'completed') {
                try {
                  const material = await materialService.getMaterial(materialId);
                  
                  set((state) => ({
                    materials: state.materials.map(m => 
                      m.id === materialId ? material : m
                    )
                  }));
                } catch (error) {
                  console.error(`Error fetching completed material ${materialId}:`, error);
                }
              }
            }
          } catch (error) {
            console.error(`Error polling status for material ${materialId}:`, error);
            clearInterval(interval); // Stop polling on error
          }
        }, 5000);
        
        // Clear interval after 5 minutes as a safety measure
        setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
      }
    } catch (error) {
      console.error('Error tracking processing status:', error);
    }
  },
  
  deleteMaterial: async (materialId) => {
    set({ isLoading: true, error: null });
    
    try {
      await materialService.deleteMaterial(materialId);
      
      set((state) => ({
        materials: state.materials.filter(material => material.id !== materialId),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting material:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  resetUploadState: () => {
    set({
      uploadProgress: {
        current: 0,
        total: 0,
        currentFileName: '',
        isUploading: false,
        isSuccess: false,
        files: {}
      }
    });
  }
}));