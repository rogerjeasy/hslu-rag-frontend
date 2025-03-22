'use client'

import { useState, useCallback, useEffect } from 'react'
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
import { EmbeddingProgress } from './files/EmbeddingProgress'
import { useToast } from "@/components/ui/toast-provider"
import { MaterialMetadataForm } from './files/MaterialMetadataForm'
import { useMaterialStore } from '@/store/materialStore'
import { MaterialUploadRequest, MaterialUploadResponse } from '@/types/material.types'

// Define the file progress type to match what we're using in ProcessingIndicator
interface FileProgress {
  name: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
}

// Processing stages
type ProcessingStage = 'idle' | 'uploading' | 'embedding' | 'complete'

export function FileManagement() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [currentFileName, setCurrentFileName] = useState("")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedMaterialIds, setUploadedMaterialIds] = useState<string[]>([])
  const { toast } = useToast()
  
  // Get upload state and actions from the material store
  const {
    uploadProgress,
    uploadMultipleMaterials,
    resetUploadState
  } = useMaterialStore();

  // Track file progress for each file
  const [fileProgresses, setFileProgresses] = useState<FileProgress[]>([])
  
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

  // Watch for changes in the upload progress from the store
  useEffect(() => {
    // If we have files in progress but the store indicates an upload is not happening,
    // it likely means the upload is complete or failed
    if (fileProgresses.length > 0 && !uploadProgress.isUploading) {
      if (uploadProgress.isSuccess && !uploadSuccess) {
        // Mark all as completed
        setFileProgresses(prev => 
          prev.map(fp => ({ ...fp, status: 'completed', progress: 100 }))
        );
        setUploadSuccess(true);
        setUploadError(null);
        
        // If we have material IDs, move to embedding stage
        if (uploadedMaterialIds.length > 0) {
          setProcessingStage('embedding');
        } else {
          // Otherwise, reset after a delay
          setTimeout(() => {
            setProcessingStage('complete');
            
            // Final reset after showing completion
            setTimeout(() => {
              resetUploadState();
              setProcessingStage('idle');
              setFileProgresses([]);
              setUploadSuccess(false);
              setUploadedMaterialIds([]);
            }, 3000);
          }, 1000);
        }
      } else if (!uploadProgress.isSuccess && !uploadProgress.isUploading && !uploadError) {
        // If not uploading and not successful, assume an error occurred
        // Mark current and pending files as failed
        setFileProgresses(prev => 
          prev.map((fp, index) => 
            index >= currentFileIndex 
              ? { ...fp, status: 'failed' } 
              : fp
          )
        );
        
        if (uploadError) {
          toast({
            title: "Upload Failed",
            description: uploadError,
            variant: "destructive"
          });
        }
      }
    }
  }, [uploadProgress, currentFileIndex, toast, uploadError, uploadSuccess, uploadedMaterialIds]);

  // Handle file upload submission
  const handleSubmitUpload = useCallback(async (
    files: File[],
    uploadData: MaterialUploadRequest
  ) => {
    if (!files.length || !uploadData.courseId) {
      toast({
        title: "Validation Error",
        description: "Please select a course and add at least one file.",
        variant: "destructive"
      });
      return;
    }

    // Close the dialog immediately
    setShowConfirmDialog(false);
    
    // Reset error state
    setUploadError(null);
    
    // Set uploading state
    setProcessingStage('uploading');
    setUploadSuccess(false);
    setCurrentFileIndex(0);
    setTotalFiles(files.length);
    setCurrentFileName(files[0]?.name || "");
    setUploadedMaterialIds([]);

    // Create initialProgresses with correct typing
    const initialProgresses: FileProgress[] = files.map((file, index) => ({
      name: file.name,
      progress: 0,
      // First file is uploading, rest are pending
      status: index === 0 ? 'uploading' : 'pending'
    }));
    
    setFileProgresses(initialProgresses);

    try {
      // Start the actual upload through the material store
      const response = await uploadMultipleMaterials(files, uploadData);
      
      // Store the material IDs for the embedding progress component
      if (Array.isArray(response)) {
        const materialIds = response.map((item: MaterialUploadResponse) => item.id);
        setUploadedMaterialIds(materialIds);
      }
      
      toast({
        title: "Upload Complete",
        description: `${files.length} files have been uploaded successfully.`,
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Store the error message
      const errorMessage = error instanceof Error ? error.message : "An error occurred during upload.";
      setUploadError(errorMessage);
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast, uploadMultipleMaterials]);

  // Handle manual progress update for demo purposes
  // In a real application, you would get progress from your API
  useEffect(() => {
    if (processingStage !== 'uploading' || fileProgresses.length === 0 || uploadSuccess) return;
    
    const progressInterval = setInterval(() => {
      setFileProgresses(prev => {
        // Clone the array
        const newProgresses = [...prev];
        
        // Find the current uploading file
        const uploadingIndex = newProgresses.findIndex(fp => 
          fp.status === 'uploading' || fp.status === 'processing'
        );
        
        if (uploadingIndex === -1) return prev;
        
        // Update progress for the uploading file
        if (newProgresses[uploadingIndex].status === 'uploading') {
          newProgresses[uploadingIndex] = {
            ...newProgresses[uploadingIndex],
            progress: Math.min(newProgresses[uploadingIndex].progress + 5, 100)
          };
          
          // If progress reaches 100%, change status to processing
          if (newProgresses[uploadingIndex].progress === 100) {
            newProgresses[uploadingIndex].status = 'processing';
            
            // Update current file name
            setCurrentFileName(newProgresses[uploadingIndex].name);
          }
        } else if (newProgresses[uploadingIndex].status === 'processing') {
          // If file is in processing state, increment more slowly
          newProgresses[uploadingIndex] = {
            ...newProgresses[uploadingIndex],
            progress: Math.min(newProgresses[uploadingIndex].progress + 1, 100)
          };
          
          // If complete, move to next file
          if (newProgresses[uploadingIndex].progress === 100) {
            newProgresses[uploadingIndex].status = 'completed';
            
            // Find next pending file
            const nextIndex = newProgresses.findIndex(fp => fp.status === 'pending');
            if (nextIndex !== -1) {
              newProgresses[nextIndex].status = 'uploading';
              setCurrentFileIndex(nextIndex);
              setCurrentFileName(newProgresses[nextIndex].name);
            }
          }
        }
        
        return newProgresses;
      });
    }, 200);
    
    return () => clearInterval(progressInterval);
  }, [processingStage, fileProgresses, uploadSuccess]);

  // Handle completion of embedding process
  const handleEmbeddingComplete = useCallback(() => {
    setProcessingStage('complete');
    
    // Final reset after showing completion
    setTimeout(() => {
      resetUploadState();
      setProcessingStage('idle');
      setFileProgresses([]);
      setUploadSuccess(false);
      setUploadedMaterialIds([]);
    }, 1000);
  }, [resetUploadState]);

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
              {processingStage === 'uploading' && (
                <ProcessingIndicator 
                  current={currentFileIndex + 1}
                  total={totalFiles}
                  fileName={currentFileName}
                  success={uploadSuccess}
                  fileProgresses={fileProgresses}
                />
              )}
              
              {processingStage === 'embedding' && (
                <EmbeddingProgress 
                  materialIds={uploadedMaterialIds}
                  onComplete={handleEmbeddingComplete}
                />
              )}
              
              {processingStage === 'complete' && (
                <div className="py-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">All Processing Complete!</h3>
                  <p className="text-muted-foreground">
                    Your materials are now ready for use in the RAG system.
                  </p>
                </div>
              )}
              
              {processingStage === 'idle' && (
                <div className="space-y-6">
                  <CourseSelector />
                  
                  <MaterialMetadataForm />
                  
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