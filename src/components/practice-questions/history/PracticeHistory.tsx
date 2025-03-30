"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  BookOpen, 
  BarChart2, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PracticeHistoryProps {
  courses: {
    id: string;
    name: string;
    color: string;
  }[];
}

export const PracticeHistory: React.FC<PracticeHistoryProps> = ({ courses }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Practice History (No yet Fully functional)</h2>
          <p className="text-muted-foreground">
            View your practice sessions and track your progress over time.
          </p>
        </div>
        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Start practicing to see your stats
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questions Answered
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Start practicing to see your stats
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Accuracy Rate
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Start practicing to see your stats
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Time per Question
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--:--</div>
            <p className="text-xs text-muted-foreground">
              Start practicing to see your stats
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Practice Sessions</CardTitle>
          <CardDescription>
            Your practice history will appear here once you start practicing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md">
            <div className="flex flex-col items-center justify-center h-full min-h-[240px] text-center p-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100,
                  duration: 0.5 
                }}
                className="relative mb-6"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut" 
                  }}
                >
                  <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mx-auto">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <Badge variant="outline" className="bg-background">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    No data
                  </Badge>
                </motion.div>
              </motion.div>
              
              <h3 className="text-lg font-semibold mb-2">No Practice History Yet</h3>
              <p className="text-muted-foreground text-sm max-w-md mb-6">
                Your practice sessions and progress will be displayed here once you start practicing. 
                Choose a question set to begin your learning journey.
              </p>
              
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Question Sets
              </Button>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Showing data for all {courses.length} courses
          </p>
          <Button variant="ghost" size="sm" disabled>
            View All
          </Button>
        </CardFooter>
      </Card>

      <Separator className="my-4" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progress by Course</CardTitle>
            <CardDescription>
              Course-specific practice statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-medium mb-2">No Course Data Available</h4>
              <p className="text-xs text-muted-foreground">
                Practice statistics by course will appear here as you complete practice sessions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenging Topics</CardTitle>
            <CardDescription>
              Topics that may need more attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-medium mb-2">No Topic Data Available</h4>
              <p className="text-xs text-muted-foreground">
                Topics requiring more practice will be highlighted here as you complete questions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PracticeHistory;


// "use client";

// import React, { useState, useEffect } from 'react';
// import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
// import { HistoryHeader } from './HistoryHeader';
// import { HistoryList } from './HistoryList';
// import { HistoryFilters } from './HistoryFilters';
// import { HistoryEmpty } from './HistoryEmpty';
// import { HistoryLoadingSkeleton } from './HistoryLoadingSkeleton';
// import { HistoryError } from './HistoryError';
// import { HistoryStats } from './HistoryStats';
// import { QuestionSetSummary } from '@/types/practice-questions.types';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// import { motion } from 'framer-motion';

// interface PracticeHistoryProps {
//   courses: { id: string; name: string; color: string }[];
// }

// export function PracticeHistory({ courses }: PracticeHistoryProps) {
//   const {
//     questionSets,
//     isLoading,
//     error,
//     fetchQuestionSets,
//     clearError,
//     courseFilter,
//     setCourseFilter
//   } = usePracticeQuestionsStore();

//   const [filteredSets, setFilteredSets] = useState<QuestionSetSummary[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [timeRange, setTimeRange] = useState<'all' | 'recent' | 'week' | 'month'>('all');
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');
//   // const [showStats, setShowStats] = useState(true);
  
//   // Fetch question sets when component mounts
//   useEffect(() => {
//     fetchQuestionSets(courseFilter || undefined);
//   }, [fetchQuestionSets, courseFilter]);

//   // Filter question sets based on time range, search term and course
//   useEffect(() => {
//     let filtered = [...questionSets];

//     // Apply time range filter
//     if (timeRange !== 'all') {
//       const now = new Date();
//       const cutoffDate = new Date();
      
//       switch (timeRange) {
//         case 'recent':
//           cutoffDate.setDate(now.getDate() - 3); // Last 3 days
//           break;
//         case 'week':
//           cutoffDate.setDate(now.getDate() - 7); // Last week
//           break;
//         case 'month':
//           cutoffDate.setMonth(now.getMonth() - 1); // Last month
//           break;
//       }
      
//       filtered = filtered.filter(set => {
//         const createdAt = new Date(set.createdAt);
//         return createdAt >= cutoffDate;
//       });
//     }

//     // Apply search term filter
//     if (searchTerm) {
//       const lowerSearchTerm = searchTerm.toLowerCase();
//       filtered = filtered.filter(set => 
//         set.title.toLowerCase().includes(lowerSearchTerm) ||
//         (set.description && set.description.toLowerCase().includes(lowerSearchTerm))
//       );
//     }

//     // Apply course filter
//     if (courseFilter) {
//       filtered = filtered.filter(set => set.courseId === courseFilter);
//     }

//     // Sort by most recent first
//     filtered.sort((a, b) => 
//       new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );

//     // If on completed tab, we would filter accordingly
//     // This is a placeholder for when you add completion data
//     if (activeTab === 'completed') {
//       // In a real implementation, you would filter based on completion status
//       // For now, we're just showing all items in both tabs
//     }

//     setFilteredSets(filtered);
//   }, [questionSets, searchTerm, timeRange, activeTab, courseFilter]);

//   // Handle refresh button click
//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     try {
//       await fetchQuestionSets(courseFilter || undefined);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   // Get course info by ID
//   const getCourseInfo = (courseId: string) => {
//     return courses.find(course => course.id === courseId) || null;
//   };

//   // Render loading state
//   if (isLoading && !isRefreshing && questionSets.length === 0) {
//     return <HistoryLoadingSkeleton />;
//   }

//   // Render error state
//   if (error && !isRefreshing) {
//     return (
//       <HistoryError 
//         error={error} 
//         onRetry={() => {
//           clearError();
//           fetchQuestionSets(courseFilter || undefined);
//         }} 
//       />
//     );
//   }

//   return (
//     <div className="space-y-6 transition-all">
//       {/* Header with title and actions */}
//       <HistoryHeader 
//         onRefresh={handleRefresh} 
//         isRefreshing={isRefreshing} 
//       />
      
//       {/* Stats section (collapsible) */}
//       <Accordion
//         type="single"
//         collapsible
//         defaultValue="stats"
//         className="w-full bg-card rounded-lg border"
//       >
//         <AccordionItem value="stats" className="border-0">
//           <AccordionTrigger className="px-4 py-2 hover:no-underline">
//             <div className="flex items-center">
//               <span className="font-medium">Statistics Overview</span>
//             </div>
//           </AccordionTrigger>
//           <AccordionContent className="px-4 pb-4">
//             <HistoryStats questionSets={questionSets} />
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
      
//       {/* Tabs for different views */}
//       <Tabs 
//         defaultValue="all" 
//         className="w-full"
//         onValueChange={(value) => setActiveTab(value as 'all' | 'completed')}
//       >
//         <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
//           <TabsTrigger value="all" className="transition-all">All History</TabsTrigger>
//           <TabsTrigger value="completed" className="transition-all">Completed Sets</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="all" className="space-y-6 animate-in fade-in-50">
//           {/* Search and filters */}
//           <HistoryFilters 
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             timeRange={timeRange}
//             onTimeRangeChange={setTimeRange}
//             courses={courses}
//             onCourseChange={setCourseFilter}
//             selectedCourse={courseFilter}
//           />
          
//           {/* History list or empty state */}
//           {filteredSets.length > 0 ? (
//             <HistoryList 
//               questionSets={filteredSets} 
//               getCourseInfo={getCourseInfo} 
//             />
//           ) : (
//             <HistoryEmpty 
//               hasFilters={!!searchTerm || timeRange !== 'all' || !!courseFilter} 
//               onClearFilters={() => {
//                 setSearchTerm('');
//                 setTimeRange('all');
//                 setCourseFilter(null);
//               }}
//             />
//           )}
//         </TabsContent>
        
//         <TabsContent value="completed" className="space-y-6 animate-in fade-in-50">
//           {/* Search and filters */}
//           <HistoryFilters 
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             timeRange={timeRange}
//             onTimeRangeChange={setTimeRange}
//             courses={courses}
//             onCourseChange={setCourseFilter}
//             selectedCourse={courseFilter}
//           />
          
//           {/* History list or empty state */}
//           {filteredSets.length > 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.3 }}
//             >
//               <HistoryList 
//                 questionSets={filteredSets} 
//                 getCourseInfo={getCourseInfo}
//                 showScore={true}
//               />
//             </motion.div>
//           ) : (
//             <HistoryEmpty 
//               hasFilters={!!searchTerm || timeRange !== 'all' || !!courseFilter} 
//               onClearFilters={() => {
//                 setSearchTerm('');
//                 setTimeRange('all');
//                 setCourseFilter(null);
//               }}
//               emptyMessage="You haven't completed any practice question sets yet."
//             />
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }