'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
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
import { MaterialUploadRequest, MaterialUploadResponse, ProcessingStage as ApiProcessingStage } from '@/types/material.types'
import { materialService } from '@/services/material.service'

// Define the file progress type to match what we're using in ProcessingIndicator
interface FileProgress {
  name: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
}

// Processing stages - UI view states
type ProcessingStage = 'idle' | 'uploading' | 'text_processing' | 'embedding' | 'indexing' | 'complete'

// Map backend processing stages to UI stages
const mapApiStageToUiStage = (apiStage: ApiProcessingStage): ProcessingStage => {
  switch (apiStage) {
    case 'pending':
    case 'upload_complete':
      return 'uploading'
    case 'text_extraction':
    case 'chunking':
      return 'text_processing'
    case 'embedding':
    case 'indexing':
      return 'indexing'
    case 'completed':
      return 'complete'
    case 'failed':
      return 'idle' // Return to idle state on failure
    default:
      return 'uploading'
  }
}

export function FileManagement() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [currentFileName, setCurrentFileName] = useState("")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedMaterialIds, setUploadedMaterialIds] = useState<string[]>([])
  const [batchId, setBatchId] = useState<string | null>(null)
  
  // Polling reference to keep track of and cleanup intervals
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const batchPollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Use ref to track the last processing stage to prevent infinite loops
  const lastProcessingStageRef = useRef<ProcessingStage>('idle')
  
  const { toast } = useToast()
  
  // Get upload state and actions from the material store
  const {
    uploadProgress,
    uploadMultipleMaterials,
    resetUploadState,
    // getProcessingStatus
  } = useMaterialStore()

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

  // Function to poll batch status from server
  const pollBatchStatus = useCallback(async () => {
    if (!batchId) return
    
    try {
      const batchStatus = await materialService.getBatchStatus(batchId)
      
      // Update UI based on batch status
      if (batchStatus.status === 'completed' || batchStatus.status === 'completed_with_errors') {
        // Batch is complete
        if (lastProcessingStageRef.current !== 'complete') {
          setProcessingStage('complete')
          lastProcessingStageRef.current = 'complete'
          
          // Clear polling intervals
          if (batchPollingIntervalRef.current) {
            clearInterval(batchPollingIntervalRef.current)
            batchPollingIntervalRef.current = null
          }
          
          // Show completion UI briefly, then reset
          setTimeout(() => {
            resetUploadState()
            setProcessingStage('idle')
            lastProcessingStageRef.current = 'idle'
            setFileProgresses([])
            setUploadSuccess(false)
            setUploadedMaterialIds([])
            setBatchId(null)
          }, 3000)
        }
        return
      } else if (batchStatus.status === 'failed' || batchStatus.status === 'canceled') {
        // Batch processing failed
        toast({
          title: "Processing Failed",
          description: batchStatus.error_message || "Batch processing failed or was canceled",
          variant: "destructive"
        })
        
        // Clear polling intervals
        if (batchPollingIntervalRef.current) {
          clearInterval(batchPollingIntervalRef.current)
          batchPollingIntervalRef.current = null
        }
        
        // Reset to idle state
        if (lastProcessingStageRef.current !== 'idle') {
          setProcessingStage('idle')
          lastProcessingStageRef.current = 'idle'
        }
        return
      }
      
      // Update the stage based on batch current_stage
      const currentApiStage = batchStatus.current_stage as ApiProcessingStage
      const newProcessingStage = mapApiStageToUiStage(currentApiStage)
      
      // Only update if stage has changed
      if (newProcessingStage !== lastProcessingStageRef.current) {
        console.log(`Batch polling: Updating stage from ${lastProcessingStageRef.current} to ${newProcessingStage} (API stage: ${currentApiStage})`)
        setProcessingStage(newProcessingStage)
        lastProcessingStageRef.current = newProcessingStage
      }
      
    } catch (error) {
      console.error('Error polling batch status:', error)
    }
  }, [batchId, resetUploadState, toast])

  // Function to poll individual processing statuses (used before we have a batch ID)
  const pollProcessingStatuses = useCallback(async () => {
    if (!uploadedMaterialIds.length) return
    
    try {
      // Get status for all materials
      const statuses = await Promise.all(
        uploadedMaterialIds.map(id => materialService.getProcessingStatus(id))
      )
      
      // Check if we have a batch ID from any of the materials
      const materialWithBatchId = statuses.find(status => status.batch_id)
      if (materialWithBatchId && !batchId && materialWithBatchId.batch_id) {
        const newBatchId = materialWithBatchId.batch_id
        setBatchId(newBatchId) 
        
        // Now that we have a batch ID, switch to batch polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
        
        // Start batch polling immediately
        await pollBatchStatus()
        batchPollingIntervalRef.current = setInterval(pollBatchStatus, 3000)
        return
      }
      
      // Calculate if all materials are completed
      const allCompleted = statuses.every(status => status.status === 'completed')
      const anyFailed = statuses.some(status => status.status === 'failed')
      
      if (allCompleted) {
        // All materials completed processing
        if (lastProcessingStageRef.current !== 'complete') {
          setProcessingStage('complete')
          lastProcessingStageRef.current = 'complete'
          
          // Clear polling interval
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          
          // Show completion UI briefly, then reset
          setTimeout(() => {
            resetUploadState()
            setProcessingStage('idle')
            lastProcessingStageRef.current = 'idle'
            setFileProgresses([])
            setUploadSuccess(false)
            setUploadedMaterialIds([])
          }, 3000)
        }
        return
      } else if (anyFailed && statuses.every(status => status.status === 'failed')) {
        // All materials failed
        toast({
          title: "Processing Failed",
          description: "All materials failed processing. Please try again.",
          variant: "destructive"
        })
        
        // Clear polling interval
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
        
        // Reset to idle state
        if (lastProcessingStageRef.current !== 'idle') {
          setProcessingStage('idle')
          lastProcessingStageRef.current = 'idle'
        }
        return
      }
      
      // Determine the earliest stage any material is in (priority order)
      const stagePriority: ApiProcessingStage[] = [
        'pending',
        'upload_complete', 
        'text_extraction', 
        'chunking', 
        'embedding', 
        'indexing', 
        'completed'
      ]
      
      let currentApiStage: ApiProcessingStage = 'completed'
      
      // Find the earliest stage
      for (const stage of stagePriority) {
        if (statuses.some(status => status.stage === stage)) {
          currentApiStage = stage
          break
        }
      }
      
      // Convert API stage to UI stage
      const newProcessingStage = mapApiStageToUiStage(currentApiStage)
      
      // Only update if stage has changed
      if (newProcessingStage !== lastProcessingStageRef.current) {
        console.log(`Updating processing stage from ${lastProcessingStageRef.current} to ${newProcessingStage}`)
        setProcessingStage(newProcessingStage)
        lastProcessingStageRef.current = newProcessingStage
      }
    } catch (error) {
      console.error('Error polling processing status:', error)
    }
  }, [uploadedMaterialIds, batchId, resetUploadState, toast, pollBatchStatus])

  // Setup polling when uploadedMaterialIds changes
  useEffect(() => {
    // Clear any existing intervals
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    
    if (batchPollingIntervalRef.current) {
      clearInterval(batchPollingIntervalRef.current)
      batchPollingIntervalRef.current = null
    }
    
    // If we have uploaded materials and not in idle/complete state
    if (uploadedMaterialIds.length > 0 && 
        lastProcessingStageRef.current !== 'idle' && 
        lastProcessingStageRef.current !== 'complete') {
      
      if (batchId) {
        // Use batch polling if we have a batch ID
        pollBatchStatus()
        batchPollingIntervalRef.current = setInterval(pollBatchStatus, 3000)
      } else {
        // Otherwise poll individual materials
        pollProcessingStatuses()
        pollingIntervalRef.current = setInterval(pollProcessingStatuses, 3000)
      }
    }
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      
      if (batchPollingIntervalRef.current) {
        clearInterval(batchPollingIntervalRef.current)
        batchPollingIntervalRef.current = null
      }
    }
  }, [uploadedMaterialIds, batchId, pollProcessingStatuses, pollBatchStatus])

  // Watch for changes in the upload progress from the store
  useEffect(() => {
    // If we have files in progress but the store indicates an upload is not happening,
    // it likely means the upload is complete or failed
    if (fileProgresses.length > 0 && !uploadProgress.isUploading) {
      if (uploadProgress.isSuccess && !uploadSuccess) {
        // Mark all as completed
        setFileProgresses(prev => 
          prev.map(fp => ({ ...fp, status: 'completed', progress: 100 }))
        )
        setUploadSuccess(true)
        setUploadError(null)
        
        // If we have material IDs, trigger polling to update UI based on actual server state
        if (uploadedMaterialIds.length > 0) {
          // Initial poll to determine next UI state
          if (batchId) {
            pollBatchStatus()
          } else {
            pollProcessingStatuses()
          }
        } else {
          // No material IDs, just reset
          if (lastProcessingStageRef.current !== 'complete') {
            setProcessingStage('complete')
            lastProcessingStageRef.current = 'complete'
          
            // Final reset after showing completion
            setTimeout(() => {
              resetUploadState()
              setProcessingStage('idle')
              lastProcessingStageRef.current = 'idle'
              setFileProgresses([])
              setUploadSuccess(false)
            }, 3000)
          }
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
        )
        
        if (uploadError) {
          toast({
            title: "Upload Failed",
            description: uploadError,
            variant: "destructive"
          })
        }
      }
    }
  }, [
    uploadProgress.isUploading,
    uploadProgress.isSuccess,
    currentFileIndex, 
    toast, 
    uploadError, 
    uploadSuccess, 
    uploadedMaterialIds,
    batchId,
    resetUploadState, 
    fileProgresses.length,
    pollProcessingStatuses,
    pollBatchStatus
  ])

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
  
  // Reset error state and batch ID
  setUploadError(null);
  setBatchId(null);
  
  // Set uploading state
  setProcessingStage('uploading');
  lastProcessingStageRef.current = 'uploading';
  setUploadSuccess(false);
  setCurrentFileIndex(0);
  setTotalFiles(files.length);
  setCurrentFileName(files[0]?.name || "");
  setUploadedMaterialIds([]);

  // Create initial progresses
  const initialProgresses: FileProgress[] = files.map((file, index) => ({
    name: file.name,
    progress: 0,
    // First file is uploading, rest are pending
    status: index === 0 ? 'uploading' : 'pending'
  }));
  
  setFileProgresses(initialProgresses);

  try {
    // Always use the batch upload endpoint for consistency, even with a single file
    const response = await uploadMultipleMaterials(files, uploadData);
    
    // Store the material IDs for the embedding progress component
    if (Array.isArray(response)) {
      const materialIds = response.map((item: MaterialUploadResponse) => item.id);
      setUploadedMaterialIds(materialIds);
      
      // Check if we have a batch ID from the response
      const firstResponse = response[0];
      if (firstResponse && 'batch_id' in firstResponse && firstResponse.batch_id) {
        const newBatchId = firstResponse.batch_id;
        setBatchId(newBatchId);
        
        // Start polling immediately
        setTimeout(() => {
          pollBatchStatus();
        }, 1000);
      } else {
        // Start material polling immediately
        setTimeout(() => {
          pollProcessingStatuses();
        }, 1000);
      }
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
}, [toast, uploadMultipleMaterials, pollBatchStatus, pollProcessingStatuses])

  // Update file progress based on upload progress from store
  useEffect(() => {
    if (processingStage !== 'uploading' || !uploadProgress.files || Object.keys(uploadProgress.files).length === 0) {
      return
    }
    
    // Use a local object to hold file updates to prevent state update loops
    const fileUpdates: Record<string, {progress: number, status: string}> = {}
    let hasUpdates = false
    
    // Check for files that need updates
    fileProgresses.forEach(fp => {
      const storeProgress = uploadProgress.files[fp.name]
      if (storeProgress && 
          (fp.progress !== storeProgress.progress || fp.status !== storeProgress.status)) {
        fileUpdates[fp.name] = { 
          progress: storeProgress.progress, 
          status: storeProgress.status 
        }
        hasUpdates = true
      }
    })
    
    // Only update if necessary
    if (hasUpdates) {
      setFileProgresses(prev => 
        prev.map(fp => {
          const update = fileUpdates[fp.name]
          if (update) {
            return {
              ...fp,
              progress: update.progress,
              status: update.status as 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
            }
          }
          return fp
        })
      )
    }
    
    // Update current file index based on store - only if there's a change
    const currentUploadingFile = Object.values(uploadProgress.files).find(
      file => file.status === 'uploading' || file.status === 'processing'
    )
    
    if (currentUploadingFile && currentUploadingFile.name !== currentFileName) {
      setCurrentFileName(currentUploadingFile.name)
      const index = fileProgresses.findIndex(fp => fp.name === currentUploadingFile.name)
      if (index !== -1 && index !== currentFileIndex) {
        setCurrentFileIndex(index)
      }
    }
  }, [uploadProgress.files, processingStage, fileProgresses, currentFileName, currentFileIndex])

  // Handle completion of embedding process
  const handleEmbeddingComplete = useCallback(() => {
    if (lastProcessingStageRef.current !== 'complete') {
      setProcessingStage('complete')
      lastProcessingStageRef.current = 'complete'
    
      // Final reset after showing completion
      setTimeout(() => {
        resetUploadState()
        setProcessingStage('idle')
        lastProcessingStageRef.current = 'idle'
        setFileProgresses([])
        setUploadSuccess(false)
        setUploadedMaterialIds([])
        setBatchId(null)
      }, 1000)
    }
  }, [resetUploadState])

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
              
              {(processingStage === 'text_processing' || processingStage === 'indexing') && (
                <EmbeddingProgress 
                  materialIds={uploadedMaterialIds}
                  onComplete={handleEmbeddingComplete}
                  initialStage={processingStage === 'text_processing' ? 'text_extraction' : 'embedding'}
                  batchId={batchId || undefined}
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