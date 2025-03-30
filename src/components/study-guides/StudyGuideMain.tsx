'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCourseStore } from '@/store/courseStore';
import { useUserStore } from '@/store/userStore';
import { StudyGuideHeader } from './StudyGuideHeader';
import { StudyGuideFilters } from './StudyGuideFilters';
import { StudyGuideList } from './StudyGuideList';
import { StudyGuideTips } from './StudyGuideTips';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Filter, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function StudyGuidesMain() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const courseId = searchParams.get('courseId');
  
  const [selectedGuideType, setSelectedGuideType] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const [showStudyTips, setShowStudyTips] = useState(true);
 
  const { user, isAuthenticated, hasChecked } = useUserStore();
  const {
    courses,
    filteredCourses,
    isLoading,
    error,
    fetchCourses,
    searchTerm,
    setSearchTerm
  } = useCourseStore();

  useEffect(() => {
    // Only fetch courses when authenticated and courses aren't loaded yet
    if (user && !isLoading && courses.length === 0) {
      fetchCourses();
    }
  }, [isAuthenticated, user, courses, isLoading, fetchCourses]);
 
  // Handle loading and authentication state
  useEffect(() => {
    if (hasChecked && !isAuthenticated) {
      router.push('/login?redirectTo=/study-guides');
    }
  }, [hasChecked, isAuthenticated, router]);

  // Handle course selection
  const handleCourseSelect = (guidId: string) => {
    router.push(`/study-guides/${guidId}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setIsMobileFilterVisible(!isMobileFilterVisible);
  };

  // Loading skeleton for the content
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden w-full">
          <CardContent className="p-0">
            <div className="bg-primary/5 p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="p-4">
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between mt-6">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50 pb-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header */}
        <StudyGuideHeader />
        
        {/* Mobile filter toggle button */}
        <Button 
          variant="outline" 
          onClick={toggleMobileFilters}
          className="lg:hidden flex items-center gap-2 mb-4 w-full justify-center bg-primary/5 border-primary/10"
        >
          <Filter className="h-4 w-4" />
          {isMobileFilterVisible ? 'Hide Filters' : 'Show Filters'}
        </Button>
       
        {/* Main content */}
        <div className="mt-4 lg:mt-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar with filters and tips - conditionally shown on mobile */}
          <div 
            className={`w-full ${isFilterExpanded ? 'lg:col-span-4' : 'lg:col-span-3'} lg:block ${isMobileFilterVisible ? 'block' : 'hidden'}`}
          >
            {/* Filters Card */}
            <Card className="w-full overflow-hidden border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 border-b border-primary/10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Filters & Options</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                      className="text-xs text-muted-foreground hover:text-primary hidden lg:flex"
                    >
                      {isFilterExpanded ? 'Collapse' : 'Expand'}
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <StudyGuideFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedGuideType={selectedGuideType}
                    onGuideTypeChange={setSelectedGuideType}
                    sortOption={sortOption}
                    onSortOptionChange={setSortOption}
                  />
                  
                  <div className="mt-6 pt-4 border-t border-primary/10">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium">View Options</h4>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="view-mode" className="text-sm">Card Layout</Label>
                        <Tabs 
                          value={viewMode} 
                          onValueChange={(v) => setViewMode(v as 'grid' | 'list')}
                          className="h-8"
                        >
                          <TabsList className="h-8">
                            <TabsTrigger value="grid" className="h-8 px-3">Grid</TabsTrigger>
                            <TabsTrigger value="list" className="h-8 px-3">List</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-tips" className="text-sm">Show Study Tips</Label>
                        <Switch 
                          id="show-tips" 
                          checked={showStudyTips}
                          onCheckedChange={setShowStudyTips}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh}
                        disabled={isLoading || refreshing}
                        className="w-full mt-2 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh Guides
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
           
            {/* Study tips and strategies - hidden on mobile when filters are expanded */}
            {showStudyTips && (
              <div className="hidden md:block mt-6 w-full">
                <StudyGuideTips />
              </div>
            )}
          </div>
         
          {/* Main content area with course list */}
          <div 
            className={`w-full ${isFilterExpanded ? 'lg:col-span-8' : 'lg:col-span-9'}`}
          >
            <Card className="w-full border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 border-b border-primary/10">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="font-medium truncate">
                        Study Guides 
                        {filteredCourses.length > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({filteredCourses.length} available)
                          </span>
                        )}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => router.push('/study-guides/create')}
                        className="bg-primary text-white hover:bg-primary/90 flex items-center gap-1 text-sm h-9 px-3"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Create a New Study Guide</span>
                        <span className="sm:hidden">New Guide</span>
                      </Button>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {searchTerm && (
                          <div className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full flex items-center">
                            <span className="truncate max-w-[100px] sm:max-w-[150px]">{searchTerm}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSearchTerm('')}
                              className="h-5 w-5 p-0 ml-1"
                            >
                              ×
                            </Button>
                          </div>
                        )}
                        
                        {selectedGuideType !== 'all' && (
                          <div className="bg-secondary/10 text-secondary text-sm px-3 py-1 rounded-full flex items-center">
                            <span className="capitalize truncate max-w-[100px]">{selectedGuideType}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedGuideType('all')}
                              className="h-5 w-5 p-0 ml-1"
                            >
                              ×
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 w-full">
                  {isLoading ? (
                    <div className="w-full">
                      {renderSkeletons()}
                    </div>
                  ) : error ? (
                    <div className="rounded-lg bg-red-50 p-4 sm:p-6 text-red-800 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                        <h3 className="text-lg font-medium">Error loading study guides</h3>
                      </div>
                      <p className="mt-2 text-sm sm:text-base break-words">{error}</p>
                      <Button 
                        onClick={handleRefresh} 
                        variant="outline"
                        className="mt-4 bg-white border-red-200 hover:bg-red-50 text-red-600"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="w-full">
                      <div className="text-center py-12 px-4 border border-dashed rounded-lg bg-blue-50/30 w-full">
                        <BookOpen className="mx-auto h-12 w-12 text-blue-300" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No study guides available</h3>
                        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                          Try adjusting your filters or search terms to find study guides.
                        </p>
                        <Button 
                          onClick={() => router.push('/study-guides/create')}
                          className="mt-4 bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          Create a New Study Guide
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <StudyGuideList
                        courses={filteredCourses}
                        onCourseSelect={handleCourseSelect}
                        selectedGuideType={selectedGuideType}
                        sortOption={sortOption}
                        viewMode={viewMode}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Study tips shown at bottom on smaller screens when filters are visible */}
        {showStudyTips && isMobileFilterVisible && (
          <div className="mt-6 block md:hidden w-full">
            <StudyGuideTips />
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyGuidesMain;