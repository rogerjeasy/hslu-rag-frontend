"use client";

import { useState, useEffect, useCallback } from 'react';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Course } from '@/types/course.types';
import { useCourseStore } from '@/store/courseStore';

interface CourseSelectorProps {
  selectedCourse: Course | null;
  onCourseChange: (course: Course) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function FallbackCourseSelector({
  selectedCourse,
  onCourseChange,
  placeholder = "Select a course...",
  disabled = false
}: CourseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Safely access the store
  const courseStore = useCourseStore();
  
  // Provide default values in case the store or its properties are undefined
  const {
    isLoading = false,
    error = null,
    fetchCourses = async () => {},
    setSearchTerm = () => {},
  } = courseStore || {};
  
  // Safely extract and handle filteredCourses
  const safeFilteredCourses = Array.isArray(courseStore?.filteredCourses) 
    ? courseStore.filteredCourses 
    : [];
  
  // Safe course change handler
  const handleCourseChange = useCallback((course: Course) => {
    try {
      if (!course) {
        setLocalError("Cannot select a course: Course is undefined");
        return;
      }
      
      // Verify this is a valid course object with required properties
      if (!course.id || !course.name) {
        setLocalError("Invalid course data");
        return;
      }
      
      // Call the callback with the validated course object
      onCourseChange(course);
      setOpen(false);
    } catch (err) {
      console.error("Error while changing course:", err);
      setLocalError("Failed to select course");
    }
  }, [onCourseChange]);

  // Initial fetch of courses
  useEffect(() => {
    const loadCourses = async () => {
      setIsInitialLoading(true);
      setLocalError(null);
      
      try {
        // Check if fetchCourses is available and is a function
        if (typeof fetchCourses === 'function') {
          await fetchCourses();
        } else {
          setLocalError("Course fetching function is not available");
        }
      } catch (err) {
        console.error('Error loading courses:', err);
        setLocalError("Failed to load courses");
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadCourses();
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle local search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    try {
      if (typeof setSearchTerm === 'function') {
        setSearchTerm(value);
      }
    } catch (err) {
      console.error("Error while searching:", err);
    }
  };

  // Filter courses locally as a fallback
  const filteredCourses = searchQuery 
    ? safeFilteredCourses.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : safeFilteredCourses;

  // Determine if the selector should be disabled
  const isDisabled = disabled || isLoading || isInitialLoading;
  
  // Tooltip message based on loading state
  const tooltipMessage = isInitialLoading 
    ? "Loading courses. Please wait..." 
    : isLoading 
      ? "Processing request..." 
      : localError || error
        ? "Error loading courses" 
        : "Select a course";

  // Display the appropriate error message
  const errorMessage = localError || error;

  return (
    <div className={cn(
      "w-full transition-opacity duration-300",
      mounted ? "opacity-100" : "opacity-0"
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Popover 
                open={open && !isDisabled} 
                onOpenChange={(value) => !isDisabled && setOpen(value)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between text-sm h-10",
                      "border border-input bg-background",
                      !isDisabled && "hover:bg-accent hover:text-accent-foreground",
                      !selectedCourse && "text-muted-foreground",
                      isDisabled && "opacity-70 cursor-not-allowed"
                    )}
                    disabled={isDisabled}
                  >
                    {isLoading || isInitialLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{isInitialLoading ? "Loading courses..." : "Processing..."}</span>
                      </div>
                    ) : selectedCourse ? (
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">
                          {selectedCourse.code}: {selectedCourse.name}
                        </span>
                      </div>
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <ChevronsUpDown className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      isDisabled ? "opacity-30" : "opacity-50"
                    )} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <div className="flex flex-col">
                    {/* Custom search input */}
                    <div className="flex items-center border-b p-2">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <Input
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="h-8 border-0 p-0 focus-visible:ring-0"
                      />
                    </div>
                    
                    {/* Loading state */}
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-primary/70 mb-2" />
                        <p className="text-sm text-muted-foreground">Loading courses...</p>
                      </div>
                    ) : (
                      <>
                        {/* Empty state */}
                        {filteredCourses.length === 0 ? (
                          <div className="py-6 text-center">
                            {errorMessage ? (
                              <p className="text-sm text-destructive">
                                Error: {errorMessage}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No courses found.
                              </p>
                            )}
                          </div>
                        ) : (
                          /* Course list */
                          <div className="max-h-[300px] overflow-auto">
                            {filteredCourses.map((course) => (
                              <div
                                key={course.id || Math.random().toString()}
                                onClick={() => handleCourseChange(course)}
                                className={cn(
                                  "flex items-center justify-between py-2 px-3 text-sm cursor-pointer",
                                  "hover:bg-accent hover:text-accent-foreground",
                                  selectedCourse?.id === course.id ? "bg-accent/50" : ""
                                )}
                              >
                                <div className="flex-1 truncate">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{course.code || 'Unknown'}</span>
                                    <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-secondary rounded">
                                      {course.credits || 0} cr
                                    </span>
                                  </div>
                                  <p className="text-sm truncate">{course.name || 'Unnamed Course'}</p>
                                </div>
                                {selectedCourse?.id === course.id && (
                                  <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" className="text-xs">
            {tooltipMessage}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Display error if exists and not in loading state */}
      {errorMessage && !isLoading && !isInitialLoading && (
        <p className="text-xs text-destructive mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}