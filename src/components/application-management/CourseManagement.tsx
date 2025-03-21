// src/components/application-management/CourseManagement.tsx
'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  BookOpen, 
  FileText,
  ArrowUpDown,
  FolderPlus
} from "lucide-react"
import { CourseDetail } from "./courses/CourseDetail"
import { AddCourseDialog } from "./courses/AddCourseDialog"
import { motion } from "framer-motion"

// Define course type
interface Course {
  id: string
  title: string
  code: string
  description: string
  instructor: string
  instructorEmail: string
  startDate: string
  endDate: string
  status: 'active' | 'upcoming' | 'archived'
  enrolledStudents: number
  totalMaterials: number
  progress?: number
}

// Define module type
interface Module {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  materialsCount: number
  status: 'published' | 'draft' | 'archived'
  lastUpdated: string
}

// Sample course data
const COURSES_DATA: Course[] = [
  {
    id: "c1",
    title: "Machine Learning Fundamentals",
    code: "ML-101",
    description: "Introduction to machine learning concepts and algorithms",
    instructor: "Michael Schmidt",
    instructorEmail: "m.schmidt@hslu.ch",
    startDate: "2025-02-15T00:00:00Z",
    endDate: "2025-06-15T00:00:00Z",
    status: "active",
    enrolledStudents: 45,
    totalMaterials: 24,
    progress: 65
  },
  {
    id: "c2",
    title: "Statistical Methods for Data Science",
    code: "STAT-202",
    description: "Advanced statistical methods for data analysis",
    instructor: "Lisa Hoffmann",
    instructorEmail: "lisa.hoffmann@hslu.ch",
    startDate: "2025-02-15T00:00:00Z",
    endDate: "2025-06-15T00:00:00Z",
    status: "active",
    enrolledStudents: 38,
    totalMaterials: 32,
    progress: 48
  },
  {
    id: "c3",
    title: "Big Data Technologies",
    code: "BIG-301",
    description: "Techniques and tools for processing large datasets",
    instructor: "Markus Wagner",
    instructorEmail: "m.wagner@hslu.ch",
    startDate: "2025-02-15T00:00:00Z",
    endDate: "2025-06-15T00:00:00Z",
    status: "active",
    enrolledStudents: 27,
    totalMaterials: 18,
    progress: 35
  },
  {
    id: "c4",
    title: "Data Visualization",
    code: "VIZ-201",
    description: "Principles and techniques for effective data visualization",
    instructor: "Emma Weber",
    instructorEmail: "emma.weber@hslu.ch",
    startDate: "2025-07-01T00:00:00Z",
    endDate: "2025-12-15T00:00:00Z",
    status: "upcoming",
    enrolledStudents: 15,
    totalMaterials: 8
  },
  {
    id: "c5",
    title: "Database Systems",
    code: "DB-201",
    description: "Design and implementation of database systems",
    instructor: "Markus Wagner",
    instructorEmail: "m.wagner@hslu.ch",
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2025-01-15T00:00:00Z",
    status: "archived",
    enrolledStudents: 42,
    totalMaterials: 30
  }
];

// Sample modules data
const MODULES_DATA: Module[] = [
  {
    id: "m1",
    courseId: "c1",
    title: "Introduction to ML Concepts",
    description: "Fundamental concepts in machine learning",
    order: 1,
    materialsCount: 5,
    status: "published",
    lastUpdated: "2025-02-20T14:30:00Z"
  },
  {
    id: "m2",
    courseId: "c1",
    title: "Supervised Learning",
    description: "Classification and regression techniques",
    order: 2,
    materialsCount: 8,
    status: "published",
    lastUpdated: "2025-03-05T10:15:00Z"
  },
  {
    id: "m3",
    courseId: "c1",
    title: "Unsupervised Learning",
    description: "Clustering and dimensionality reduction",
    order: 3,
    materialsCount: 6,
    status: "published",
    lastUpdated: "2025-03-15T16:20:00Z"
  },
  {
    id: "m4",
    courseId: "c1",
    title: "Neural Networks",
    description: "Introduction to neural networks and deep learning",
    order: 4,
    materialsCount: 5,
    status: "draft",
    lastUpdated: "2025-03-18T09:45:00Z"
  },
  {
    id: "m5",
    courseId: "c2",
    title: "Probability and Statistics Review",
    description: "Review of fundamental probability and statistics concepts",
    order: 1,
    materialsCount: 7,
    status: "published",
    lastUpdated: "2025-02-18T11:30:00Z"
  },
  {
    id: "m6",
    courseId: "c2",
    title: "Hypothesis Testing",
    description: "Statistical inference and hypothesis testing",
    order: 2,
    materialsCount: 9,
    status: "published",
    lastUpdated: "2025-03-02T13:20:00Z"
  },
  {
    id: "m7",
    courseId: "c2",
    title: "Regression Analysis",
    description: "Linear and multiple regression methods",
    order: 3,
    materialsCount: 8,
    status: "published",
    lastUpdated: "2025-03-12T15:10:00Z"
  },
  {
    id: "m8",
    courseId: "c2",
    title: "Advanced Statistical Methods",
    description: "Time series analysis and Bayesian methods",
    order: 4,
    materialsCount: 8,
    status: "draft",
    lastUpdated: "2025-03-19T10:05:00Z"
  }
];

export function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortColumn, setSortColumn] = useState<string>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isCourseDetailOpen, setIsCourseDetailOpen] = useState<boolean>(false)
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<string>('courses')
  
  // Filter courses based on search term and filters
  const filteredCourses = COURSES_DATA.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    let valA, valB;
    
    switch (sortColumn) {
      case 'title':
        valA = a.title;
        valB = b.title;
        break;
      case 'code':
        valA = a.code;
        valB = b.code;
        break;
      case 'instructor':
        valA = a.instructor;
        valB = b.instructor;
        break;
      case 'students':
        valA = a.enrolledStudents;
        valB = b.enrolledStudents;
        break;
      case 'materials':
        valA = a.totalMaterials;
        valB = b.totalMaterials;
        break;
      default:
        valA = a.title;
        valB = b.title;
    }
    
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Filter modules based on search term
  const filteredModules = MODULES_DATA.filter(module => {
    return module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           module.description.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Sort function
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      case 'published':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
      case 'draft':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }
  
  // Format date for readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }
  
  // Handle course detail
  const handleCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseDetailOpen(true);
  }

  // Card animation variants
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

  return (
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
        <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage courses, modules, and course materials.
        </p>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
            </TabsList>
            <div>
              {currentTab === 'courses' ? (
                <Button onClick={() => setIsAddCourseDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Course
                </Button>
              ) : (
                <Button>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Module
                </Button>
              )}
            </div>
          </div>
          
          <TabsContent value="courses" className="space-y-4 mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Course List</CardTitle>
                <CardDescription>
                  View and manage all courses in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search courses..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                          <div className="flex items-center">
                            Title
                            {sortColumn === 'title' && 
                              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                            }
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('code')}>
                          <div className="flex items-center">
                            Code
                            {sortColumn === 'code' && 
                              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                            }
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('instructor')}>
                          <div className="flex items-center">
                            Instructor
                            {sortColumn === 'instructor' && 
                              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                            }
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('students')}>
                          <div className="flex items-center">
                            Students
                            {sortColumn === 'students' && 
                              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                            }
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('materials')}>
                          <div className="flex items-center">
                            Materials
                            {sortColumn === 'materials' && 
                              <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                            }
                          </div>
                        </TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedCourses.length > 0 ? (
                        sortedCourses.map((course) => (
                          <TableRow 
                            key={course.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleCourseDetail(course)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                                {course.title}
                              </div>
                            </TableCell>
                            <TableCell>{course.code}</TableCell>
                            <TableCell>{course.instructor}</TableCell>
                            <TableCell>{course.enrolledStudents}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusBadgeColor(course.status)}>
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{course.totalMaterials}</span>
                                {course.status === 'active' && course.progress && (
                                  <Progress value={course.progress} className="h-2 w-16" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleCourseDetail(course)
                                  }}>
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Edit course
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Manage materials
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {course.status === 'active' ? (
                                    <DropdownMenuItem className="text-amber-600 focus:text-amber-600">
                                      Archive course
                                    </DropdownMenuItem>
                                  ) : course.status === 'archived' ? (
                                    <DropdownMenuItem className="text-green-600 focus:text-green-600">
                                      Restore course
                                    </DropdownMenuItem>
                                  ) : null}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No courses found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-muted-foreground">
                <div>Showing {sortedCourses.length} of {COURSES_DATA.length} courses</div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-800">Active</Badge>
                  <span className="mx-1">{COURSES_DATA.filter(c => c.status === 'active').length}</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">Upcoming</Badge>
                  <span className="mx-1">{COURSES_DATA.filter(c => c.status === 'upcoming').length}</span>
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">Archived</Badge>
                  <span className="mx-1">{COURSES_DATA.filter(c => c.status === 'archived').length}</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="modules" className="space-y-4 mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Module List</CardTitle>
                <CardDescription>
                  View and manage course modules and their materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search modules..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {COURSES_DATA.map(course => (
                          <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Materials</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredModules.length > 0 ? (
                        filteredModules.map((module) => {
                          const parentCourse = COURSES_DATA.find(c => c.id === module.courseId);
                          return (
                            <TableRow 
                              key={module.id}
                              className="cursor-pointer hover:bg-muted/50"
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-primary" />
                                  {module.title}
                                </div>
                              </TableCell>
                              <TableCell>
                                {parentCourse?.title || 'Unknown Course'}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusBadgeColor(module.status)}>
                                  {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{module.materialsCount}</TableCell>
                              <TableCell>{formatDate(module.lastUpdated)}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>View details</DropdownMenuItem>
                                    <DropdownMenuItem>Edit module</DropdownMenuItem>
                                    <DropdownMenuItem>Manage materials</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {module.status === 'draft' ? (
                                      <DropdownMenuItem className="text-emerald-600 focus:text-emerald-600">
                                        Publish module
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem className="text-amber-600 focus:text-amber-600">
                                        Unpublish module
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No modules found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Course Detail Dialog */}
      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          open={isCourseDetailOpen}
          onOpenChange={setIsCourseDetailOpen}
        />
      )}

      {/* Add Course Dialog */}
      <AddCourseDialog
        open={isAddCourseDialogOpen}
        onOpenChange={setIsAddCourseDialogOpen}
      />
    </motion.div>
  )
}