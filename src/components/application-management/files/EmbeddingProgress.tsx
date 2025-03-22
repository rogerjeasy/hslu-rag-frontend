'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Database, Loader2, AlertCircle, Server, Braces } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from 'framer-motion'
import { materialService } from '@/services/material.service'
import { MaterialProcessingStatus } from '@/types/material.types'

interface EmbeddingProgressProps {
  materialIds: string[]
  onComplete: () => void
}

export function EmbeddingProgress({ materialIds, onComplete }: EmbeddingProgressProps) {
  const [processingStatuses, setProcessingStatuses] = useState<Record<string, MaterialProcessingStatus>>({})
  const [error, setError] = useState<string | null>(null)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  // Calculate overall progress
  const overallProgress = materialIds.length > 0 
    ? Math.round(
        materialIds.reduce((sum, id) => {
          const status = processingStatuses[id]
          return sum + (status ? status.progress : 0)
        }, 0) / materialIds.length
      )
    : 0

  // Count of completed items
  const completedCount = Object.values(processingStatuses).filter(
    status => status.status === 'completed'
  ).length

  // Count of failed items
  const failedCount = Object.values(processingStatuses).filter(
    status => status.status === 'failed'
  ).length

  // Check if all materials are processed (completed or failed)
  const allProcessed = materialIds.length > 0 && 
    materialIds.every(id => {
      const status = processingStatuses[id]
      return status && (status.status === 'completed' || status.status === 'failed')
    })

  // Progress steps
  const steps = [
    { id: 'extraction', icon: <Braces className="h-5 w-5" />, label: 'Text Extraction' },
    { id: 'chunking', icon: <Braces className="h-5 w-5" />, label: 'Content Chunking' },
    { id: 'embedding', icon: <Database className="h-5 w-5" />, label: 'Embedding Generation' },
    { id: 'indexing', icon: <Server className="h-5 w-5" />, label: 'Vector Database Indexing' }
  ]

  // Get current step based on progress
  const getCurrentStep = (progress: number) => {
    if (progress < 30) return 0 // Text extraction
    if (progress < 50) return 1 // Chunking
    if (progress < 90) return 2 // Embedding
    return 3 // Indexing
  }

  useEffect(() => {
    // Fetch initial status for all materials
    const fetchInitialStatus = async () => {
      try {
        const statusPromises = materialIds.map(id => materialService.getProcessingStatus(id))
        const statuses = await Promise.all(statusPromises)
        
        const statusMap: Record<string, MaterialProcessingStatus> = {}
        statuses.forEach(status => {
          statusMap[status.materialId] = status
        })
        
        setProcessingStatuses(statusMap)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch processing status')
      }
    }

    // Setup polling for status updates
    const setupPolling = () => {
      // Clear any existing interval
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }

      // Start new polling interval
      const interval = setInterval(async () => {
        try {
          // Only poll for materials that aren't completed or failed
          const materialsToCheck = materialIds.filter(id => {
            const status = processingStatuses[id]
            return !status || (status.status !== 'completed' && status.status !== 'failed')
          })

          if (materialsToCheck.length === 0) {
            // If all materials are processed, clear the interval
            if (pollingInterval) {
              clearInterval(pollingInterval)
              setPollingInterval(null)
            }
            
            // Mark as complete after a short delay to show 100%
            if (!isComplete && allProcessed) {
              setTimeout(() => {
                setIsComplete(true)
                setTimeout(onComplete, 3000) // Call onComplete after showing the success state
              }, 1000)
            }
            
            return
          }

          // Fetch updated status for each material
          const statusPromises = materialsToCheck.map(id => materialService.getProcessingStatus(id))
          const newStatuses = await Promise.all(statusPromises)
          
          // Update statuses in state
          setProcessingStatuses(prev => {
            const updated = { ...prev }
            newStatuses.forEach(status => {
              updated[status.materialId] = status
            })
            return updated
          })
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch processing status')
        }
      }, 2000) // Poll every 2 seconds

      setPollingInterval(interval)
    }

    // Start the process
    fetchInitialStatus().then(setupPolling)

    // Cleanup on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [materialIds]) // Only run once on mount or when materialIds changes

  // Effect to handle completion
  useEffect(() => {
    if (allProcessed && !isComplete) {
      // Mark as complete after a short delay
      setTimeout(() => {
        setIsComplete(true)
        setTimeout(onComplete, 3000) // Call onComplete after showing the success state
      }, 1000)
    }
  }, [allProcessed, isComplete, onComplete])

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
                {completedCount} of {materialIds.length} files have been successfully processed.
                {failedCount > 0 && ` (${failedCount} failed)`}
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
                  <Database className="h-8 w-8" />
                </div>
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-background p-1 rounded-full"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-5 w-5 text-primary" />
                </motion.div>
              </div>
             
              <h3 className="text-xl font-semibold mb-2 text-center">Generating Embeddings</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Processing {completedCount + failedCount} of {materialIds.length} files
                {failedCount > 0 && ` (${failedCount} failed)`}
              </p>
              
              {/* Overall progress */}
              <div className="w-full mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              
              {/* Progress steps */}
              <div className="w-full mb-6">
                <div className="flex justify-between mb-4">
                  {steps.map((step, index) => {
                    // Calculate the active state based on the overall progress
                    const isActive = index <= getCurrentStep(overallProgress)
                    
                    return (
                      <div 
                        key={step.id} 
                        className="flex flex-col items-center"
                      >
                        <div 
                          className={`relative w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            isActive 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {index === getCurrentStep(overallProgress) && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              animate={{ 
                                boxShadow: ['0 0 0 0px rgba(59, 130, 246, 0.3)', '0 0 0 4px rgba(59, 130, 246, 0)'] 
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity, 
                                repeatType: 'loop'
                              }}
                            />
                          )}
                          {step.icon}
                        </div>
                        <span className={`text-xs text-center ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="relative h-1 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="absolute h-1 bg-blue-500 rounded-full" 
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
              
              {/* File statuses */}
              {materialIds.length > 0 && (
                <div className="w-full space-y-2 max-h-40 overflow-y-auto">
                  {materialIds.map((id) => {
                    const status = processingStatuses[id] || { 
                      materialId: id, 
                      status: 'processing', 
                      progress: 0, 
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
                          <span className="truncate">Material {id.substring(9, 17)}</span>
                        </div>
                        <span className="text-xs font-medium">
                          {status.status === 'completed' 
                            ? '100%' 
                            : status.status === 'failed'
                              ? 'Failed'
                              : `${Math.round(status.progress)}%`
                          }
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              )}
             
              <p className="text-xs text-muted-foreground mt-6 text-center">
                Please don&apos;t close this window while embedding generation is in progress.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}