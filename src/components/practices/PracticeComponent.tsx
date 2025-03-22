'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Brain,
  CheckCircle, 
  XCircle,
  RefreshCw,
  ChevronRight,
//   HelpCircle,
//   Bookmark,
  AlertCircle
} from 'lucide-react'
import { 
  Card,
  CardContent,
//   CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { PracticeQuestion, PracticeSession } from '@/types/practice.types'
import { Course } from '@/types/course.types'

interface PracticeComponentProps {
  courseId: string
  onComplete?: (results: PracticeSession) => void
}

export const PracticeComponent = ({ courseId, onComplete }: PracticeComponentProps) => {
  // State for practice session
  const [loading, setLoading] = useState<boolean>(true)
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [answered, setAnswered] = useState<boolean>(false)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [sessionResults, setSessionResults] = useState<PracticeSession>({
    courseId,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    completedAt: '',
    questionResults: []
  })
  
  // Mock course data (in a real implementation, fetch from an API)
  const [course, setCourse] = useState<Course | null>(null)

  console.log("course: ", course)
  
  // Fetch questions based on courseId
  useEffect(() => {
    const fetchCourseAndQuestions = async () => {
      setLoading(true)
      
      try {
        // In a real implementation, fetch from an API
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock course data
        const mockCourse: Course = {
          id: courseId,
          name: 'Data Science Fundamentals',
          code: 'DS101',
          description: 'Introduction to key concepts in data science',
          instructor: 'Dr. Smith',
          semester: 'Fall 2025',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          materialsCount: 5,
          credits: 3,
        }
        
        // Mock questions data
        const mockQuestions: PracticeQuestion[] = [
          {
            id: '1',
            question: 'Which of the following is NOT a common algorithm used in supervised learning?',
            options: [
              'Linear Regression',
              'K-means Clustering',
              'Random Forest',
              'Support Vector Machines'
            ],
            correctAnswer: 'K-means Clustering',
            explanation: 'K-means Clustering is an unsupervised learning algorithm used for clustering data points, while Linear Regression, Random Forest, and Support Vector Machines are all supervised learning algorithms.',
            difficulty: 'medium',
            topic: 'Machine Learning',
            sourceReference: 'Lecture 3, Slide 15'
          },
          {
            id: '2',
            question: 'What is the purpose of cross-validation in machine learning?',
            options: [
              'To increase the training speed of the model',
              'To evaluate model performance on unseen data',
              'To visualize high-dimensional data',
              'To reduce the number of features in the dataset'
            ],
            correctAnswer: 'To evaluate model performance on unseen data',
            explanation: 'Cross-validation is a technique used to assess how a model will generalize to an independent dataset. It helps detect overfitting and provides a more accurate measure of model performance.',
            difficulty: 'easy',
            topic: 'Model Evaluation',
            sourceReference: 'Lecture 4, Slide 22'
          },
          {
            id: '3',
            question: 'In the context of a confusion matrix, what does the term "recall" measure?',
            options: [
              'The percentage of positive predictions that are correct',
              'The percentage of negative predictions that are correct',
              'The percentage of actual positives that are correctly identified',
              'The harmonic mean of precision and recall'
            ],
            correctAnswer: 'The percentage of actual positives that are correctly identified',
            explanation: 'Recall (also known as sensitivity) measures the proportion of actual positive cases that were correctly identified by the model. It is calculated as TP/(TP+FN), where TP is true positives and FN is false negatives.',
            difficulty: 'medium',
            topic: 'Model Evaluation',
            sourceReference: 'Lecture 5, Slide 8'
          },
          {
            id: '4',
            question: 'Which statement about the bias-variance tradeoff is correct?',
            options: [
              'High bias models tend to overfit the training data',
              'High variance models tend to underfit the training data',
              'Increasing model complexity typically decreases variance but may increase bias',
              'Increasing model complexity typically increases variance but may decrease bias'
            ],
            correctAnswer: 'Increasing model complexity typically increases variance but may decrease bias',
            explanation: 'As model complexity increases, the model can better fit the training data, which decreases bias but increases variance (risk of overfitting). Simpler models tend to have higher bias but lower variance.',
            difficulty: 'hard',
            topic: 'Model Evaluation',
            sourceReference: 'Lecture 6, Slides 12-15'
          },
          {
            id: '5',
            question: 'What is the primary purpose of using Principal Component Analysis (PCA)?',
            options: [
              'Feature selection',
              'Classification',
              'Dimensionality reduction',
              'Time series forecasting'
            ],
            correctAnswer: 'Dimensionality reduction',
            explanation: 'PCA is primarily used for dimensionality reduction by transforming the original features into a new set of uncorrelated variables called principal components. It helps in visualizing high-dimensional data and reducing computational complexity while preserving as much variance as possible.',
            difficulty: 'medium',
            topic: 'Dimensionality Reduction',
            sourceReference: 'Lecture 8, Slide 19'
          }
        ]
        
        setCourse(mockCourse)
        setQuestions(mockQuestions)
        
        setSessionResults(prev => ({
          ...prev,
          totalQuestions: mockQuestions.length
        }))
      } catch (error) {
        console.error('Error fetching questions:', error)
        // Handle error state
      } finally {
        setLoading(false)
      }
    }
    
    fetchCourseAndQuestions()
  }, [courseId])
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex]
  
  // Calculate progress percentage
  const progressPercentage = questions.length > 0
    ? ((currentQuestionIndex) / questions.length) * 100
    : 0
  
  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (!answered) {
      setSelectedAnswer(answer)
    }
  }
  
  // Submit answer
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || answered) return
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    // Update session results
    setSessionResults(prev => {
      const updatedResults = { ...prev }
      
      if (isCorrect) {
        updatedResults.correctAnswers += 1
      } else {
        updatedResults.incorrectAnswers += 1
      }
      
      updatedResults.questionResults.push({
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer,
        isCorrect,
        timeSpent: 0 // In a real implementation, track time spent
      })
      
      return updatedResults
    })
    
    setAnswered(true)
  }
  
  // Skip question
  const handleSkipQuestion = () => {
    if (answered) return
    
    // Update session results
    setSessionResults(prev => {
      const updatedResults = { ...prev }
      updatedResults.skippedQuestions += 1
      updatedResults.questionResults.push({
        questionId: currentQuestion.id,
        userAnswer: '',
        isCorrect: false,
        timeSpent: 0,
        skipped: true
      })
      
      return updatedResults
    })
    
    goToNextQuestion()
  }
  
  // Go to next question
  const goToNextQuestion = () => {
    setSelectedAnswer('')
    setAnswered(false)
    setShowExplanation(false)
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Session complete
      completeSession()
    }
  }
  
  // Toggle explanation
  const toggleExplanation = () => {
    setShowExplanation(prev => !prev)
  }
  
  // Complete practice session
  const completeSession = () => {
    const completedResults = {
      ...sessionResults,
      completedAt: new Date().toISOString()
    }
    
    setSessionResults(completedResults)
    
    if (onComplete) {
      onComplete(completedResults)
    }
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  }
  
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1 }
//   }
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg text-gray-700">Loading practice questions...</p>
      </div>
    )
  }
  
  // All questions completed
  if (currentQuestionIndex >= questions.length) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="border-2 border-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-xl text-center">Practice Session Completed!</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-xl font-semibold">{sessionResults.correctAnswers}</span>
                <span className="text-gray-600">Correct</span>
              </div>
              <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center">
                <XCircle className="h-8 w-8 text-red-600 mb-2" />
                <span className="text-xl font-semibold">{sessionResults.incorrectAnswers}</span>
                <span className="text-gray-600">Incorrect</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <AlertCircle className="h-8 w-8 text-gray-600 mb-2" />
                <span className="text-xl font-semibold">{sessionResults.skippedQuestions}</span>
                <span className="text-gray-600">Skipped</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-lg font-medium mb-2">Score</p>
              <Progress 
                value={(sessionResults.correctAnswers / sessionResults.totalQuestions) * 100} 
                className="h-4"
              />
              <p className="mt-1 text-right">
                {Math.round((sessionResults.correctAnswers / sessionResults.totalQuestions) * 100)}%
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              Review Answers
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Start New Session
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      {/* Question card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="text-xs mb-2">
              <Brain className="h-3.5 w-3.5 mr-1 text-blue-500" />
              <span>{currentQuestion.topic}</span>
            </Badge>
            <Badge variant={
              currentQuestion.difficulty === 'easy' ? 'outline' : 
              currentQuestion.difficulty === 'medium' ? 'secondary' : 
              'destructive'
            } className="text-xs">
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </Badge>
          </div>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4">
          <RadioGroup 
            value={selectedAnswer} 
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-2 p-3 rounded-md cursor-pointer border ${
                  answered 
                    ? option === currentQuestion.correctAnswer 
                      ? 'bg-green-50 border-green-300' 
                      : selectedAnswer === option && option !== currentQuestion.correctAnswer
                        ? 'bg-red-50 border-red-300'
                        : 'border-gray-200'
                    : selectedAnswer === option
                      ? 'bg-blue-50 border-blue-300'
                      : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleAnswerSelect(option)}
              >
                <RadioGroupItem 
                  value={option} 
                  id={`option-${index}`} 
                  disabled={answered}
                  className="mt-1"
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer text-base font-normal"
                >
                  {option}
                </Label>
                {answered && option === currentQuestion.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                )}
                {answered && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          {answered && (
            <motion.div 
              className={`mt-4 p-4 rounded-md ${
                selectedAnswer === currentQuestion.correctAnswer 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">
                    {selectedAnswer === currentQuestion.correctAnswer 
                      ? 'Correct!' 
                      : 'Incorrect. The correct answer is:'}
                  </p>
                  {selectedAnswer !== currentQuestion.correctAnswer && (
                    <p className="mt-1 font-medium">{currentQuestion.correctAnswer}</p>
                  )}
                  
                  {showExplanation && (
                    <motion.div 
                      className="mt-3 text-sm text-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="font-medium mb-1">Explanation:</p>
                      <p>{currentQuestion.explanation}</p>
                      {currentQuestion.sourceReference && (
                        <p className="mt-2 text-xs text-gray-500">
                          Source: {currentQuestion.sourceReference}
                        </p>
                      )}
                    </motion.div>
                  )}
                  
                  <button 
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={toggleExplanation}
                  >
                    {showExplanation ? 'Hide explanation' : 'Show explanation'}
                    <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between">
          {answered ? (
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={goToNextQuestion}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="w-1/3"
                onClick={handleSkipQuestion}
              >
                Skip
              </Button>
              <Button 
                className="w-2/3 ml-2 bg-blue-600 hover:bg-blue-700"
                disabled={!selectedAnswer}
                onClick={handleSubmitAnswer}
              >
                Check Answer
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      
      {/* Reference section */}
      <div className="flex items-center text-sm text-gray-500">
        <BookOpen className="h-4 w-4 mr-1" />
        <span>From: {currentQuestion.sourceReference}</span>
      </div>
    </motion.div>
  )
}