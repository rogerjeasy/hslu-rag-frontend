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
  FileQuestion,
  Eye
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useCourseContext } from './CourseContext'
import { Course } from '@/types/course.types'
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
import { motion, AnimatePresence } from 'framer-motion'
import { ViewCourseDetail } from './ViewCourseDetail'

interface CourseTableProps {
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
  onAddCourse?: () => void
}

export function CourseTable({ onEdit, onDelete, onAddCourse }: CourseTableProps) {
  const { filteredCourses, searchTerm, selectedSemester, selectedStatus } = useCourseContext()
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<keyof Course>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // Check if we're filtering
  const isFiltering = !!searchTerm || !!selectedSemester || !!selectedStatus

  // Toggle course description expansion
  const toggleExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }
  
  // Open course detail view with proper state management
  const viewCourseDetail = (courseId: string) => {
    setViewingCourseId(courseId)
    
    requestAnimationFrame(() => {
      setDetailDialogOpen(true)
      console.log('Opening dialog for course:', courseId)
    })
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

  // Empty State Component
  const EmptyState = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl opacity-50"></div>
        <div className="relative bg-background border border-border/30 shadow-sm rounded-full p-6 mb-6">
          {isFiltering ? (
            <svg
              className="h-12 w-12 text-muted-foreground mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          ) : (
            <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto" />
          )}
        </div>
      </div>

      <h3 className="text-xl font-medium tracking-tight mb-2">
        {isFiltering ? "No matching courses found" : "No courses available"}
      </h3>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {isFiltering
          ? "Try adjusting your filters or search criteria to find what you're looking for."
          : "Get started by adding your first course to the system."}
      </p>
      
      {isFiltering ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset All Filters
          </Button>
          {onAddCourse && (
            <Button onClick={onAddCourse}>
              <Edit className="h-4 w-4 mr-2" />
              Add New Course
            </Button>
          )}
        </div>
      ) : onAddCourse ? (
        <Button 
          size="lg" 
          onClick={onAddCourse}
          className="px-6"
        >
          <Edit className="h-4 w-4 mr-2" />
          Add Your First Course
        </Button>
      ) : null}

      {/* Decorative elements */}
      <div className="hidden md:block absolute -z-10">
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/3 transform -translate-x-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
      </div>
    </motion.div>
  )

  // If no courses, show empty state
  if (sortedCourses.length === 0) {
    return <EmptyState />
  }

  return (
    <>
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
            <AnimatePresence>
              {sortedCourses.map((course, index) => (
                <React.Fragment key={course.id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
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
                        <span 
                          className="font-medium cursor-pointer hover:underline"
                          onClick={() => viewCourseDetail(course.id)} 
                        >
                          {course.name}
                        </span>
                      </div>
                      <div className="md:hidden text-xs text-muted-foreground mt-1">
                        {course.semester} • {renderStatusBadge(course.status)}
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
                            <DropdownMenuItem onClick={() => viewCourseDetail(course.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(course)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <File className="mr-2 h-4 w-4" />
                              Manage Materials
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
                  </motion.tr>
                  <AnimatePresence>
                    {expandedCourse === course.id && (
                      <motion.tr 
                        className="bg-muted/50"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TableCell colSpan={7} className="p-4">
                          <motion.div 
                            className="space-y-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
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
                            <div className="flex flex-wrap justify-end gap-2 pt-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => viewCourseDetail(course.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
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
                          </motion.div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Course Detail Dialog */}
      <ViewCourseDetail
        courseId={viewingCourseId}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  )
}