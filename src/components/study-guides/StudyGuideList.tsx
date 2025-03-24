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
} from '@/types/study-guide';

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
    progress: 0, 
    estimatedTime: 30, // Default value in minutes
    lastStudied: undefined,
    sections: [],
    citations: [],
    type: summary.format as GuideType, 
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
    guides, 
    filteredGuides, 
    fetchGuides, 
    setSelectedFormat, 
    applyFilters 
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
    if (guides.length === 0) {
      fetchGuides();
    }
  }, [fetchGuides, selectedGuideType, sortOption, guides.length, setSelectedFormat, applyFilters]);

  // Calculate guide counts per course for displaying in course cards
  const guideCountsPerCourse = guides.reduce((counts, guide) => {
    counts[guide.courseId] = (counts[guide.courseId] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Convert StudyGuideSummary[] to StudyGuide[] for compatibility with components
  const guidesWithDefaults = filteredGuides.map(summaryToGuide);

  return (
    <div className="space-y-6 w-full">
      {/* Guides Tabs Section */}
      <GuideTabContainer
        guides={guidesWithDefaults}
        courses={courses}
        onCourseSelect={onCourseSelect}
        viewMode={viewMode}
      />
     
      {/* Course Cards Section */}
      <CourseContainer
        courses={courses}
        onCourseSelect={onCourseSelect}
        guidesCount={guideCountsPerCourse}
        viewMode={viewMode}
      />
    </div>
  );
};

export default StudyGuideList;