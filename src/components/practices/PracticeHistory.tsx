'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarDays, 
  BarChart4, 
  ArrowUpRight,
  TrendingUp,
  Brain
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
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { PracticeHistory as PracticeHistoryType, UserProgress } from '@/types/practice.types'

interface PracticeHistoryProps {
  courseId: string
}

export const PracticeHistory = ({ courseId }: PracticeHistoryProps) => {
  // State for user history
  const [userHistory, setUserHistory] = useState<PracticeHistoryType | null>(null)
  // State for user progress
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  // State for loading
  const [loading, setLoading] = useState<boolean>(true)
  
  // Fetch user history and progress for this course
  useEffect(() => {
    // In a real app, you would fetch from an API
    // Simulating API call with mock data
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock history data
        const mockHistory: PracticeHistoryType = {
          userId: 'user-123',
          courseId,
          sessions: [
            {
              sessionId: 'session-1',
              date: '2025-03-15T14:30:00Z',
              score: 80,
              questionsAnswered: 10
            },
            {
              sessionId: 'session-2',
              date: '2025-03-12T10:15:00Z',
              score: 70,
              questionsAnswered: 10
            },
            {
              sessionId: 'session-3',
              date: '2025-03-08T16:45:00Z',
              score: 60,
              questionsAnswered: 5
            },
            {
              sessionId: 'session-4',
              date: '2025-03-05T09:20:00Z',
              score: 50,
              questionsAnswered: 10
            },
            {
              sessionId: 'session-5',
              date: '2025-03-01T11:10:00Z',
              score: 40,
              questionsAnswered: 5
            }
          ]
        }
        
        // Mock progress data
        const mockProgress: UserProgress = {
          userId: 'user-123',
          courseId,
          topicPerformance: [
            {
              topic: 'Machine Learning Basics',
              correctPercentage: 85,
              questionsAttempted: 20,
              status: 'strong'
            },
            {
              topic: 'Data Preparation',
              correctPercentage: 75,
              questionsAttempted: 12,
              status: 'moderate'
            },
            {
              topic: 'Model Evaluation',
              correctPercentage: 90,
              questionsAttempted: 10,
              status: 'strong'
            },
            {
              topic: 'Dimensionality Reduction',
              correctPercentage: 60,
              questionsAttempted: 5,
              status: 'moderate'
            },
            {
              topic: 'Clustering',
              correctPercentage: 40,
              questionsAttempted: 10,
              status: 'weak'
            }
          ],
          overallScore: 72,
          recommendedTopics: ['Clustering', 'Dimensionality Reduction'],
          lastPracticeDate: '2025-03-15T14:30:00Z'
        }
        
        setUserHistory(mockHistory)
        setUserProgress(mockProgress)
      } catch (error) {
        console.error('Error fetching history data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [courseId])
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy')
  }
  
  // Format time for display
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a')
  }
  
  // Get status color for topic performance
  const getStatusColor = (status: 'strong' | 'moderate' | 'weak') => {
    switch (status) {
      case 'strong':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'weak':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-500">Loading practice history...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // No history state
  if (!userHistory || userHistory.sessions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-10">
          <div className="flex flex-col items-center text-center max-w-md">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Practice History</h3>
            <p className="text-gray-600 mb-4">
              You haven&apos;t completed any practice sessions for this course yet. 
              Start practicing to track your progress!
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start First Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Performance Overview</CardTitle>
          <CardDescription>
            Your overall performance and topic strengths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Overall Score */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Overall Score</span>
                <BarChart4 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{userProgress?.overallScore}%</span>
                <span className="ml-2 text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on {userHistory.sessions.length} practice sessions</p>
            </div>
            
            {/* Practice Streak */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Last Practice</span>
                <CalendarDays className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold">{formatDate(userProgress?.lastPracticeDate || '')}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">at {formatTime(userProgress?.lastPracticeDate || '')}</p>
            </div>
            
            {/* Topics Mastered */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Strong Topics</span>
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  {userProgress?.topicPerformance.filter(t => t.status === 'strong').length}
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  / {userProgress?.topicPerformance.length}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Topics with 80%+ correctness</p>
            </div>
          </div>
          
          {/* Topic Performance */}
          <div>
            <h3 className="text-base font-semibold mb-3">Topic Performance</h3>
            <div className="space-y-3">
              {userProgress?.topicPerformance.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getStatusColor(topic.status)}`}>
                      {topic.correctPercentage}%
                    </Badge>
                    <span className="text-sm">{topic.topic}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {topic.questionsAttempted} questions
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended Topics */}
          {userProgress?.recommendedTopics && userProgress.recommendedTopics.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Recommended Focus Areas</h3>
              <ul className="space-y-1">
                {userProgress.recommendedTopics.map((topic, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-2 text-yellow-600" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Practice Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Practice History</CardTitle>
          <CardDescription>
            Your recent practice sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userHistory.sessions.map((session, index) => (
              <div key={session.sessionId} className="relative">
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{formatDate(session.date)}</p>
                    <p className="text-sm text-gray-500">{formatTime(session.date)}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Questions</p>
                    <p className="font-medium">{session.questionsAnswered}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Score</p>
                    <p className={`font-medium ${
                      session.score >= 80 ? 'text-green-600' : 
                      session.score >= 60 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {session.score}%
                    </p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                
                {index < userHistory.sessions.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">
            View All History
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default PracticeHistory