// components/materials/MaterialsFilters.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { useMaterialStore } from "@/store/materialStore";

// Material status options
const statusOptions = [
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "canceled", label: "Canceled" },
];

// Material type options
const typeOptions = [
  { value: "lecture", label: "Lecture" },
  { value: "lab", label: "Lab" },
  { value: "exercise", label: "Exercise" },
  { value: "reading", label: "Reading" },
  { value: "other", label: "Other" },
];

interface MaterialsFiltersProps {
  courseFilter: string | null;
  setCourseFilter: (course: string | null) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  typeFilter: string | null;
  setTypeFilter: (type: string | null) => void;
}

export function MaterialsFilters({
  courseFilter,
  setCourseFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}: MaterialsFiltersProps) {
  const { materials } = useMaterialStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [courseOptions, setCourseOptions] = useState<{value: string, label: string}[]>([]);

  // Extract unique courses from materials
  useEffect(() => {
    if (materials.length > 0) {
      const uniqueCourses = new Map();
      
      // Use a Map to deduplicate courses by ID
      materials.forEach(m => {
        if (m.courseId && !uniqueCourses.has(m.courseId)) {
          uniqueCourses.set(m.courseId, {
            value: m.courseId,
            label: m.courseId, // In a real app, you'd want to get the course name
          });
        }
      });
      
      // Convert Map values to array
      setCourseOptions(Array.from(uniqueCourses.values()));
    }
  }, [materials]);

  // Check if any filters are active
  const hasActiveFilters = courseFilter || statusFilter || typeFilter;

  // Clear all filters
  const clearAllFilters = () => {
    setCourseFilter(null);
    setStatusFilter(null);
    setTypeFilter(null);
  };

  return (
    <div className="space-y-4">
      {/* Mobile view: toggle filters */}
      <div className="flex md:hidden items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <Filter className="mr-2 h-4 w-4" />
          {isFiltersOpen ? "Hide Filters" : "Show Filters"}
        </Button>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
      
      {/* Filter UI - hidden on mobile unless toggled */}
      <div className={`${isFiltersOpen ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="flex flex-wrap gap-2">
            {/* Course filter */}
            <Select
              value={courseFilter || "_all"}
              onValueChange={(value) => setCourseFilter(value === "_all" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem key="all-courses" value="_all">All Courses</SelectItem>
                {courseOptions.map((course, index) => (
                <SelectItem key={`course-${course.value}-${index}`} value={course.value}>
                    {course.label}
                </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Status filter */}
            <Select
              value={statusFilter || "_all"}
              onValueChange={(value) => setStatusFilter(value === "_all" ? null : value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Any Status" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem key="all-statuses" value="_all">Any Status</SelectItem>
                {statusOptions.map((status, index) => (
                <SelectItem key={`status-${status.value}-${index}`} value={status.value}>
                    {status.label}
                </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Type filter */}
            <Select
              value={typeFilter || "_all"}
              onValueChange={(value) => setTypeFilter(value === "_all" ? null : value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Any Type" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem key="all-types" value="_all">Any Type</SelectItem>
                {typeOptions.map((type, index) => (
                <SelectItem key={`type-${type.value}-${index}`} value={type.value}>
                    {type.label}
                </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Clear filters button (desktop) */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hidden md:flex"
            >
              <X className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {courseFilter && (
            <Badge variant="secondary" className="px-3 py-1">
              Course: {courseFilter}
              <button
                onClick={() => setCourseFilter(null)}
                className="ml-2 hover:text-foreground/80"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove course filter</span>
              </button>
            </Badge>
          )}
          
          {statusFilter && (
            <Badge variant="secondary" className="px-3 py-1">
              Status: {statusOptions.find(s => s.value === statusFilter)?.label || statusFilter}
              <button
                onClick={() => setStatusFilter(null)}
                className="ml-2 hover:text-foreground/80"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove status filter</span>
              </button>
            </Badge>
          )}
          
          {typeFilter && (
            <Badge variant="secondary" className="px-3 py-1">
              Type: {typeOptions.find(t => t.value === typeFilter)?.label || typeFilter}
              <button
                onClick={() => setTypeFilter(null)}
                className="ml-2 hover:text-foreground/80"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove type filter</span>
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}