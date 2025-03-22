'use client'

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, FileCheck, FileText, Package } from 'lucide-react'
import { useFileUpload } from './FileUploadContext'
import { formatFileSize } from '@/lib/utils'
import { MaterialUploadRequest } from "@/types/material.types"

interface UploadConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (files: File[], uploadData: MaterialUploadRequest) => void
}

export function UploadConfirmationDialog({
  open,
  onOpenChange,
  onConfirm
}: UploadConfirmationDialogProps) {
  const { 
    files, 
    selectedCourseId, 
    selectedCourseName,
    materialType,
    // materialTitle,
    // materialDescription,
    selectedModuleId,
    selectedTopicId,
    getUploadData
  } = useFileUpload()

  // Group files by type for displaying in the confirmation
  const getFilesByType = () => {
    const types: Record<string, { count: number, icon: React.ReactNode, label: string }> = {}
    
    files.forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown'
      
      if (!types[extension]) {
        // Create entry for this file type with appropriate icon
        let icon = <FileText className="h-4 w-4" />
        let label = 'Documents'
        
        if (['pdf'].includes(extension)) {
          icon = <FileText className="h-4 w-4" />
          label = 'PDF Documents'
        } else if (['ppt', 'pptx'].includes(extension)) {
          icon = <Package className="h-4 w-4" />
          label = 'Presentations'
        } else if (['py', 'js', 'ipynb', 'r', 'java', 'ts', 'scala'].includes(extension)) {
          icon = <FileCheck className="h-4 w-4" />
          label = 'Code Files'
        }
        
        types[extension] = {
          count: 1,
          icon,
          label
        }
      } else {
        // Increment count for this file type
        types[extension].count++
      }
    })
    
    return Object.values(types)
  }

  // Calculate total file size
  const getTotalFileSize = () => {
    return files.reduce((total, file) => total + file.size, 0)
  }

  // Handle confirm button click
  const handleConfirm = () => {
    if (files.length === 0 || !selectedCourseId) {
      return
    }
    
    const uploadData = getUploadData()
    onConfirm(files, uploadData)
  }

  // Check if we can enable the confirm button
  const canConfirm = !!selectedCourseId && files.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Upload</DialogTitle>
          <DialogDescription>
            You are about to upload {files.length} file{files.length !== 1 ? 's' : ''} to the RAG system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Course destination */}
          <div className="rounded-lg border p-3">
            <h4 className="font-medium text-sm mb-2">Destination</h4>
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">{selectedCourseName || 'No course selected'}</p>
                {selectedModuleId && (
                  <p className="text-sm text-muted-foreground">
                    Module: {selectedModuleId}
                  </p>
                )}
                {selectedTopicId && (
                  <p className="text-sm text-muted-foreground">
                    Topic: {selectedTopicId}
                  </p>
                )}
                {materialType && (
                  <p className="text-sm text-muted-foreground">
                    Type: {materialType}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* File summary */}
          <div className="rounded-lg border p-3">
            <h4 className="font-medium text-sm mb-2">Files Summary</h4>
            <ul className="space-y-2">
              {getFilesByType().map((type, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span>{type.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{type.count} file{type.count !== 1 ? 's' : ''}</span>
                </li>
              ))}
              <li className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Total Size</span>
                <span className="text-sm">{formatFileSize(getTotalFileSize())}</span>
              </li>
            </ul>
          </div>

          {/* Warning about processing */}
          <div className="flex gap-2 items-start text-sm rounded-lg bg-amber-50 p-3 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Processing information</p>
              <p className="mt-1">
                These files will be processed by the RAG system and may take some time depending on their size and complexity. 
                You will be notified when processing is complete.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="mt-3 sm:mt-0"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!canConfirm}
            className="mt-3 sm:mt-0"
          >
            Upload {files.length} file{files.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}