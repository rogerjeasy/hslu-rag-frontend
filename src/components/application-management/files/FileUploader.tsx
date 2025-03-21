// src/components/application-management/files/FileUploader.tsx
'use client'

import { useState, useCallback } from 'react'
import { Upload, FileType, File as FileIcon } from 'lucide-react'
import { useFileUpload } from './FileUploadContext'
import { motion } from 'framer-motion'

export function FileUploader() {
  const { addFiles } = useFileUpload()
  const [isDragging, setIsDragging] = useState(false)

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  // Process dropped or selected files
  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return
    
    const files = Array.from(fileList)
    addFiles(files)
    setIsDragging(false)
  }, [addFiles])

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  // Handle file selection via input
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
    // Reset the input value to allow selecting the same file again
    e.target.value = ''
  }, [processFiles])

  // Get icon for file type display
  const getFileTypeIcon = () => {
    return (
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-1">
            <FileType className="h-6 w-6" />
          </div>
          <span className="text-xs">PDF</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-1">
            <FileIcon className="h-6 w-6" />
          </div>
          <span className="text-xs">PPTX</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mb-1">
            <FileIcon className="h-6 w-6" />
          </div>
          <span className="text-xs">Code</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium mb-2">Course Files</p>
      
      <motion.div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-800'
        } transition-colors duration-150 cursor-pointer`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
        whileHover={{ scale: 1.01 }}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.pptx,.docx,.xlsx,.txt,.py,.ipynb,.r,.js,.html,.css,.md,.json"
        />
        
        <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        
        {getFileTypeIcon()}
        
        <div>
          <p className="text-sm font-medium mb-1">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            or click to browse your files
          </p>
          <p className="text-xs text-muted-foreground">
            Support for PDF, PPT, Word, Excel, code files, and more
          </p>
        </div>
      </motion.div>
    </div>
  )
}