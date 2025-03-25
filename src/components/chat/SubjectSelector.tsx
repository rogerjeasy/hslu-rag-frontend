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
import { useCourseStore } from '@/store/courseStore';

interface SubjectSelectorProps {
  courseId?: string;
  onCourseChange?: (courseId: string) => void;
  onModuleChange?: (moduleId: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  courseId,
  onCourseChange,
  onModuleChange
}) => {
  // Get courses from store
  const { 
    courses, 
    fetchCourses, 
    isLoading, 
    error 
  } = useCourseStore();
  
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(courseId);
  const [selectedModule, setSelectedModule] = useState<string | undefined>();
  const [modules, setModules] = useState<Array<{ id: string, name: string }>>([]);

  // Fetch courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Update selected course when courseId prop changes
  useEffect(() => {
    setSelectedCourse(courseId);
  }, [courseId]);

  // Fetch modules when course changes
  useEffect(() => {
    const fetchModules = async () => {
      if (selectedCourse) {
        try {
          // In a real application, you would fetch modules for the selected course
          // For now, we'll use a placeholder array since the API endpoint isn't specified
          // This would typically come from another API endpoint or be included in the course details
          
          // Placeholder - replace with actual API call
          setModules([
            { id: `${selectedCourse}-1`, name: 'Introduction' },
            { id: `${selectedCourse}-2`, name: 'Core Concepts' },
            { id: `${selectedCourse}-3`, name: 'Advanced Topics' },
          ]);
          
          // Example of how you might fetch modules in a real application:
          // const courseDetails = await useCourseStore.getState().getCourse(selectedCourse);
          // setModules(courseDetails.modules);
        } catch (error) {
          console.error('Error fetching modules:', error);
        }
      } else {
        setModules([]);
      }
    };

    fetchModules();
  }, [selectedCourse]);

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setSelectedModule(undefined); // Reset module when course changes
   
    if (onCourseChange) {
      onCourseChange(value);
    }
  };

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
   
    if (onModuleChange) {
      onModuleChange(value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
      {/* Course Selector */}
      <Select value={selectedCourse} onValueChange={handleCourseChange} disabled={isLoading}>
        <SelectTrigger className="w-full sm:w-40 h-8 text-xs">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select Course"} />
        </SelectTrigger>
        <SelectContent>
          {error ? (
            <div className="p-2 text-sm text-red-500">Error loading courses</div>
          ) : (
            <SelectGroup>
              <SelectLabel>Courses</SelectLabel>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id} className="text-sm">
                  {course.name}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>

      {/* Module Selector - Only shown if a course is selected */}
      {selectedCourse && (
        <Select value={selectedModule} onValueChange={handleModuleChange}>
          <SelectTrigger className="w-full sm:w-48 h-8 text-xs">
            <SelectValue placeholder="Select Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Modules</SelectLabel>
              {modules.map(module => (
                <SelectItem key={module.id} value={module.id} className="text-sm">
                  {module.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SubjectSelector;