// src/components/courses/CourseSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BookOpen, Filter, X } from 'lucide-react';
import { Course } from '@/types/course.types';

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseId?: string;
  onCourseChange: (courseId: string | undefined) => void;
  showClearButton?: boolean;
  placeholder?: string;
  className?: string;
}

export function CourseSelector({
  courses,
  selectedCourseId,
  onCourseChange,
  showClearButton = true,
  placeholder = "Select a course",
  className
}: CourseSelectorProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedCourseId);

  // Update internal state when prop changes
  useEffect(() => {
    setSelected(selectedCourseId);
  }, [selectedCourseId]);

  // Handle course selection
  const handleCourseChange = (value: string) => {
    setSelected(value);
    onCourseChange(value);
  };

  // Clear selection
  const handleClear = () => {
    setSelected(undefined);
    onCourseChange(undefined);
  };

  // Get selected course
  const selectedCourse = courses.find(course => course.id === selected);

  return (
    <div className={`flex gap-2 ${className}`}>
      <Select value={selected} onValueChange={handleCourseChange}>
        <SelectTrigger className="min-w-[260px]">
          <SelectValue placeholder={placeholder}>
            {selectedCourse ? (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                <span className="truncate">
                  {selectedCourse.code 
                    ? `${selectedCourse.code}: ${selectedCourse.name}`
                    : selectedCourse.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {placeholder}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Your Courses</SelectLabel>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>
                    {course.code 
                      ? `${course.code}: ${course.name}`
                      : course.name}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      {showClearButton && selected && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleClear}
          aria-label="Clear course selection"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}