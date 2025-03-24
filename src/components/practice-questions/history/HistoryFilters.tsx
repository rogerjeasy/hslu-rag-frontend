"use client";

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type TimeRangeType = 'all' | 'recent' | 'week' | 'month';

interface HistoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  timeRange: TimeRangeType;
  onTimeRangeChange: (value: TimeRangeType) => void;
  courses: { id: string; name: string; color: string }[];
  onCourseChange?: (courseId: string | null) => void;
  selectedCourse?: string | null;
}

export function HistoryFilters({
  searchTerm,
  onSearchChange,
  timeRange,
  onTimeRangeChange,
  courses,
  onCourseChange,
  selectedCourse
}: HistoryFiltersProps) {
  // Calculate active filters count
  const activeFiltersCount = 
    (timeRange !== 'all' ? 1 : 0) + 
    (selectedCourse ? 1 : 0);
  
  // Handle clearing all filters
  const handleClearFilters = () => {
    onTimeRangeChange('all');
    if (onCourseChange) {
      onCourseChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search practice history..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* Time range select */}
        <Select value={timeRange} onValueChange={(value: TimeRangeType) => onTimeRangeChange(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time Period</SelectLabel>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="recent">Last 3 Days</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        {/* Filters dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground" variant="default">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Course
              </DropdownMenuLabel>
              {courses.map((course) => (
                <DropdownMenuItem 
                  key={course.id}
                  className="flex items-center cursor-pointer"
                  onClick={() => onCourseChange && onCourseChange(course.id === selectedCourse ? null : course.id)}
                >
                  <div 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: course.color }} 
                  />
                  <span>{course.name}</span>
                  {selectedCourse === course.id && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            {activeFiltersCount > 0 && (
              <DropdownMenuItem 
                className="text-center cursor-pointer hover:bg-destructive/10 hover:text-destructive justify-center"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {timeRange !== 'all' && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => onTimeRangeChange('all')}
            >
              {timeRange === 'recent' && 'Last 3 Days'}
              {timeRange === 'week' && 'Last Week'}
              {timeRange === 'month' && 'Last Month'}
              <span className="text-xs">×</span>
            </Badge>
          )}
          
          {selectedCourse && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => onCourseChange && onCourseChange(null)}
            >
              {courses.find(c => c.id === selectedCourse)?.name || 'Course'}
              <span className="text-xs">×</span>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7 px-2 hover:bg-transparent hover:text-destructive transition-colors"
            onClick={handleClearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}