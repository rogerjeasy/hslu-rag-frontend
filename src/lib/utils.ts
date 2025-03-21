import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes The size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Gets a color for a specific file type
 * @param extension File extension
 * @returns Color string
 */
export function getFileTypeColor(extension: string): string {
  const colorMap: Record<string, string> = {
    // Documents
    pdf: 'text-red-500',
    doc: 'text-blue-600',
    docx: 'text-blue-600',
    txt: 'text-gray-600',
    md: 'text-gray-600',
    
    // Presentations
    ppt: 'text-orange-500',
    pptx: 'text-orange-500',
    
    // Spreadsheets
    xls: 'text-green-600',
    xlsx: 'text-green-600',
    csv: 'text-green-600',
    
    // Code files
    py: 'text-blue-500',
    ipynb: 'text-orange-500',
    r: 'text-blue-500',
    js: 'text-yellow-500',
    ts: 'text-blue-500',
    html: 'text-orange-600',
    css: 'text-blue-400',
    json: 'text-gray-600',
  }
  
  return colorMap[extension] || 'text-gray-500'
}

/**
 * Truncates a string to a maximum length with ellipsis
 * @param str String to truncate
 * @param maxLength Maximum length
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  
  return str.slice(0, maxLength) + '...'
}

/**
 * Validates a file based on accepted file types
 * @param file File to validate
 * @param acceptedTypes Array of accepted MIME types or extensions
 * @returns Boolean indicating if file is valid
 */
export function validateFile(file: File, acceptedTypes: string[]): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  
  return acceptedTypes.some(type => {
    // Check if we're matching by MIME type
    if (type.includes('/')) {
      return file.type === type
    }
    
    // Otherwise match by extension
    return extension === type.replace('.', '')
  })
}