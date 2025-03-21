// src/components/application-management/files/UploadSummary.tsx
'use client'

import { useState, useEffect, JSX } from 'react'
import { 
  Card, 
  CardContent,
} from "@/components/ui/card"
import { useFileUpload } from './FileUploadContext'
import { BarChart3, FileText, Package, Code, AlertCircle } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'

interface FileSummary {
  count: number
  totalSize: number
  typeCounts: Record<string, number>
}

export function UploadSummary() {
  const { files, selectedCourseName } = useFileUpload()
  const [summary, setSummary] = useState<FileSummary>({
    count: 0,
    totalSize: 0,
    typeCounts: {}
  })

  // Calculate summary data when files change
  useEffect(() => {
    const typeCounts: Record<string, number> = {}
    let totalSize = 0
    
    files.forEach(file => {
      // Get the file extension
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown'
      
      // Count by type
      typeCounts[extension] = (typeCounts[extension] || 0) + 1
      
      // Sum file sizes
      totalSize += file.size
    })
    
    setSummary({
      count: files.length,
      totalSize,
      typeCounts
    })
  }, [files])

  // If no files or course selected, don't show summary
  if (files.length === 0) {
    return null
  }

  // Group similar file types
  const getGroupedTypes = () => {
    const groups: Record<string, { icon: JSX.Element, label: string, count: number }> = {
      documents: { 
        icon: <FileText className="h-4 w-4 text-blue-500" />, 
        label: 'Documents', 
        count: 0 
      },
      presentations: { 
        icon: <Package className="h-4 w-4 text-orange-500" />, 
        label: 'Presentations', 
        count: 0 
      },
      code: { 
        icon: <Code className="h-4 w-4 text-green-500" />, 
        label: 'Code Files', 
        count: 0 
      },
      other: { 
        icon: <FileText className="h-4 w-4 text-gray-500" />, 
        label: 'Other Files', 
        count: 0 
      }
    }
    
    // Map extensions to groups
    for (const [type, count] of Object.entries(summary.typeCounts)) {
      if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(type)) {
        groups.documents.count += count
      } else if (['ppt', 'pptx'].includes(type)) {
        groups.presentations.count += count
      } else if (['py', 'ipynb', 'r', 'js', 'ts', 'html', 'css', 'json'].includes(type)) {
        groups.code.count += count
      } else {
        groups.other.count += count
      }
    }
    
    // Return only non-empty groups
    return Object.values(groups).filter(group => group.count > 0)
  }

  const groupedTypes = getGroupedTypes()

  return (
    <Card className="bg-muted/40 mt-4">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Upload Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1">Target Course</p>
              <p className="text-sm font-medium">{selectedCourseName || "No course selected"}</p>
            </div>
            
            <div>
              <p className="text-sm mb-1">Total</p>
              <p className="text-sm font-medium">
                {summary.count} file{summary.count !== 1 ? 's' : ''} ({formatFileSize(summary.totalSize)})
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm mb-2">File Types</p>
            <div className="flex flex-wrap gap-3">
              {groupedTypes.map((group, index) => (
                <div key={index} className="flex items-center gap-1.5 bg-background rounded-md px-2 py-1 text-xs">
                  {group.icon}
                  <span>{group.label}: <strong>{group.count}</strong></span>
                </div>
              ))}
            </div>
          </div>
          
          {!selectedCourseName && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded-md text-xs mt-2">
              <AlertCircle className="h-4 w-4" />
              <span>Please select a course before uploading</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}