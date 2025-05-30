'use client'

import { CheckCircle, UploadCloud, FileText, Loader2, File } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from 'framer-motion'

interface FileProgress {
  name: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
}

interface ProcessingIndicatorProps {
  current: number
  total: number
  fileName: string
  success: boolean
  fileProgresses?: FileProgress[]
}

export function ProcessingIndicator({
  current,
  total,
  // fileName,
  success,
  fileProgresses = []
}: ProcessingIndicatorProps) {
  // Calculate overall progress percentage
  const overallProgress = Math.round((current / total) * 100)
  
  // Get current active file (the one being processed)
  const currentFile = fileProgresses.find(file => 
    file.status === 'uploading' || file.status === 'processing'
  )
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <div className="h-4 w-4 rounded-full bg-red-500" />
      case 'uploading':
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-4 w-4 text-blue-500" />
          </motion.div>
        )
      default:
        return <File className="h-4 w-4 text-gray-400" />
    }
  }
  
  // Get file upload step name
  const getUploadStepName = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Uploading to server'
      case 'processing':
        return 'Processing upload'
      case 'completed':
        return 'Upload complete'
      case 'failed':
        return 'Upload failed'
      default:
        return 'Queued for upload'
    }
  }
  
  return (
    <div className="py-8">
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Complete!</h3>
              <p className="text-muted-foreground mb-4">
                All {total} files have been successfully uploaded and processed.
              </p>
              <p className="text-sm text-muted-foreground">
                The files are now being indexed for the RAG system.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6">
                <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-background p-1 rounded-full"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-5 w-5 text-primary" />
                </motion.div>
              </div>
              
              {/* Upload Stage Headers */}
              <div className="flex flex-col mb-6 text-center">
                <h3 className="text-xl font-semibold mb-1">Uploading Files</h3>
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mx-auto dark:bg-blue-900/20 dark:text-blue-300">
                  Stage 1 of 3: File Upload
                </div>
                <p className="text-muted-foreground mt-2">
                  Processing file {current} of {total}
                </p>
              </div>
              
              {/* Overall progress */}
              <div className="w-full mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Overall Upload Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              
              {/* Upload pipeline visualization */}
              <div className="w-full mb-6">
                <h4 className="text-sm font-medium mb-3">Processing Pipeline</h4>
                <div className="flex justify-between relative mb-4">
                  {/* Connector line */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
                  
                  {/* Upload stage - always active or completed */}
                  <div className="flex flex-col items-center z-10">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-500 text-blue-600 flex items-center justify-center mb-2">
                      <UploadCloud className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-blue-600 font-medium text-center">File Upload</span>
                  </div>
                  
                  {/* Text Processing stage - inactive */}
                  <div className="flex flex-col items-center z-10">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-2">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-gray-500 text-center">Text Processing</span>
                  </div>
                  
                  {/* Embedding stage - inactive */}
                  <div className="flex flex-col items-center z-10">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 text-center">Embedding</span>
                  </div>
                </div>
              </div>
              
              {/* Current file progress */}
              {currentFile && (
                <div className="w-full mb-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Current File</span>
                    </div>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {getUploadStepName(currentFile.status)}
                    </span>
                  </div>
                  <p className="text-sm truncate mb-2">{currentFile.name}</p>
                  <Progress value={currentFile.progress} className="h-1.5" />
                </div>
              )}
              
              {/* File queue list */}
              {fileProgresses.length > 0 && (
                <div className="w-full space-y-2 max-h-40 overflow-y-auto">
                  {fileProgresses.map((file, index) => (
                    <motion.div 
                      key={file.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-2 rounded-md flex items-center justify-between text-sm ${
                        file.status === 'uploading' || file.status === 'processing' 
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : file.status === 'completed'
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : file.status === 'failed'
                              ? 'bg-red-50 dark:bg-red-900/20'
                              : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {getStatusIcon(file.status)}
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="text-xs font-medium">
                        {file.status === 'completed' 
                          ? '100%' 
                          : file.status === 'failed'
                            ? 'Failed'
                            : file.status === 'pending'
                              ? 'Queued'
                              : `${file.progress}%`
                        }
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
             
              <p className="text-xs text-muted-foreground mt-6 text-center">
                Please don&apos;t close this window while the upload is in progress.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}