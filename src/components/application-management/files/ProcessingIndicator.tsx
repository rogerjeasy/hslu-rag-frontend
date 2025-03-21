// src/components/application-management/files/ProcessingIndicator.tsx
'use client'

import { CheckCircle, UploadCloud, FileText, Loader2 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from 'framer-motion'

interface ProcessingIndicatorProps {
  current: number
  total: number
  fileName: string
  success: boolean
}

export function ProcessingIndicator({ 
  current, 
  total, 
  fileName,
  success
}: ProcessingIndicatorProps) {
  // Calculate progress percentage
  const progress = Math.round((current / total) * 100)
  
  return (
    <div className="py-8">
      <div className="max-w-md mx-auto">
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
              className="flex flex-col items-center text-center"
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
              
              <h3 className="text-xl font-semibold mb-2">Uploading Files</h3>
              <p className="text-muted-foreground mb-4">
                Processing file {current} of {total}
              </p>
              
              <div className="w-full mb-2">
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="truncate max-w-[250px]">{fileName}</span>
              </div>
              
              <p className="text-xs text-muted-foreground mt-6">
                Please don&apos;t close this window while the upload is in progress.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}