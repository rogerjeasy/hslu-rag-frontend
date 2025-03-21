// src/components/application-management/files/UploadConfirmationDialog.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, FileCheck, FileText, Package, Code } from 'lucide-react'
import { useFileUpload } from './FileUploadContext'
import { formatFileSize } from '@/lib/utils'
import { JSX } from "react"

interface UploadConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (files: File[], courseId: string) => void
}

export function UploadConfirmationDialog({
  open,
  onOpenChange,
  onConfirm
}: UploadConfirmationDialogProps) {
  const { files, selectedCourseId, selectedCourseName } = useFileUpload()

  // Group files by type
  const getFilesByType = () => {
    const types: Record<string, { count: number, icon: JSX.Element, label: string }> = {}
    
    files.forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown'
      
      let type = 'other'
      let icon = <FileText className="h-4 w-4 text-gray-500" />
      let label = 'Other'
      
      if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(extension)) {
        type = 'document'
        icon = <FileText className="h-4 w-4 text-blue-500" />
        label = 'Document'
      } else if (['ppt', 'pptx'].includes(extension)) {
        type = 'presentation'
        icon = <Package className="h-4 w-4 text-orange-500" />
        label = 'Presentation'
      } else if (['py', 'ipynb', 'r', 'js', 'ts', 'html', 'css', 'json'].includes(extension)) {
        type = 'code'
        icon = <Code className="h-4 w-4 text-green-500" />
        label = 'Code'
      }
      
      if (!types[type]) {
        types[type] = { count: 0, icon, label }
      }
      
      types[type].count++
    })
    
    return Object.values(types)
  }

  // Check if we can proceed with the upload
  const canProceed = files.length > 0 && selectedCourseId !== ''

  // Calculate total size
  const totalSize = files.reduce((size, file) => size + file.size, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Confirm Upload
          </DialogTitle>
          <DialogDescription>
            Review the files before uploading to the RAG system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div>
            <p className="text-sm font-medium mb-1">Target Course</p>
            <p className="text-sm">{selectedCourseName || "No course selected"}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Files</p>
            <p className="text-sm">{files.length} file{files.length !== 1 ? 's' : ''} ({formatFileSize(totalSize)})</p>
            
            <div className="mt-2 space-y-1.5">
              {getFilesByType().map((type, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs">
                  {type.icon}
                  <span>{type.count} {type.label}{type.count !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>
          
          {!canProceed && (
            <div className="flex items-center gap-2 bg-amber-50 text-amber-600 p-3 rounded-md text-sm">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Cannot proceed</p>
                <p className="text-xs">
                  {!selectedCourseId && "Please select a course. "}
                  {files.length === 0 && "Please add at least one file."}
                </p>
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="text-xs text-muted-foreground">
              These files will be processed and indexed by the RAG system for
              course-specific question answering, exam preparation, and
              knowledge gap identification.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!canProceed}
            onClick={() => onConfirm(files, selectedCourseId)}
          >
            Upload Files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}