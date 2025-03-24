'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StudyGuide, TabView, ViewMode } from '@/types/study-guide';
import { GuideGrid } from '../guides/GuideGrid';
import { GuideList } from '../guides/GuideList';
import { EmptyTabState } from '../tabs/EmptyTabState';
import { Course } from '@/types/course.types';

interface GuideTabContainerProps {
  guides: StudyGuide[];
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
  viewMode: ViewMode;
}

export const GuideTabContainer = ({
  guides,
  courses,
  onCourseSelect,
  viewMode
}: GuideTabContainerProps) => {
  const [tabView, setTabView] = useState<TabView>('all');
  const [filteredGuides, setFilteredGuides] = useState<StudyGuide[]>(guides);

  // Update filtered guides when guides prop changes or tab changes
  useEffect(() => {
    setFilteredGuides(getFilteredGuides(tabView));
  }, [guides, tabView]);

  // Filter guides based on tab selection
  const getFilteredGuides = (tab: TabView): StudyGuide[] => {
    switch (tab) {
      case 'recent':
        return guides
          .filter(guide => guide.lastStudied)
          .sort((a, b) => new Date(b.lastStudied!).getTime() - new Date(a.lastStudied!).getTime())
          .slice(0, 6);
      case 'recommended':
        return guides
          .filter(guide => guide.progress < 70)
          .sort((a, b) => a.progress - b.progress)
          .slice(0, 6);
      case 'all':
      default:
        return guides;
    }
  };

  const handleTabChange = (value: string) => {
    const newTabView = value as TabView;
    setTabView(newTabView);
    setFilteredGuides(getFilteredGuides(newTabView));
  };

  return (
    <div className="space-y-6 w-full">
      <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-wrap">
          <TabsList className="bg-blue-50 rounded-xl">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-lg"
            >
              All Guides
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-lg"
            >
              Recently Studied
            </TabsTrigger>
            <TabsTrigger 
              value="recommended" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-lg"
            >
              Recommended
            </TabsTrigger>
          </TabsList>
          
          <Badge variant="outline" className="bg-blue-50 text-blue-800 font-normal py-1.5">
            {filteredGuides.length} guides available
          </Badge>
        </div>
        
        <TabsContent value="all" className="mt-6 w-full">
          {viewMode === 'grid' ? (
            <GuideGrid guides={filteredGuides} courses={courses} onCourseSelect={onCourseSelect} />
          ) : (
            <GuideList guides={filteredGuides} courses={courses} onCourseSelect={onCourseSelect} />
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6 w-full">
          {filteredGuides.length > 0 ? (
            viewMode === 'grid' ? (
              <GuideGrid 
                guides={filteredGuides} 
                courses={courses} 
                onCourseSelect={onCourseSelect} 
              />
            ) : (
              <GuideList 
                guides={filteredGuides} 
                courses={courses} 
                onCourseSelect={onCourseSelect} 
              />
            )
          ) : (
            <EmptyTabState 
              title="No recently studied guides" 
              description="Start studying to see your recent guides here." 
            />
          )}
        </TabsContent>
        
        <TabsContent value="recommended" className="mt-6 w-full">
          {filteredGuides.length > 0 ? (
            viewMode === 'grid' ? (
              <GuideGrid 
                guides={filteredGuides} 
                courses={courses} 
                onCourseSelect={onCourseSelect}
                isRecommended
              />
            ) : (
              <GuideList 
                guides={filteredGuides} 
                courses={courses} 
                onCourseSelect={onCourseSelect}
                isRecommended
              />
            )
          ) : (
            <EmptyTabState 
              title="No recommendations yet" 
              description="Keep studying and we'll recommend guides based on your progress." 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuideTabContainer;