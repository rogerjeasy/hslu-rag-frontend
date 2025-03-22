// src/types/practice.types.ts
  
  export interface PracticeQuestion {
    id: string
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
    difficulty: 'easy' | 'medium' | 'hard'
    topic: string
    sourceReference: string
    tags?: string[]
    imageUrl?: string
    codeSnippet?: string
  }
  
  export interface QuestionResult {
    questionId: string
    userAnswer: string
    isCorrect: boolean
    timeSpent: number // in seconds
    skipped?: boolean
  }
  
  export interface PracticeSession {
    courseId: string
    totalQuestions: number
    correctAnswers: number
    incorrectAnswers: number
    skippedQuestions: number
    completedAt: string
    questionResults: QuestionResult[]
    topicStats?: {
      [topic: string]: {
        correct: number
        total: number
      }
    }
  }
  
  export interface PracticeSettings {
    topicsToInclude: string[]
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
    numberOfQuestions: number
    timeLimit?: number // in minutes, optional
  }
  
  export interface PracticeHistory {
    userId: string
    courseId: string
    sessions: {
      sessionId: string
      date: string
      score: number
      questionsAnswered: number
    }[]
  }
  
  export interface TopicPerformance {
    topic: string
    correctPercentage: number
    questionsAttempted: number
    status: 'strong' | 'moderate' | 'weak'
  }
  
  export interface UserProgress {
    userId: string
    courseId: string
    topicPerformance: TopicPerformance[]
    overallScore: number
    recommendedTopics: string[]
    lastPracticeDate: string
  }