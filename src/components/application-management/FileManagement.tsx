// src/components/application-management/FileManagement.tsx
'use client'

import { useState, useCallback } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Upload } from 'lucide-react'
import { FileUploader } from './files/FileUploader'
import { FileList } from './files/FileList'
import { UploadSummary } from './files/UploadSummary'
import { CourseSelector } from './files/CourseSelector'
import { FileUploadProvider } from './files/FileUploadContext'
import { UploadConfirmationDialog } from './files/UploadConfirmationDialog'
import { ProcessingIndicator } from './files/ProcessingIndicator'
import { useToast } from "@/components/ui/toast-provider"

export function FileManagement() {
  const [isUploading, setIsUploading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<{
    current: number;
    total: number;
    fileName: string;
  } | null>(null)
  const { toast } = useToast()

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  // Handle file upload submission
  const handleSubmitUpload = useCallback(async (files: File[], courseId: string) => {
    if (!files.length || !courseId) {
      toast({
        title: "Validation Error",
        description: "Please select a course and add at least one file.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    setShowConfirmDialog(false)

    try {
      const totalFiles = files.length;
      
      // Process files one by one to show progress
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        setProcessingStatus({
          current: i + 1,
          total: totalFiles,
          fileName: file.name
        });

        // Create form data for each file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('courseId', courseId);

        // Upload file
        const response = await fetch('/api/materials/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        // Simulate processing time for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setUploadSuccess(true);
      
      // Reset the component after showing success
      setTimeout(() => {
        setProcessingStatus(null);
        setIsUploading(false);
        setUploadSuccess(false);
      }, 3000);

      toast({
        title: "Upload Successful",
        description: `${files.length} files were uploaded and processed successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setProcessingStatus(null);
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <FileUploadProvider>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.div variants={cardVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Course Materials Management</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage course materials for the RAG system.
          </p>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Materials
                  </CardTitle>
                  <CardDescription>
                    Upload PDF documents, PowerPoint slides, code files, and other course materials.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isUploading ? (
                <ProcessingIndicator 
                  current={processingStatus?.current || 0}
                  total={processingStatus?.total || 0}
                  fileName={processingStatus?.fileName || ''}
                  success={uploadSuccess}
                />
              ) : (
                <div className="space-y-6">
                  <CourseSelector />
                  
                  <FileUploader />
                  
                  <FileList />
                  
                  <UploadSummary />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setShowConfirmDialog(true)}
                    >
                      Upload Materials
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <UploadConfirmationDialog 
          open={showConfirmDialog} 
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleSubmitUpload}
        />
      </motion.div>
    </FileUploadProvider>
  )
}