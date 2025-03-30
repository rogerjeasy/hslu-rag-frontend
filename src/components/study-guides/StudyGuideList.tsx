'use client';

import { useEffect } from 'react';
import { CourseContainer } from './course/CourseContainer';
import { Course } from '@/types/course.types';
import GuideTabContainer from './course/GuideTabContainer';
import { useStudyGuideStore } from '@/store/studyGuideStore';
import {
  StudyGuide,
  StudyGuideSummary,
  ViewMode,
  StudyGuideFormat,
  GuideType
} from '@/types/study-guide.types';

interface StudyGuideListProps {
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
  selectedGuideType: string;
  sortOption: string;
  viewMode: ViewMode;
}

export const summaryToGuide = (summary: StudyGuideSummary): StudyGuide => {
  return {
    ...summary,
    userId: '',
    id: summary.id,
    progress: 0,
    estimatedTime: 30, // Default value in minutes
    lastStudied: undefined,
    sections: [],
    citations: [],
    type: summary.format as GuideType,
    title: summary.topic, // Use topic as title
    updatedAt: summary.createdAt, // Default updatedAt to createdAt if not available
  };
};

export const StudyGuideList = ({
  courses,
  onCourseSelect,
  selectedGuideType,
  sortOption,
  viewMode = 'grid'
}: StudyGuideListProps) => {
  const { 
    fetchStudyGuides, 
    studyGuides, 
    filteredGuides, 
    setSelectedFormat, 
    setSelectedCourse, 
    applyFilters, 
    isLoading 
  } = useStudyGuideStore();

  // Fetch guides when component mounts
  useEffect(() => {
    // Convert selectedGuideType to StudyGuideFormat if not 'all'
    if (selectedGuideType !== 'all') {
      setSelectedFormat(selectedGuideType as StudyGuideFormat);
    } else {
      setSelectedFormat(null);
    }
   
    applyFilters();
   
    // If no guides are loaded yet, fetch them
    if (studyGuides.length === 0) {
      fetchStudyGuides();
    }
  }, [
    fetchStudyGuides, 
    selectedGuideType, 
    sortOption, 
    studyGuides.length, 
    setSelectedFormat, 
    applyFilters
  ]);

  // Helper function to apply sorting
  const getSortedGuides = (): StudyGuideSummary[] => {
    return [...filteredGuides].sort((a, b) => {
      switch(sortOption) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'alphabetical':
          return a.topic.localeCompare(b.topic);
        default:
          return b.createdAt - a.createdAt; // Default to newest
      }
    });
  };

  // Calculate guide counts per course for displaying in course cards
  const guideCountsPerCourse = studyGuides.reduce<Record<string, number>>((counts, guide) => {
    const courseId = guide.courseId || 'uncategorized';
    counts[courseId] = (counts[courseId] || 0) + 1;
    return counts;
  }, {});

  // Convert StudyGuideSummary[] to StudyGuide[] for compatibility with components
  const sortedGuides = getSortedGuides();
  const guidesWithDefaults = sortedGuides.map(summaryToGuide);

  // Handle course selection
  const handleCourseSelect = (id: string) => {
    setSelectedCourse(id);
    onCourseSelect(id);
  };

  return (
    <div className="space-y-6 w-full">
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Guides Tabs Section */}
      <GuideTabContainer
        guides={guidesWithDefaults}
        courses={courses}
        onCourseSelect={handleCourseSelect}
        viewMode={viewMode}
      />
     
      {/* Course Cards Section */}
      <CourseContainer
        courses={courses}
        onCourseSelect={handleCourseSelect}
        guidesCount={guideCountsPerCourse}
        viewMode={viewMode}
      />
    </div>
  );
};

export default StudyGuideList;