// src/components/application-management/courses/CourseTable.tsx
'use client'

import React, { useState } from 'react'
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
import { 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  File, 
  FileText, 
  MoreHorizontal,
  ExternalLink 
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useCourseContext, Course } from './CourseContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"

interface CourseTableProps {
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
}

export function CourseTable({ onEdit, onDelete }: CourseTableProps) {
  const { filteredCourses } = useCourseContext()
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<keyof Course>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Toggle course description expansion
  const toggleExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }
  
  // Handle sorting
  const handleSort = (column: keyof Course) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }
  
  // Sort courses based on current sort criteria
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const valueA = a[sortColumn]
    const valueB = b[sortColumn]
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA)
    }
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' 
        ? valueA - valueB 
        : valueB - valueA
    }
    
    return 0
  })
  
  // Render status badge with appropriate color
  const renderStatusBadge = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case 'inactive':
        return <Badge variant="outline" className="text-amber-500 border-amber-500 hover:bg-amber-100">Inactive</Badge>
      case 'archived':
        return <Badge variant="secondary" className="bg-gray-200 text-gray-600 hover:bg-gray-300">Archived</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }
  
  // Format date to relative time
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      console.error(error)
      return dateString
    }
  }
  
  // Render sort indicator
  const renderSortIndicator = (column: keyof Course) => {
    if (sortColumn !== column) return null
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4" /> 
      : <ChevronDown className="ml-1 h-4 w-4" />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[180px] cursor-pointer"
              onClick={() => handleSort('code')}
            >
              <div className="flex items-center">
                Course Code
                {renderSortIndicator('code')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Course Name
                {renderSortIndicator('name')}
              </div>
            </TableHead>
            <TableHead 
              className="hidden md:table-cell cursor-pointer"
              onClick={() => handleSort('semester')}
            >
              <div className="flex items-center">
                Semester
                {renderSortIndicator('semester')}
              </div>
            </TableHead>
            <TableHead 
              className="hidden md:table-cell cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                {renderSortIndicator('status')}
              </div>
            </TableHead>
            <TableHead 
              className="hidden lg:table-cell cursor-pointer"
              onClick={() => handleSort('materialsCount')}
            >
              <div className="flex items-center">
                Materials
                {renderSortIndicator('materialsCount')}
              </div>
            </TableHead>
            <TableHead 
              className="hidden lg:table-cell cursor-pointer"
              onClick={() => handleSort('updatedAt')}
            >
              <div className="flex items-center">
                Last Updated
                {renderSortIndicator('updatedAt')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCourses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No courses found
              </TableCell>
            </TableRow>
          ) : (
            sortedCourses.map((course) => (
              <React.Fragment key={course.id}>
                <TableRow>
                  <TableCell className="font-medium">
                    {course.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 mr-2"
                        onClick={() => toggleExpand(course.id)}
                      >
                        {expandedCourse === course.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="font-medium">{course.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {course.semester}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {renderStatusBadge(course.status)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                      {course.materialsCount}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {formatDate(course.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(course)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <File className="mr-2 h-4 w-4" />
                            Manage Materials
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Course
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600" 
                            onClick={() => onDelete(course.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
                {expandedCourse === course.id && (
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={7} className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium">Description</h4>
                          <p className="text-sm text-muted-foreground">{course.description}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Instructor</h4>
                            <p className="text-sm text-muted-foreground">{course.instructor}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Credits</h4>
                            <p className="text-sm text-muted-foreground">{course.credits}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Created</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(course.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <Button size="sm" variant="outline" onClick={() => onEdit(course)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <File className="h-4 w-4 mr-1" />
                            Materials
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => onDelete(course.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}