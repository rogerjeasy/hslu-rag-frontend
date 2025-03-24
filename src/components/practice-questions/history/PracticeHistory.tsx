"use client";

import React, { useState, useEffect } from 'react';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { HistoryHeader } from './HistoryHeader';
import { HistoryList } from './HistoryList';
import { HistoryFilters } from './HistoryFilters';
import { HistoryEmpty } from './HistoryEmpty';
import { HistoryLoadingSkeleton } from './HistoryLoadingSkeleton';
import { HistoryError } from './HistoryError';
import { HistoryStats } from './HistoryStats';
import { QuestionSetSummary } from '@/types/practice-questions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

interface PracticeHistoryProps {
  courses: { id: string; name: string; color: string }[];
}

export function PracticeHistory({ courses }: PracticeHistoryProps) {
  const {
    questionSets,
    isLoading,
    error,
    fetchQuestionSets,
    clearError,
    courseFilter,
    setCourseFilter
  } = usePracticeQuestionsStore();

  const [filteredSets, setFilteredSets] = useState<QuestionSetSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | 'recent' | 'week' | 'month'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');
  // const [showStats, setShowStats] = useState(true);
  
  // Fetch question sets when component mounts
  useEffect(() => {
    fetchQuestionSets(courseFilter || undefined);
  }, [fetchQuestionSets, courseFilter]);

  // Filter question sets based on time range, search term and course
  useEffect(() => {
    let filtered = [...questionSets];

    // Apply time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeRange) {
        case 'recent':
          cutoffDate.setDate(now.getDate() - 3); // Last 3 days
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7); // Last week
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1); // Last month
          break;
      }
      
      filtered = filtered.filter(set => {
        const createdAt = new Date(set.createdAt);
        return createdAt >= cutoffDate;
      });
    }

    // Apply search term filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(set => 
        set.title.toLowerCase().includes(lowerSearchTerm) ||
        (set.description && set.description.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Apply course filter
    if (courseFilter) {
      filtered = filtered.filter(set => set.courseId === courseFilter);
    }

    // Sort by most recent first
    filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // If on completed tab, we would filter accordingly
    // This is a placeholder for when you add completion data
    if (activeTab === 'completed') {
      // In a real implementation, you would filter based on completion status
      // For now, we're just showing all items in both tabs
    }

    setFilteredSets(filtered);
  }, [questionSets, searchTerm, timeRange, activeTab, courseFilter]);

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchQuestionSets(courseFilter || undefined);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get course info by ID
  const getCourseInfo = (courseId: string) => {
    return courses.find(course => course.id === courseId) || null;
  };

  // Render loading state
  if (isLoading && !isRefreshing && questionSets.length === 0) {
    return <HistoryLoadingSkeleton />;
  }

  // Render error state
  if (error && !isRefreshing) {
    return (
      <HistoryError 
        error={error} 
        onRetry={() => {
          clearError();
          fetchQuestionSets(courseFilter || undefined);
        }} 
      />
    );
  }

  return (
    <div className="space-y-6 transition-all">
      {/* Header with title and actions */}
      <HistoryHeader 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
      />
      
      {/* Stats section (collapsible) */}
      <Accordion
        type="single"
        collapsible
        defaultValue="stats"
        className="w-full bg-card rounded-lg border"
      >
        <AccordionItem value="stats" className="border-0">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center">
              <span className="font-medium">Statistics Overview</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <HistoryStats questionSets={questionSets} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Tabs for different views */}
      <Tabs 
        defaultValue="all" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value as 'all' | 'completed')}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="all" className="transition-all">All History</TabsTrigger>
          <TabsTrigger value="completed" className="transition-all">Completed Sets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6 animate-in fade-in-50">
          {/* Search and filters */}
          <HistoryFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            courses={courses}
            onCourseChange={setCourseFilter}
            selectedCourse={courseFilter}
          />
          
          {/* History list or empty state */}
          {filteredSets.length > 0 ? (
            <HistoryList 
              questionSets={filteredSets} 
              getCourseInfo={getCourseInfo} 
            />
          ) : (
            <HistoryEmpty 
              hasFilters={!!searchTerm || timeRange !== 'all' || !!courseFilter} 
              onClearFilters={() => {
                setSearchTerm('');
                setTimeRange('all');
                setCourseFilter(null);
              }}
            />
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6 animate-in fade-in-50">
          {/* Search and filters */}
          <HistoryFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            courses={courses}
            onCourseChange={setCourseFilter}
            selectedCourse={courseFilter}
          />
          
          {/* History list or empty state */}
          {filteredSets.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <HistoryList 
                questionSets={filteredSets} 
                getCourseInfo={getCourseInfo}
                showScore={true}
              />
            </motion.div>
          ) : (
            <HistoryEmpty 
              hasFilters={!!searchTerm || timeRange !== 'all' || !!courseFilter} 
              onClearFilters={() => {
                setSearchTerm('');
                setTimeRange('all');
                setCourseFilter(null);
              }}
              emptyMessage="You haven't completed any practice question sets yet."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}