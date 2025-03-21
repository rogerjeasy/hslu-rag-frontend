// src/components/application-management/courses/CourseDetail.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Calendar,
  Clock,
  Users,
  FileText,
  BookOpen,
  Mail,
  BarChart,
  FileQuestion,
  FolderOpen,
  Download,
  Edit,
  MoreHorizontal,
  Eye
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type CourseStatus = 'active' | 'upcoming' | 'archived'

interface Course {
  id: string
  title: string
  code: string
  description: string
  instructor: string
  instructorEmail: string
  startDate: string
  endDate: string
  status: CourseStatus
  enrolledStudents: number
  totalMaterials: number
  progress?: number
}

// Sample module data
const courseModules = [
  {
    id: "m1",
    title: "Introduction to ML Concepts",
    description: "Fundamental concepts in machine learning",
    order: 1,
    materialsCount: 5,
    status: "published",
    materials: [
      { id: "mat1", title: "Introduction to ML", type: "pdf", size: "2.4 MB" },
      { id: "mat2", title: "History of ML", type: "pdf", size: "1.8 MB" },
      { id: "mat3", title: "ML Use Cases", type: "video", size: "45 MB" },
      { id: "mat4", title: "ML Terminology", type: "pdf", size: "1.2 MB" },
      { id: "mat5", title: "Week 1 Quiz", type: "quiz", size: "" }
    ]
  },
  {
    id: "m2",
    title: "Supervised Learning",
    description: "Classification and regression techniques",
    order: 2,
    materialsCount: 8,
    status: "published",
    materials: [
      { id: "mat6", title: "Classification Algorithms", type: "pdf", size: "3.1 MB" },
      { id: "mat7", title: "Regression Techniques", type: "pdf", size: "2.6 MB" },
      { id: "mat8", title: "Decision Trees Demo", type: "video", size: "56 MB" },
      { id: "mat9", title: "Random Forests", type: "pdf", size: "1.9 MB" }
    ]
  },
  {
    id: "m3",
    title: "Unsupervised Learning",
    description: "Clustering and dimensionality reduction",
    order: 3,
    materialsCount: 6,
    status: "published",
    materials: [
      { id: "mat10", title: "Clustering Methods", type: "pdf", size: "2.2 MB" },
      { id: "mat11", title: "K-means Clustering", type: "pdf", size: "1.5 MB" },
      { id: "mat12", title: "PCA Explained", type: "video", size: "42 MB" }
    ]
  },
  {
    id: "m4",
    title: "Neural Networks",
    description: "Introduction to neural networks and deep learning",
    order: 4,
    materialsCount: 5,
    status: "draft",
    materials: [
      { id: "mat13", title: "Neural Network Basics", type: "pdf", size: "3.5 MB" },
      { id: "mat14", title: "Deep Learning Introduction", type: "pdf", size: "2.8 MB" }
    ]
  }
]

// Sample student data
const enrolledStudents = [
  { id: "s1", name: "Emma Weber", email: "emma.weber@hslu.ch", progress: 82, lastActivity: "2025-03-18T10:30:00Z" },
  { id: "s2", name: "David Müller", email: "d.mueller@hslu.ch", progress: 65, lastActivity: "2025-03-15T14:45:00Z" },
  { id: "s3", name: "Anna Klein", email: "anna.klein@hslu.ch", progress: 78, lastActivity: "2025-03-19T09:20:00Z" },
  { id: "s4", name: "Thomas Becker", email: "t.becker@hslu.ch", progress: 45, lastActivity: "2025-03-12T16:10:00Z" },
  { id: "s5", name: "Julia Schneider", email: "j.schneider@hslu.ch", progress: 91, lastActivity: "2025-03-20T11:15:00Z" }
]

interface CourseDetailProps {
  course: Course
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CourseDetail({ course, open, onOpenChange }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Format date for readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }
  
  // Format full date with time
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      case 'published':
        return 'bg-emerald-100 text-emerald-800'
      case 'draft':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Get material type icon
  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'video':
        return <Eye className="h-4 w-4 text-blue-500" />
      case 'quiz':
        return <FileQuestion className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }
  
  // Calculate days remaining (for active courses)
  const getDaysRemaining = () => {
    const endDate = new Date(course.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
  
  // Calculate course duration in weeks
  const getCourseDuration = () => {
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  }

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (custom: number) => ({ 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col">
              <DialogTitle className="text-xl flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> 
                {course.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <code className="text-xs px-1 py-0.5 bg-muted rounded">{course.code}</code>
                <Badge variant="outline" className={getStatusBadgeColor(course.status)}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </Badge>
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit Course
              </Button>
              {course.status === "active" ? (
                <Button variant="outline" size="sm" className="text-amber-600 border-amber-200 hover:bg-amber-50">
                  Archive Course
                </Button>
              ) : course.status === "archived" ? (
                <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                  Restore Course
                </Button>
              ) : null}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TabsContent value="overview" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div 
                      className="flex flex-col gap-1 p-4 border rounded-lg"
                      custom={0}
                      variants={statsVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <span className="text-xs font-medium text-muted-foreground">Students</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-2xl font-bold">{course.enrolledStudents}</span>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col gap-1 p-4 border rounded-lg"
                      custom={1}
                      variants={statsVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <span className="text-xs font-medium text-muted-foreground">Materials</span>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        <span className="text-2xl font-bold">{course.totalMaterials}</span>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col gap-1 p-4 border rounded-lg"
                      custom={2}
                      variants={statsVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <span className="text-xs font-medium text-muted-foreground">Duration</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-2xl font-bold">{getCourseDuration()} weeks</span>
                      </div>
                    </motion.div>
                    
                    {course.status === "active" && (
                      <motion.div 
                        className="flex flex-col gap-1 p-4 border rounded-lg"
                        custom={3}
                        variants={statsVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <span className="text-xs font-medium text-muted-foreground">Days Remaining</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span className="text-2xl font-bold">{getDaysRemaining()}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        <p className="text-sm">{course.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Course Timeline</h3>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>Start Date</span>
                            </div>
                            <span>{formatDate(course.startDate)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-red-500" />
                              <span>End Date</span>
                            </div>
                            <span>{formatDate(course.endDate)}</span>
                          </div>
                          
                          {course.status === "active" && course.progress && (
                            <div className="pt-2">
                              <div className="flex justify-between mb-1 text-xs">
                                <span>Course Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Modules Overview</h3>
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Module</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Materials</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {courseModules.map((module) => (
                                <TableRow key={module.id}>
                                  <TableCell className="font-medium">
                                    {module.title}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={getStatusBadgeColor(module.status)}>
                                      {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{module.materialsCount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Instructor</h3>
                        <div className="flex items-center gap-3 p-3 border rounded-md">
                          <Avatar className="h-12 w-12 border">
                            <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{course.instructor}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Mail className="h-3 w-3" /> {course.instructorEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {course.status === "active" && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">Top Students</h3>
                          <div className="space-y-2">
                            {enrolledStudents
                              .sort((a, b) => b.progress - a.progress)
                              .slice(0, 3)
                              .map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-2 border rounded-md">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{student.name}</p>
                                      <p className="text-xs text-muted-foreground">{student.progress}% completed</p>
                                    </div>
                                  </div>
                                  <Progress value={student.progress} className="w-16 h-2" />
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            )}
            
            {activeTab === "materials" && (
              <motion.div
                key="materials"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TabsContent value="materials" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Course Materials</h3>
                      <Button variant="outline" size="sm">
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Add Materials
                      </Button>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {courseModules.map((module) => (
                        <AccordionItem key={module.id} value={module.id}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <span>{module.title}</span>
                              <Badge variant="outline" className={getStatusBadgeColor(module.status)}>
                                {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2 pb-1 space-y-4">
                              <p className="text-sm text-muted-foreground">{module.description}</p>
                              
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Material</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Size</TableHead>
                                      <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {module.materials && module.materials.length > 0 ? (
                                      module.materials.map((material) => (
                                        <TableRow key={material.id}>
                                          <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                              {getMaterialTypeIcon(material.type)}
                                              {material.title}
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                              {material.type}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{material.size}</TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-1">
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="h-4 w-4" />
                                              </Button>
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Download className="h-4 w-4" />
                                              </Button>
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={4} className="h-16 text-center">
                                          No materials available yet.
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>
              </motion.div>
            )}
            
            {activeTab === "students" && (
              <motion.div
                key="students"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TabsContent value="students" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Enrolled Students ({enrolledStudents.length})
                      </h3>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Enrollment
                      </Button>
                    </div>
                    
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enrolledStudents.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  {student.name}
                                </div>
                              </TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={student.progress} className="w-16 h-2" />
                                  <span className="text-xs">{student.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  {formatFullDate(student.lastActivity)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {course.status === "active" && (
            <Button variant="outline" className="sm:mr-auto">
              <BarChart className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}