"use client";
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { DifficultyLevel, QuestionTypeEnum } from '@/types/practice-questions.types';
import { usePracticeQuestionsStore } from "@/store/usePracticeQuestionsStore";
import { Filter, ChevronsUpDown, FilterX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseOption {
  id: string;
  name: string;
}

interface QuestionSetFiltersProps {
  courses: CourseOption[];
}

// Question type options
const questionTypes = [
  { value: QuestionTypeEnum.MULTIPLE_CHOICE, label: 'Multiple Choice' },
  { value: QuestionTypeEnum.SHORT_ANSWER, label: 'Short Answer' },
  { value: QuestionTypeEnum.TRUE_FALSE, label: 'True/False' },
  { value: QuestionTypeEnum.FILL_IN_BLANK, label: 'Fill-in-Blank' },
  { value: QuestionTypeEnum.MATCHING, label: 'Matching' }
];

/**
 * Creates an adapter hook that works with the practice questions store
 * to provide filter functionality
 */
function useFiltersAdapter() {
  // Get the store
  const filterQuestionSets = usePracticeQuestionsStore(state => state.filterQuestionSets);
  const resetFilters = usePracticeQuestionsStore(state => state.resetFilters);
  
  // Local state for filters
  const [courseFilter, setCourseFilter] = React.useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = React.useState<DifficultyLevel | null>(null);
  const [typeFilter, setTypeFilter] = React.useState<QuestionTypeEnum | null>(null);
  
  // Use a ref to prevent initial effect from triggering
  const isInitialMount = React.useRef(true);
  // Track if changes are internal
  const isInternalChange = React.useRef(false);
  
  // Apply filters when courseFilter changes
  React.useEffect(() => {
    // Skip first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Skip if this is not user-initiated
    if (!isInternalChange.current) {
      return;
    }
    
    // Reset internal change flag
    isInternalChange.current = false;
    
    // Filter with just the parameters the store supports
    const searchTerm = '';
    filterQuestionSets(searchTerm, courseFilter || undefined);
  }, [courseFilter, filterQuestionSets]);
  
  // Wrapper for setCourseFilter that also sets internal change flag
  const handleSetCourseFilter = React.useCallback((value: string | null) => {
    isInternalChange.current = true;
    setCourseFilter(value);
  }, []);
  
  // Clear all filters
  const clearFilters = React.useCallback(() => {
    setCourseFilter(null);
    setDifficultyFilter(null);
    setTypeFilter(null);
    
    // Reset store filters
    if (resetFilters) {
      resetFilters();
    }
  }, [resetFilters]);
  
  return {
    courseFilter,
    difficultyFilter,
    typeFilter,
    setCourseFilter: handleSetCourseFilter,
    setDifficultyFilter,
    setTypeFilter,
    clearFilters
  };
}

export function QuestionSetFilters({ courses }: QuestionSetFiltersProps) {
  const { 
    courseFilter, 
    difficultyFilter, 
    typeFilter,
    setCourseFilter,
    setDifficultyFilter,
    setTypeFilter,
    clearFilters
  } = useFiltersAdapter();

  // State to track selected question types
  const [selectedTypes, setSelectedTypes] = React.useState<QuestionTypeEnum[]>(
    typeFilter ? [typeFilter] : []
  );
  
  // Using a ref to track last known state to prevent infinite loops
  const lastTypeFilterRef = React.useRef(typeFilter);
  const isInitialRenderRef = React.useRef(true);

  // When typeFilter changes from outside (like clear filters)
  React.useEffect(() => {
    // Skip the effect on initial render
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    // Only update if the change came from outside this component
    if (typeFilter !== lastTypeFilterRef.current) {
      lastTypeFilterRef.current = typeFilter;
      
      if (typeFilter === null) {
        setSelectedTypes([]);
      } else if (!selectedTypes.includes(typeFilter)) {
        setSelectedTypes([typeFilter]);
      }
    }
  }, [typeFilter, selectedTypes]);

  // Handle question type toggle
  const handleTypeToggle = (type: QuestionTypeEnum) => {
    let newSelectedTypes: QuestionTypeEnum[];
    if (selectedTypes.includes(type)) {
      newSelectedTypes = selectedTypes.filter(t => t !== type);
    } else {
      newSelectedTypes = [...selectedTypes, type];
    }
    
    setSelectedTypes(newSelectedTypes);
    
    // Update the single type filter in the store
    const newStoreValue = newSelectedTypes.length === 0 ? null : newSelectedTypes[0];
    setTypeFilter(newStoreValue);
    
    // Update our ref to track what we just set
    lastTypeFilterRef.current = newStoreValue;
  };

  // Handle select all
  const handleSelectAll = (checked: boolean | "indeterminate") => {
    const newSelectedTypes = checked === true ? 
      questionTypes.map(t => t.value) : 
      [];
    
    setSelectedTypes(newSelectedTypes);
    
    // Update store
    const newStoreValue = newSelectedTypes.length === 0 ? null : newSelectedTypes[0];
    setTypeFilter(newStoreValue);
    
    // Update ref
    lastTypeFilterRef.current = newStoreValue;
  };

  // Get display text for selected question types
  const getQuestionTypeDisplayText = () => {
    if (selectedTypes.length === 0) {
      return "All Types";
    } else if (selectedTypes.length === 1) {
      return questionTypes.find(t => t.value === selectedTypes[0])?.label || "1 Type Selected";
    } else {
      return `${selectedTypes.length} Types Selected`;
    }
  };

  // Function to display active selection counts as badges
  const getActiveFiltersCount = () => {
    let count = 0;
    if (courseFilter) count++;
    if (difficultyFilter) count++;
    if (selectedTypes.length > 0) count++;
    return count;
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    clearFilters();
    setSelectedTypes([]);
    lastTypeFilterRef.current = null;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950 rounded-lg border border-border shadow-sm">
      <div className="bg-muted/40 p-4 rounded-t-lg border-b border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-medium">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="default" className="ml-1 text-xs">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <FilterX className="mr-1 h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Clear All</span>
          </Button>
      </div>
      
      <div className="p-4">
        <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {/* Course Filter */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <label className="text-sm font-medium" htmlFor="course-filter">
                Course
              </label>
            </div>
            <Select
              value={courseFilter || ""}
              onValueChange={(value) => setCourseFilter(value === "all" ? null : value)}
            >
              <SelectTrigger id="course-filter" className="w-full h-9">
                <SelectValue placeholder="Select a Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <label className="text-sm font-medium" htmlFor="difficulty-filter">
                Difficulty
              </label>
            </div>
            <Select
              value={difficultyFilter || ""}
              onValueChange={(value) => setDifficultyFilter(value === "all" ? null : value as DifficultyLevel)}
            >
              <SelectTrigger 
                id="difficulty-filter" 
                className="w-full h-9"
              >
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value={DifficultyLevel.BASIC}>Basic</SelectItem>
                <SelectItem value={DifficultyLevel.MEDIUM}>Medium</SelectItem>
                <SelectItem value={DifficultyLevel.ADVANCED}>Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question Type Multi-Select */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <label className="text-sm font-medium" htmlFor="type-filter">
                Question Type
              </label>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="type-filter"
                  variant="outline"
                  role="combobox"
                  aria-expanded={false}
                  className="w-full justify-between h-9 font-normal"
                >
                  <span className="truncate">{getQuestionTypeDisplayText()}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="p-1">
                  <div className="flex items-center border-b px-3 py-2">
                    <Checkbox
                      id="select-all-types"
                      checked={selectedTypes.length === questionTypes.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <label
                      htmlFor="select-all-types"
                      className="ml-2 text-sm font-medium w-full cursor-pointer"
                    >
                      Select All Types
                    </label>
                  </div>
                  {questionTypes.map((type) => (
                    <div
                      key={type.value}
                      className="flex items-center px-3 py-2 rounded-sm hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={selectedTypes.includes(type.value)}
                        onCheckedChange={() => handleTypeToggle(type.value)}
                      />
                      <label
                        htmlFor={`type-${type.value}`}
                        className="ml-2 text-sm w-full cursor-pointer"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Filter Selection Preview */}
        <div className="mt-4 p-2 bg-muted/30 rounded-md">
          <h4 className="text-xs font-medium mb-1.5 text-muted-foreground">Active Filters:</h4>
          <div className="flex flex-wrap gap-1.5 items-center">
            {courseFilter && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs py-0.5">
                <span className="font-semibold">Course:</span> {courses.find(c => c.id === courseFilter)?.name || courseFilter}
              </Badge>
            )}
            {difficultyFilter && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs py-0.5">
                <span className="font-semibold">Difficulty:</span> {difficultyFilter}
              </Badge>
            )}
            {selectedTypes.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs py-0.5">
                <span className="font-semibold">Types:</span> {selectedTypes.length === 1 
                  ? questionTypes.find(t => t.value === selectedTypes[0])?.label 
                  : `${selectedTypes.length} selected`}
              </Badge>
            )}
            {getActiveFiltersCount() === 0 && (
              <span className="text-xs text-muted-foreground">No active filters</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}