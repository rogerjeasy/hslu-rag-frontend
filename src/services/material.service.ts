// src/services/material.service.ts
import { api, handleError } from '@/helpers/api';
import { Material, MaterialProcessingStatus, MaterialUploadRequest } from '@/types/material.types';

class MaterialService {
  /**
   * Upload a single file material
   */
  async uploadMaterial(
    file: File,
    data: MaterialUploadRequest
  ): Promise<Material> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Append metadata fields
      formData.append('course_id', data.courseId);
      if (data.moduleId) formData.append('module_id', data.moduleId);
      if (data.topicId) formData.append('topic_id', data.topicId);
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.type) formData.append('material_type', data.type);
      
      const response = await api.post('/materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to upload material: ${errorMessage}`);
    }
  }

  /**
   * Upload multiple file materials
   */
  async uploadMultipleMaterials(
    files: File[],
    data: MaterialUploadRequest,
    metadata?: Record<string, { title?: string; description?: string }>
  ): Promise<Material[]> {
    try {
      const formData = new FormData();
      
      // Append each file
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Append metadata fields
      formData.append('course_id', data.courseId);
      if (data.moduleId) formData.append('module_id', data.moduleId);
      if (data.topicId) formData.append('topic_id', data.topicId);
      if (data.type) formData.append('material_type', data.type);
      
      // Append file-specific metadata if provided
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      
      const response = await api.post('/materials/batch-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to upload materials: ${errorMessage}`);
    }
  }

  /**
   * Get processing status of a material
   */
  async getProcessingStatus(materialId: string): Promise<MaterialProcessingStatus> {
    try {
      const response = await api.get(`/materials/processing/${materialId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to get processing status: ${errorMessage}`);
    }
  }

  /**
   * Get all materials (with optional filtering)
   */
  async getMaterials(
    courseId?: string,
    moduleId?: string,
    topicId?: string,
    materialType?: string
  ): Promise<Material[]> {
    try {
      let url = '/materials/';
      const params = new URLSearchParams();
      
      if (courseId) params.append('course_id', courseId);
      if (moduleId) params.append('module_id', moduleId);
      if (topicId) params.append('topic_id', topicId);
      if (materialType) params.append('material_type', materialType);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch materials: ${errorMessage}`);
    }
  }

  /**
   * Get a specific material by ID
   */
  async getMaterial(materialId: string): Promise<Material> {
    try {
      const response = await api.get(`/materials/${materialId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch material: ${errorMessage}`);
    }
  }

  /**
   * Delete a material
   */
  async deleteMaterial(materialId: string): Promise<void> {
    try {
      await api.delete(`/materials/${materialId}`);
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to delete material: ${errorMessage}`);
    }
  }
}

// Export a singleton instance
export const materialService = new MaterialService();