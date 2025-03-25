"use client";

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCourseStore } from '@/store/courseStore';
import { Loader2 } from 'lucide-react';

interface SubjectSelectorProps {
  selectedCourse: string | null;
  onSelectCourse: (courseId: string | null) => void;
  className?: string;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedCourse,
  onSelectCourse,
  className,
}) => {
  const { 
    courses, 
    isLoading, 
    error, 
    fetchCourses 
  } = useCourseStore();
  
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [modules, setModules] = useState<{ id: string; name: string }[]>([]);

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset selected module when course changes
  useEffect(() => {
    setSelectedModule(null);
    
    // If we wanted to fetch modules for the selected course from an API
    // we could do it here. For now, I'll simulate it with dummy data
    if (selectedCourse) {
      // This would be replaced with an actual API call in a real application
      // For example: courseService.getCourseModules(selectedCourse)
      const dummyModules = [
        { id: `${selectedCourse}_module1`, name: 'Introduction' },
        { id: `${selectedCourse}_module2`, name: 'Core Concepts' },
        { id: `${selectedCourse}_module3`, name: 'Advanced Topics' },
      ];
      setModules(dummyModules);
    } else {
      setModules([]);
    }
  }, [selectedCourse]);

  const handleCourseChange = (value: string) => {
    onSelectCourse(value || null);
  };

  const handleModuleChange = (value: string) => {
    setSelectedModule(value || null);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Select 
        value={selectedCourse || ""} 
        onValueChange={handleCourseChange}
        disabled={isLoading}
      >
        <SelectTrigger className="bg-white dark:bg-slate-800">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading courses...</span>
            </div>
          ) : (
            <SelectValue placeholder="Select a course" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Courses</SelectLabel>
            {courses.length > 0 ? (
              courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-center text-sm text-slate-500">
                {error ? 'Error loading courses' : 'No courses available'}
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedCourse && (
        <Select 
          value={selectedModule || ""} 
          onValueChange={handleModuleChange}
        >
          <SelectTrigger className="bg-white dark:bg-slate-800">
            <SelectValue placeholder="Select a module (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Modules</SelectLabel>
              {modules.map(module => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {error && (
        <div className="text-sm text-red-500 mt-1">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default SubjectSelector;