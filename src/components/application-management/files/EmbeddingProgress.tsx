'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Database, Loader2, AlertCircle, Server, Braces, FileText, Upload } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from 'framer-motion'
import { materialService } from '@/services/material.service'
import { MaterialProcessingStatus, ProcessingStage, BatchProcessingStatus } from '@/types/material.types'

interface EmbeddingProgressProps {
  materialIds: string[]
  onComplete: () => void
  initialStage?: ProcessingStage // Optional initial stage
  batchId?: string // Optional batch ID for batch processing
}

type StageInfo = {
  name: string;
  icon: React.ReactNode;
  description: string;
}

export function EmbeddingProgress({ 
  materialIds, 
  onComplete,
  initialStage,
  batchId
}: EmbeddingProgressProps) {
  const [processingStatuses, setProcessingStatuses] = useState<Record<string, MaterialProcessingStatus>>({})
  const [batchStatus, setBatchStatus] = useState<BatchProcessingStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  
  // Use ref for polling interval to properly clean up
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Use ref to prevent infinite loops when checking completion
  const completionCheckRef = useRef<boolean>(false)
  
  // Use ref to store current stage to avoid unnecessary renders
  const currentStageRef = useRef<ProcessingStage>(initialStage || 'pending')

  // Define processing stages with their details
  const stages: Record<ProcessingStage, StageInfo> = {
    'pending': {
      name: 'Preparing',
      icon: <Upload className="h-5 w-5" />,
      description: 'Preparing the file for processing'
    },
    'upload_complete': {
      name: 'Upload Complete',
      icon: <Upload className="h-5 w-5" />,
      description: 'Files successfully uploaded to cloud storage'
    },
    'text_extraction': {
      name: 'Text Extraction',
      icon: <FileText className="h-5 w-5" />,
      description: 'Extracting text content from the file'
    },
    'chunking': {
      name: 'Content Chunking',
      icon: <Braces className="h-5 w-5" />,
      description: 'Dividing content into processable chunks'
    },
    'embedding': {
      name: 'Embedding Generation',
      icon: <Database className="h-5 w-5" />,
      description: 'Generating vector embeddings for text chunks'
    },
    'indexing': {
      name: 'Vector Indexing',
      icon: <Server className="h-5 w-5" />,
      description: 'Storing vectors in the database for retrieval'
    },
    'completed': {
      name: 'Completed',
      icon: <CheckCircle className="h-5 w-5" />,
      description: 'Processing successfully completed'
    },
    'failed': {
      name: 'Failed',
      icon: <AlertCircle className="h-5 w-5" />,
      description: 'Processing failed'
    },
    'canceled': {
      name: 'Canceled',
      icon: <AlertCircle className="h-5 w-5" />,
      description: 'Processing was canceled'
    }
  }

  // Get counts for different statuses
  const getStatusCounts = () => {
    const counts = {
      completed: 0,
      failed: 0,
      processing: 0
    }
    
    Object.values(processingStatuses).forEach(status => {
      if (status.status === 'completed') counts.completed++;
      else if (status.status === 'failed') counts.failed++;
      else counts.processing++;
    })
    
    return counts;
  }
  
  const statusCounts = getStatusCounts();

  // Check if all materials are processed (completed or failed)
  // const allProcessed = materialIds.length > 0 && 
  //   materialIds.every(id => {
  //     const status = processingStatuses[id]
  //     return status && (status.status === 'completed' || status.status === 'failed')
  //   })

  // Get current active stage based on batch status or material statuses
  // const getCurrentStage = (): ProcessingStage => {
  //   // If we have batch status, use that
  //   if (batchStatus) {
  //     return batchStatus.current_stage as ProcessingStage || initialStage || 'pending';
  //   }
    
  //   // Otherwise determine from individual material statuses
  //   if (materialIds.length === 0) return initialStage || 'pending';
    
  //   // Priority order for stages (earliest first)
  //   const stagePriority: ProcessingStage[] = [
  //     'pending', 
  //     'upload_complete', 
  //     'text_extraction', 
  //     'chunking', 
  //     'embedding', 
  //     'indexing', 
  //     'completed'
  //   ];
    
  //   // Find the earliest stage that any material is in
  //   for (const stage of stagePriority) {
  //     for (const id of materialIds) {
  //       const status = processingStatuses[id];
  //       if (status && status.stage === stage) {
  //         return stage;
  //       }
  //     }
  //   }
    
  //   return initialStage || 'pending';
  // }

  // Calculate current stage only when needed
  const currentStage = isComplete ? 'completed' : currentStageRef.current;

  // Calculate overall progress
  const getOverallProgress = (): number => {
    // If we have batch status, use its progress
    if (batchStatus && typeof batchStatus.progress === 'number') {
      return Math.round(batchStatus.progress * 100);
    }
    
    // Otherwise calculate from individual materials
    if (materialIds.length > 0) {
      return Math.round(
        materialIds.reduce((sum, id) => {
          const status = processingStatuses[id]
          return sum + (status ? status.progress * 100 : 0)
        }, 0) / materialIds.length
      );
    }
    
    return 0;
  }
  
  const overallProgress = getOverallProgress();
  
  // Get combined stage progress
  const getStageProgress = (stage: ProcessingStage): number => {
    // If we have batch status and it's the current stage, use stages_counts
    if (batchStatus && batchStatus.current_stage === stage) {
      const stagesCount = batchStatus.stages_counts?.[stage] || 0;
      const totalCount = batchStatus.total_count || 1;
      return Math.round((stagesCount / totalCount) * 100);
    }
    
    // Otherwise calculate from material statuses
    const materialsInStage = Object.values(processingStatuses).filter(
      status => status.stage === stage
    );
    
    if (materialsInStage.length === 0) return 0;
    
    return Math.round(
      materialsInStage.reduce((sum, status) => sum + status.stageProgress * 100, 0) / 
      materialsInStage.length
    );
  }

  // Get embedding stats from actual API data
  const getEmbeddingStats = () => {
    // If we have batch status with embedding stage information
    if (batchStatus && batchStatus.current_stage === 'embedding') {
      return {
        totalChunks: batchStatus.total_chunks || 0,
        processedChunks: batchStatus.processed_chunks || 0
      };
    }
    
    // Otherwise get from individual materials
    const materialsInEmbeddingStage = Object.values(processingStatuses).filter(
      status => status.stage === 'embedding'
    );
    
    if (materialsInEmbeddingStage.length === 0) return { totalChunks: 0, processedChunks: 0 };
    
    return {
      totalChunks: materialsInEmbeddingStage.reduce((sum, status) => sum + (status.totalChunks || 0), 0),
      processedChunks: materialsInEmbeddingStage.reduce((sum, status) => sum + (status.processedChunks || 0), 0)
    };
  }
  
  const embeddingStats = getEmbeddingStats();

  // Helper function to determine current stage from API statuses
  const getCurrentStageFromStatuses = (statuses: MaterialProcessingStatus[]): ProcessingStage => {
    if (statuses.length === 0) return initialStage || 'pending';
    
    // Priority order for stages (earliest first)
    const stagePriority: ProcessingStage[] = [
      'pending', 
      'upload_complete', 
      'text_extraction', 
      'chunking', 
      'embedding', 
      'indexing', 
      'completed'
    ];
    
    // Find the earliest stage that any material is in
    for (const stage of stagePriority) {
      for (const status of statuses) {
        if (status.stage === stage) {
          return stage;
        }
      }
    }
    
    return initialStage || 'pending';
  };
  
  // Helper function to get friendly stage description for batch processing
  const getBatchStageDescription = (stage: ProcessingStage): string => {
    switch (stage) {
      case 'text_extraction':
        return 'Extracting text from all files before proceeding to the next step';
      case 'chunking':
        return 'Dividing text from all files into processable chunks before proceeding';
      case 'embedding':
        return 'Processing all materials through the embedding pipeline together';
      case 'indexing':
        return 'Adding all embeddings to the vector database for retrieval';
      default:
        return stages[stage].description;
    }
  };

  // Fetch processing status from API
  const fetchProcessingStatuses = async () => {
    if ((materialIds.length === 0 && !batchId) || isComplete) return;
    
    try {
      // If we have a batch ID, prioritize fetching the batch status
      if (batchId) {
        const batchData = await materialService.getBatchStatus(batchId);
        setBatchStatus(batchData);
        
        // Update the ref with the latest stage from batch
        if (batchData.current_stage && batchData.current_stage !== currentStageRef.current) {
          currentStageRef.current = batchData.current_stage as ProcessingStage;
        }
        
        // Check if batch is complete
        if (batchData.status === 'completed' || batchData.status === 'completed_with_errors') {
          if (!isComplete && !completionCheckRef.current) {
            // Set flag to prevent multiple calls
            completionCheckRef.current = true;
            
            // Set complete after a short delay
            setTimeout(() => {
              setIsComplete(true);
              
              // Notify parent component after showing success state
              setTimeout(onComplete, 3000);
            }, 1000);
            
            // Clear polling interval
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
        }
        
        // Still fetch individual material statuses for more detailed info
        if (materialIds.length > 0) {
          const statusPromises = materialIds.map(id => materialService.getProcessingStatus(id));
          const statuses = await Promise.all(statusPromises);
          
          const statusMap: Record<string, MaterialProcessingStatus> = {};
          statuses.forEach(status => {
            statusMap[status.materialId] = status;
          });
          
          setProcessingStatuses(statusMap);
        }
      } else {
        // No batch ID, just fetch individual statuses
        const statusPromises = materialIds.map(id => materialService.getProcessingStatus(id));
        const statuses = await Promise.all(statusPromises);
        
        // Update statuses with new data
        const statusMap: Record<string, MaterialProcessingStatus> = {};
        statuses.forEach(status => {
          statusMap[status.materialId] = status;
        });
        
        // Check if all statuses have the same batch ID
        const batchIds = new Set<string>();
        statuses.forEach(status => {
          if (status.batch_id) {
            batchIds.add(status.batch_id);
          }
        });
        
        // If all materials share a single batch ID, save it
        if (batchIds.size === 1) {
          const newBatchId = Array.from(batchIds)[0];
          // Fetch batch status
          const batchData = await materialService.getBatchStatus(newBatchId);
          setBatchStatus(batchData);
        }
        
        // Update the ref with the latest stage
        const newStage = getCurrentStageFromStatuses(statuses);
        if (newStage !== currentStageRef.current) {
          currentStageRef.current = newStage;
        }
        
        // Set the processing statuses
        setProcessingStatuses(statusMap);
        
        // Check if all are completed or failed
        const allDone = statuses.every(status => 
          status.status === 'completed' || status.status === 'failed'
        );
        
        if (allDone && !isComplete && !completionCheckRef.current) {
          // Set flag to prevent multiple calls
          completionCheckRef.current = true;
          
          // Set complete after a short delay
          setTimeout(() => {
            setIsComplete(true);
            
            // Notify parent component after showing success state
            setTimeout(onComplete, 3000);
          }, 1000);
          
          // Clear polling interval
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      }
    } catch (err) {
      // Only set error if it's new
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch processing status';
      if (error !== errorMessage) {
        setError(errorMessage);
      }
    }
  };

  // Set up polling for status updates
  useEffect(() => {
    // Clean up existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    // Reset completion check when material IDs or batch ID changes
    completionCheckRef.current = false;
    
    // Set initial stage
    if (initialStage) {
      currentStageRef.current = initialStage;
    }
    
    if ((materialIds.length > 0 || batchId) && !isComplete) {
      // Fetch initial status
      fetchProcessingStatuses();
      
      // Set up polling interval - not too frequent to avoid too many API calls
      pollingIntervalRef.current = setInterval(fetchProcessingStatuses, 3000);
    }
    
    // Clean up on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [materialIds, batchId, isComplete, initialStage]); // Only depend on these values

  return (
    <div className="py-8">
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {isComplete ? (
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
              <h3 className="text-xl font-semibold mb-2">Processing Complete!</h3>
              <p className="text-muted-foreground mb-4">
                {batchStatus ? 
                  `${batchStatus.completed_count || statusCounts.completed} of ${batchStatus.total_count || materialIds.length} files have been successfully processed.` +
                  (batchStatus.failed_count > 0 ? ` (${batchStatus.failed_count} failed)` : '')
                  :
                  `${statusCounts.completed} of ${materialIds.length} files have been successfully processed.` +
                  (statusCounts.failed > 0 ? ` (${statusCounts.failed} failed)` : '')
                }
              </p>
              <p className="text-sm text-muted-foreground">
                The embeddings have been added to the vector database and are ready for RAG queries.
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Error</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
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
                  {stages[currentStage].icon}
                </div>
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-background p-1 rounded-full"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-5 w-5 text-primary" />
                </motion.div>
              </div>
             
              <h3 className="text-xl font-semibold mb-2 text-center">{stages[currentStage].name}</h3>
              <p className="text-muted-foreground mb-2 text-center">
                {batchId ? getBatchStageDescription(currentStage) : stages[currentStage].description}
              </p>
              
              {/* Show stage indicator */}
              <div className="mb-4">
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mx-auto dark:bg-blue-900/20 dark:text-blue-300">
                  {currentStage === 'text_extraction' || currentStage === 'chunking' 
                    ? 'Stage 2 of 3: Text Processing'
                    : currentStage === 'embedding' || currentStage === 'indexing'
                      ? 'Stage 3 of 3: Embedding Generation' 
                      : currentStage === 'completed'
                        ? 'Processing Complete'
                        : 'Processing'}
                  {batchId && ' (Batch Mode)'}
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 text-center">
                {batchStatus ? 
                  `Processing batch: ${batchStatus.completed_count || 0} of ${batchStatus.total_count || materialIds.length} files complete` +
                  (batchStatus.failed_count ? ` (${batchStatus.failed_count} failed)` : '')
                  : 
                  `Processing ${statusCounts.completed + statusCounts.failed} of ${materialIds.length} files` +
                  (statusCounts.failed > 0 ? ` (${statusCounts.failed} failed)` : '')
                }
              </p>
              
              {/* Overall progress */}
              <div className="w-full mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              
              {/* Current stage progress */}
              <div className="w-full mb-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {stages[currentStage].icon}
                    <span className="font-medium">{stages[currentStage].name}</span>
                  </div>
                  <span className="text-sm bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {getStageProgress(currentStage)}%
                  </span>
                </div>
                <Progress value={getStageProgress(currentStage)} className="h-1.5 mt-2" />
                
                {/* Show embedding-specific stats if in embedding stage */}
                {currentStage === 'embedding' && embeddingStats.totalChunks > 0 && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Processing {embeddingStats.processedChunks} of {embeddingStats.totalChunks} chunks
                    {batchId && ' across all files'}
                  </div>
                )}
              </div>
              
              {/* Batch status if available */}
              {batchStatus && (
                <div className="w-full mb-6">
                  <h4 className="text-sm font-medium mb-3">Batch Progress</h4>
                  <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Batch ID: {batchId?.substring(0, 8) || ''}</span>
                      <span className="text-sm bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {batchStatus.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="font-medium">{batchStatus.total_count || 0}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Completed</div>
                        <div className="font-medium text-green-600">{batchStatus.completed_count || 0}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Failed</div>
                        <div className="font-medium text-red-600">{batchStatus.failed_count || 0}</div>
                      </div>
                    </div>
                    
                    {/* Stage counts */}
                    {batchStatus.stages_counts && Object.keys(batchStatus.stages_counts).length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm mb-2">Stage Completion:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(batchStatus.stages_counts).map(([stage, count]) => (
                            <div key={stage} className="flex justify-between items-center text-xs">
                              <span>{stages[stage as ProcessingStage]?.name || stage}:</span>
                              <span className="font-medium">{count}/{batchStatus.total_count || 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Processing pipeline visualization */}
              <div className="w-full mb-6">
                <h4 className="text-sm font-medium mb-3">Processing Pipeline</h4>
                <div className="flex justify-between relative mb-4">
                  {/* Connector line */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
                  
                  {/* Upload stage - always completed at this point */}
                  <div className="flex flex-col items-center z-10">
                    <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-500 text-green-600 flex items-center justify-center mb-2">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-green-600 font-medium text-center">File Upload</span>
                  </div>
                  
                  {/* Text Processing stage */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      currentStage === 'text_extraction' || currentStage === 'chunking'
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-600'
                        : (currentStage === 'embedding' || currentStage === 'indexing' || currentStage === 'completed')
                          ? 'bg-green-100 border-2 border-green-500 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {currentStage === 'text_extraction' || currentStage === 'chunking' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="h-4 w-4" />
                        </motion.div>
                      ) : (currentStage === 'embedding' || currentStage === 'indexing' || currentStage === 'completed') ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <span className={`text-xs text-center ${
                      currentStage === 'text_extraction' || currentStage === 'chunking'
                        ? 'text-blue-600 font-medium'
                        : (currentStage === 'embedding' || currentStage === 'indexing' || currentStage === 'completed')
                          ? 'text-green-600 font-medium'
                          : 'text-gray-500'
                    }`}>Text Processing</span>
                  </div>
                  
                  {/* Embedding stage */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      currentStage === 'embedding' || currentStage === 'indexing'
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-600'
                        : currentStage === 'completed'
                          ? 'bg-green-100 border-2 border-green-500 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {currentStage === 'embedding' || currentStage === 'indexing' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="h-4 w-4" />
                        </motion.div>
                      ) : currentStage === 'completed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Database className="h-4 w-4" />
                      )}
                    </div>
                    <span className={`text-xs text-center ${
                      currentStage === 'embedding' || currentStage === 'indexing'
                        ? 'text-blue-600 font-medium'
                        : currentStage === 'completed'
                          ? 'text-green-600 font-medium'
                          : 'text-gray-500'
                    }`}>Embedding</span>
                  </div>
                </div>
              </div>
              
              {/* File statuses */}
              {materialIds.length > 0 && (
                <div className="w-full">
                  <h4 className="text-sm font-medium mb-3">Individual File Progress</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {materialIds.map((id) => {
                      const status = processingStatuses[id] || { 
                        materialId: id, 
                        status: 'processing', 
                        progress: 0, 
                        stage: initialStage || 'pending',
                        stageProgress: 0,
                        startedAt: new Date().toISOString()
                      }
                      
                      return (
                        <motion.div 
                          key={id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-2 rounded-md flex items-center justify-between text-sm ${
                            status.status === 'processing' 
                              ? 'bg-blue-50 dark:bg-blue-900/20' 
                              : status.status === 'completed'
                                ? 'bg-green-50 dark:bg-green-900/20'
                                : status.status === 'failed'
                                  ? 'bg-red-50 dark:bg-red-900/20'
                                  : 'bg-gray-50 dark:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                          {status.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : status.status === 'failed' ? (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Loader2 className="h-4 w-4 text-blue-500" />
                              </motion.div>
                            )}
                            <span className="truncate">Material {id.substring(0, 8)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium whitespace-nowrap">
                              {status.stage && stages[status.stage] ? stages[status.stage].name : ''}
                            </span>
                            <span className="text-xs font-medium">
                              {status.status === 'completed' 
                                ? '100%' 
                                : status.status === 'failed'
                                  ? 'Failed'
                                  : `${Math.round(status.progress * 100)}%`
                              }
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
             
              <p className="text-xs text-muted-foreground mt-6 text-center">
                Please don&apos;t close this window while batch processing is in progress.
                {batchId && ' All files will move through each stage together.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}