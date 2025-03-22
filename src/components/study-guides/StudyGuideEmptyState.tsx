// src/components/study-guides/StudyGuideEmptyState.tsx
'use client'

import { Button } from "@/components/ui/button"
import { BookOpen, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export const StudyGuideEmptyState = () => {
  const router = useRouter()
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed rounded-lg"
    >
      <div className="bg-blue-50 p-3 rounded-full">
        <BookOpen className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No study guides found</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md">
        You haven&apos;t created any study guides yet or your current filters don&apos;t match any guides.
      </p>
      
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => router.push('/courses')}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Browse courses
        </Button>
        <Button 
          onClick={() => {/* Reset filters function would go here */}}
          variant="ghost"
        >
          Reset filters
        </Button>
      </div>
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <EmptyStateFeature 
          icon={<FileText className="h-6 w-6 text-blue-500" />}
          title="Summaries"
          description="Create condensed summaries of course content for quick revision."
        />
        <EmptyStateFeature 
          icon={<Brain className="h-6 w-6 text-purple-500" />}
          title="Concept Maps"
          description="Visualize relationships between key course concepts."
        />
        <EmptyStateFeature 
          icon={<ListChecks className="h-6 w-6 text-green-500" />}
          title="Practice Tests"
          description="Test your knowledge with exam-style questions."
        />
      </div>
    </motion.div>
  )
}

interface EmptyStateFeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

const EmptyStateFeature = ({ icon, title, description }: EmptyStateFeatureProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">{icon}</div>
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  )
}

// Icon components
const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
)

const Brain = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
)

const ListChecks = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 7 3 3 3-3" />
    <path d="M6 10V5a2 2 0 0 1 4 0v2a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v3" />
    <path d="M9 13c-.6.7-1.4 1.1-2.5 1.1-2.5 0-3.5-1.9-3.5-4.2C3 7.2 4 5 6.5 5" />
    <path d="M21 5.3C20.5 5.1 20 5 19.5 5c-1.5 0-2.6.4-3.5 1.5" />
    <line x1="3" x2="21" y1="19" y2="19" />
    <line x1="3" x2="21" y1="15" y2="15" />
  </svg>
)