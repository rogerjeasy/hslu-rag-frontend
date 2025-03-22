'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MaterialUploadRequest } from '@/types/material.types';

interface FileUploadContextType {
  files: File[];
  selectedCourseId: string;
  selectedCourseName: string;
  selectedModuleId: string | null;
  selectedTopicId: string | null;
  materialType: string;
  materialTitle: string;
  materialDescription: string;
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  setSelectedCourse: (id: string, name: string) => void;
  setSelectedModule: (id: string | null) => void;
  setSelectedTopic: (id: string | null) => void;
  setMaterialType: (type: string) => void;
  setMaterialTitle: (title: string) => void;
  setMaterialDescription: (description: string) => void;
  getUploadData: () => MaterialUploadRequest;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export function FileUploadProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [materialType, setMaterialType] = useState('lecture');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');

  // Add files to the queue
  const addFiles = (newFiles: File[]) => {
    setFiles(prevFiles => {
      // Create a new array with unique files (avoid duplicates by filename)
      const uniqueFiles = [...prevFiles];
      const existingFileNames = new Set(prevFiles.map(file => file.name));
     
      for (const file of newFiles) {
        if (!existingFileNames.has(file.name)) {
          uniqueFiles.push(file);
          existingFileNames.add(file.name);
        }
      }
     
      return uniqueFiles;
    });
  };

  // Remove a file by index
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Clear all files
  const clearFiles = () => {
    setFiles([]);
  };

  // Set selected course
  const setSelectedCourse = (id: string, name: string) => {
    setSelectedCourseId(id);
    setSelectedCourseName(name);
  };

  // Set selected module - renamed to match interface
  const setSelectedModule = (id: string | null) => {
    setSelectedModuleId(id);
  };

  // Set selected topic - renamed to match interface
  const setSelectedTopic = (id: string | null) => {
    setSelectedTopicId(id);
  };

  // Get upload data for API request
  const getUploadData = (): MaterialUploadRequest => {
    return {
      courseId: selectedCourseId,
      moduleId: selectedModuleId || undefined,
      topicId: selectedTopicId || undefined,
      title: materialTitle || undefined,
      description: materialDescription || undefined,
      type: materialType
    };
  };

  return (
    <FileUploadContext.Provider value={{
      files,
      selectedCourseId,
      selectedCourseName,
      selectedModuleId,
      selectedTopicId,
      materialType,
      materialTitle,
      materialDescription,
      addFiles,
      removeFile,
      clearFiles,
      setSelectedCourse,
      setSelectedModule,
      setSelectedTopic,
      setMaterialType,
      setMaterialTitle,
      setMaterialDescription,
      getUploadData
    }}>
      {children}
    </FileUploadContext.Provider>
  );
}

export function useFileUpload() {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error('useFileUpload must be used within a FileUploadProvider');
  }
  return context;
}