'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  FileText, 
  Brain, 
  ListChecks, 
  // Cards, // Removing the non-existent import
  CreditCard, // Using CreditCard as a replacement (or another icon from options below)
  Clock, 
//   BarChart3,
  ArrowRight,
  Calendar,
  Users
} from 'lucide-react'
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Course } from '@/types/course.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

// Mock study guide types and data that would come from a real API
interface StudyGuide {
  id: string
  title: string
  description: string
  type: 'summary' | 'concept' | 'practice' | 'flashcard'
  courseId: string
  createdAt: string
  updatedAt: string
  progress: number
  estimatedTime: number
  lastStudied?: string
}

interface StudyGuideListProps {
  courses: Course[]
  onCourseSelect: (courseId: string) => void
  selectedGuideType: string
  sortOption: string
}

export const StudyGuideList = ({ 
  courses, 
  onCourseSelect,
  selectedGuideType,
  sortOption
}: StudyGuideListProps) => {
  // Tab state for different view modes
  const [viewMode, setViewMode] = useState('all')
  console.log(viewMode)
  
  // Mock data - in real app, this would come from an API
  const mockStudyGuides = generateMockStudyGuides(courses)
  
  // Filter guides based on selected type and course status
  const filteredGuides = mockStudyGuides.filter(guide => {
    const courseIsActive = courses.find(c => c.id === guide.courseId)?.status === 'active'
    
    if (!courseIsActive) return false
    if (selectedGuideType === 'all') return true
    return guide.type === selectedGuideType
  })
  
  // Get filtered courses (active only)
  const activeCourses = courses.filter(c => c.status === 'active')
  
  // Sort guides based on selected option
  const sortedGuides = [...filteredGuides].sort((a, b) => {
    switch (sortOption) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case 'priority':
        // Priority would be based on exam dates, here we'll just use reverse creation date
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'progress':
        return b.progress - a.progress
      case 'name':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
  
  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-6">
      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setViewMode}>
        <div className="flex justify-between items-center">
          <TabsList className="bg-blue-50">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All Guides</TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-white">Recently Studied</TabsTrigger>
            <TabsTrigger value="recommended" className="data-[state=active]:bg-white">Recommended</TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-gray-500">
            {sortedGuides.length} guides available
          </div>
        </div>
        
        <TabsContent value="all" className="mt-6">
          <GuideGrid guides={sortedGuides} courses={courses} onCourseSelect={onCourseSelect} />
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          {sortedGuides.length > 0 ? (
            <GuideGrid 
              guides={sortedGuides.filter(guide => guide.lastStudied).slice(0, 6)} 
              courses={courses} 
              onCourseSelect={onCourseSelect} 
            />
          ) : (
            <EmptyTabState 
              title="No recently studied guides" 
              description="Start studying to see your recent guides here." 
            />
          )}
        </TabsContent>
        
        <TabsContent value="recommended" className="mt-6">
          {sortedGuides.length > 0 ? (
            <GuideGrid 
              guides={sortedGuides.filter(guide => guide.progress < 70).slice(0, 6)} 
              courses={courses} 
              onCourseSelect={onCourseSelect}
              isRecommended
            />
          ) : (
            <EmptyTabState 
              title="No recommendations yet" 
              description="Keep studying and we'll recommend guides based on your progress." 
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Course Cards Section */}
      <div className="pt-8 pb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Your Courses</h2>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"
        >
          {activeCourses.map((course) => (
            <motion.div key={course.id} variants={item}>
              <CourseCard 
                course={course} 
                onSelect={() => onCourseSelect(course.id)}
                guideCount={mockStudyGuides.filter(g => g.courseId === course.id).length}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

interface CourseCardProps {
  course: Course
  onSelect: () => void
  guideCount: number
}

const CourseCard = ({ course, onSelect, guideCount }: CourseCardProps) => {
  return (
    <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-indigo-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <span className="text-lg font-semibold text-gray-800">{course.name}</span>
          <Badge variant="outline" className="bg-indigo-50">{course.code}</Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1 text-indigo-500" />
            <span>{guideCount} guides</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
            <span>{course.semester}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-indigo-500" />
            <span>{course.instructor}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={onSelect} className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200">
          <span>View Study Guides</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

interface GuideGridProps {
  guides: StudyGuide[]
  courses: Course[]
  onCourseSelect: (courseId: string) => void
  isRecommended?: boolean
}

const GuideGrid = ({ guides, courses, onCourseSelect, isRecommended = false }: GuideGridProps) => {
  if (guides.length === 0) {
    return (
      <EmptyTabState 
        title="No guides available" 
        description="Select a course to get started with study guides." 
      />
    )
  }
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }
  
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"
    >
      {guides.map((guide) => {
        const course = courses.find(c => c.id === guide.courseId)
        if (!course) return null
        
        return (
          <motion.div key={guide.id} variants={item}>
            <GuideCard 
              guide={guide} 
              course={course} 
              onSelect={() => onCourseSelect(guide.courseId)} 
              isRecommended={isRecommended}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

interface GuideCardProps {
  guide: StudyGuide
  course: Course
  onSelect: () => void
  isRecommended: boolean
}

const GuideCard = ({ guide, course, onSelect, isRecommended }: GuideCardProps) => {
  // Get the appropriate icon for the guide type
  const getGuideIcon = () => {
    switch (guide.type) {
      case 'summary':
        return <FileText className="h-4 w-4 mr-1 text-blue-500" />
      case 'concept':
        return <Brain className="h-4 w-4 mr-1 text-purple-500" />
      case 'practice':
        return <ListChecks className="h-4 w-4 mr-1 text-green-500" />
      case 'flashcard':
        // Changed from Cards to CreditCard
        return <CreditCard className="h-4 w-4 mr-1 text-orange-500" />
      default:
        return <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
    }
  }
  
  // Get the appropriate color for the guide type
  const getGuideBorderColor = () => {
    switch (guide.type) {
      case 'summary':
        return 'border-l-blue-500'
      case 'concept':
        return 'border-l-purple-500'
      case 'practice':
        return 'border-l-green-500'
      case 'flashcard':
        return 'border-l-orange-500'
      default:
        return 'border-l-blue-500'
    }
  }
  
  // Get formatted guide type label
  const getGuideTypeLabel = () => {
    switch (guide.type) {
      case 'summary':
        return 'Summary Guide'
      case 'concept':
        return 'Concept Map'
      case 'practice':
        return 'Practice Test'
      case 'flashcard':
        return 'Flashcard Set'
      default:
        return 'Study Guide'
    }
  }
  
  return (
    <Card className={`h-full transition-all hover:shadow-md border-l-4 ${getGuideBorderColor()}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="text-xs mb-2">
            {getGuideIcon()}
            {getGuideTypeLabel()}
          </Badge>
          
          {isRecommended && (
            <Badge className="bg-green-500">Recommended</Badge>
          )}
        </div>
        <CardTitle className="text-lg">{guide.title}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{course.name} ({course.code})</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{guide.progress}%</span>
            </div>
            <Progress value={guide.progress} className="h-2" />
          </div>
          
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{guide.estimatedTime} min</span>
            </div>
            
            {guide.lastStudied && (
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Last studied {formatDate(guide.lastStudied)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onSelect}>
          Continue Studying
        </Button>
      </CardFooter>
    </Card>
  )
}

interface EmptyTabStateProps {
  title: string
  description: string
}

const EmptyTabState = ({ title, description }: EmptyTabStateProps) => {
  return (
    <div className="text-center py-12 px-4 border border-dashed rounded-lg">
      <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  )
}

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Generate mock study guides for demonstration purposes
function generateMockStudyGuides(courses: Course[]): StudyGuide[] {
  const guideTypes: Array<'summary' | 'concept' | 'practice' | 'flashcard'> = ['summary', 'concept', 'practice', 'flashcard']
  const guides: StudyGuide[] = []
  
  courses.forEach(course => {
    // Create between 1-4 guides per course
    const guideCount = Math.floor(Math.random() * 4) + 1
    
    for (let i = 0; i < guideCount; i++) {
      const guideType = guideTypes[Math.floor(Math.random() * guideTypes.length)]
      const progress = Math.floor(Math.random() * 100)
      const timeAgo = Math.floor(Math.random() * 14) + 1 // 1-14 days ago
      
      const title = getGuideTitle(course.name, guideType, i)
      
      guides.push({
        id: `${course.id}-guide-${i}`,
        title,
        description: `Study guide for ${course.name}`,
        type: guideType,
        courseId: course.id,
        createdAt: new Date(Date.now() - (timeAgo + 7) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - timeAgo * 24 * 60 * 60 * 1000).toISOString(),
        progress,
        estimatedTime: Math.floor(Math.random() * 120) + 15, // 15-135 minutes
        lastStudied: Math.random() > 0.3 
          ? new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString() 
          : undefined
      })
    }
  })
  
  return guides
}

function getGuideTitle(courseName: string, guideType: string, index: number): string {
  switch (guideType) {
    case 'summary':
      return index === 0 
        ? `Complete ${courseName} Summary` 
        : `${courseName} - Module ${index} Summary`
    case 'concept':
      return index === 0
        ? `${courseName} Key Concepts Map`
        : `${courseName} - Advanced Concepts Map`
    case 'practice':
      return index === 0
        ? `${courseName} Practice Exam`
        : `${courseName} Quiz ${index}`
    case 'flashcard':
      return index === 0
        ? `${courseName} Terminology Flashcards`
        : `${courseName} - Set ${index} Flashcards`
    default:
      return `${courseName} Study Guide`
  }
}