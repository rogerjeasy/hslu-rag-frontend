// src/types/statistics.types.ts

// Public Statistics
export interface PublicStatistics {
    totalUsers: number;
    totalCourses: number;
    totalConversations: number;
    totalStudyGuides: number;
    totalPracticeQuestions: number;
    activeCourses: number;
    lastUpdated: string | null;
  }
  
  // Platform-wide Statistics
  export interface PlatformStatistics extends PublicStatistics {
    totalMessages: number;
    activeUsersLastDay: number;
    activeUsersLastWeek: number;
    activeUsersLastMonth: number;
  }
  
  // Course-specific Statistics
  export interface CourseStatistics {
    courseId: string;
    courseName: string;
    enrolledStudents: number;
    totalConversations: number;
    totalMessages: number;
    totalStudyGuides: number;
    totalPracticeQuestions: number;
    totalKnowledgeGaps: number;
    activeStudentsLastWeek: number;
    activeStudentsLastMonth: number;
    mostDiscussedTopics: string[];
    mostDifficultTopics: string[];
    lastUpdated: string | null;
  }
  
  // User-specific Statistics
  export interface UserStatistics {
    userId: string;
    coursesEnrolled: number;
    totalConversations: number;
    totalMessages: number;
    totalStudyGuides: number;
    totalPracticeQuestions: number;
    totalKnowledgeGaps: number;
    lastActive: string | null;
    averageSessionDuration: number;
    totalStudyTime: number;
    strongestTopics: string[];
    weakestTopics: string[];
    lastUpdated: string | null;
  }
  
  // Time Series Data Point
  export interface TimeSeriesDataPoint {
    timestamp: string;
    value: number;
  }
  
  // Time Series Statistic
  export interface TimeSeriesStatistic {
    metricName: string;
    metricType: string;
    dataPoints: TimeSeriesDataPoint[];
    lastUpdated: string | null;
  }