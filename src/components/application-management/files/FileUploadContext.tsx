// src/components/application-management/files/FileUploadContext.tsx
'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'

// Define the type for the upload context state
interface FileUploadContextType {
  files: File[]
  selectedCourseId: string
  selectedCourseName: string
  addFiles: (newFiles: File[]) => void
  removeFile: (index: number) => void
  clearFiles: () => void
  setSelectedCourse: (id: string, name: string) => void
}

// Create the context with default values
const FileUploadContext = createContext<FileUploadContextType>({
  files: [],
  selectedCourseId: '',
  selectedCourseName: '',
  addFiles: () => {},
  removeFile: () => {},
  clearFiles: () => {},
  setSelectedCourse: () => {},
})

// Custom hook to use the file upload context
export function useFileUpload() {
  return useContext(FileUploadContext)
}

interface FileUploadProviderProps {
  children: ReactNode
}

export function FileUploadProvider({ children }: FileUploadProviderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedCourseName, setSelectedCourseName] = useState('')

  // Add new files to the current list
  const addFiles = (newFiles: File[]) => {
    // Filter out duplicates by comparing file names
    const uniqueNewFiles = newFiles.filter(
      newFile => !files.some(existingFile => existingFile.name === newFile.name)
    )
    
    setFiles(prev => [...prev, ...uniqueNewFiles])
  }

  // Remove a file at the specified index
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Clear all files
  const clearFiles = () => {
    setFiles([])
  }

  // Set the selected course
  const setSelectedCourse = (id: string, name: string) => {
    setSelectedCourseId(id)
    setSelectedCourseName(name)
  }

  // Provide the context value to children
  return (
    <FileUploadContext.Provider 
      value={{
        files,
        selectedCourseId,
        selectedCourseName,
        addFiles,
        removeFile,
        clearFiles,
        setSelectedCourse,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  )
}