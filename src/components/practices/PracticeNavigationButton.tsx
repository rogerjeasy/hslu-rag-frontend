'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'

interface PracticeNavigationButtonProps {
  courseId?: string
  className?: string
}

export const PracticeNavigationButton = ({ 
  courseId = 'default-course', 
  className = '' 
}: PracticeNavigationButtonProps) => {
  return (
    <Link href={`/practice?courseId=${courseId}`} passHref>
      <Button 
        variant="outline" 
        className={`flex items-center space-x-2 ${className}`}
      >
        <BookOpen className="h-4 w-4" />
        <span>Practice Questions</span>
      </Button>
    </Link>
  )
}

export default PracticeNavigationButton