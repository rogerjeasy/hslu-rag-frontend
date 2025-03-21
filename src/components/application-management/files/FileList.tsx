// src/components/application-management/files/FileList.tsx
'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, FileText, FileImage, Code, File, Package } from 'lucide-react'
import { useFileUpload } from './FileUploadContext'
import { motion, AnimatePresence } from 'framer-motion'
import { formatFileSize } from '@/lib/utils'

export function FileList() {
  const { files, removeFile } = useFileUpload()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Early return if no files
  if (files.length === 0) {
    return null
  }

  // Get icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <FileImage className="h-4 w-4 text-blue-500" />
      case 'py':
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
      case 'ipynb':
      case 'r':
        return <Code className="h-4 w-4 text-green-500" />
      case 'pptx':
      case 'ppt':
        return <Package className="h-4 w-4 text-orange-500" />
      case 'docx':
      case 'doc':
        return <FileText className="h-4 w-4 text-blue-600" />
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileText className="h-4 w-4 text-green-600" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  // Get file type label
  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    
    switch (extension) {
      case 'pdf':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">PDF</Badge>
      case 'pptx':
      case 'ppt':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">PowerPoint</Badge>
      case 'docx':
      case 'doc':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Word</Badge>
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Spreadsheet</Badge>
      case 'py':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Python</Badge>
      case 'ipynb':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Jupyter</Badge>
      case 'r':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">R</Badge>
      case 'js':
      case 'ts':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">JavaScript</Badge>
      case 'html':
      case 'css':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Web</Badge>
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{extension.toUpperCase()}</Badge>
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">Files to Upload ({files.length})</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.tr 
                  key={`${file.name}-${index}`}
                  className={hoveredIndex === index ? "bg-muted/50" : ""}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    {getFileIcon(file.name)}
                    <span className="truncate max-w-[250px] inline-block">{file.name}</span>
                  </TableCell>
                  <TableCell>{getFileTypeLabel(file.name)}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {files.length > 0 && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2 text-xs"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Add More Files
          </Button>
        </div>
      )}
    </div>
  )
}