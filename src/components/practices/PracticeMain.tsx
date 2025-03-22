'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, 
  ArrowLeft,
  Settings,
  PlayCircle,
  History,
  ListChecks
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PracticeComponent } from './PracticeComponent'
import { PracticeSettings } from './PracticeSettings'
import { PracticeHistory } from './PracticeHistory'
import { PracticeSession } from '@/types/practice.types'

interface PracticeMainProps {
  params: {
    courseId: string
  }
}

export default function PracticeMain({ params }: PracticeMainProps) {
  const { courseId } = params
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<string>('practice')
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false)
  
  // Handle practice session completion
  const handleSessionComplete = (results: PracticeSession) => {
    console.log('Practice session completed:', results)
    setIsSessionActive(false)
  }
  
  // Start a new practice session
  const startPracticeSession = () => {
    setIsSessionActive(true)
  }
  
  // Go back to course page
  const handleBackToCourse = () => {
    router.push(`/courses?courseId=${courseId}`)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 mr-2"
              onClick={handleBackToCourse}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Practice Questions</h1>
          </div>
          <p className="text-gray-600">
            Test your knowledge with practice questions from your course materials.
          </p>
        </div>
        
        {/* Main content */}
        {isSessionActive ? (
          <PracticeComponent 
            courseId={courseId} 
            onComplete={handleSessionComplete}
          />
        ) : (
          <Tabs 
            defaultValue="practice" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="practice" className="data-[state=active]:bg-blue-50">
                <PlayCircle className="h-4 w-4 mr-2" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-blue-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-blue-50">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="practice" className="mt-0">
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex flex-col items-center text-center py-6">
                  <div className="p-3 bg-blue-100 rounded-full mb-4">
                    <ListChecks className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Ready to Practice?</h2>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Start a new practice session with questions generated from your course materials. 
                    Test your knowledge and track your progress.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={startPracticeSession}
                  >
                    Start Practice Session
                  </Button>
                </div>
                
                {/* Quick settings */}
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <div className="bg-blue-50 p-2 rounded-md">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">All Topics</p>
                        <p className="text-xs text-gray-500">Covers entire course</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-yellow-50 p-2 rounded-md">
                        <Settings className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Mixed Difficulty</p>
                        <p className="text-xs text-gray-500">Easy to hard questions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-green-50 p-2 rounded-md">
                        <ListChecks className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">5 Questions</p>
                        <p className="text-xs text-gray-500">Per practice session</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('settings')}
                    >
                      Customize
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <PracticeSettings courseId={courseId} />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <PracticeHistory courseId={courseId} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}