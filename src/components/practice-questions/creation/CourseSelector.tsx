"use client";
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface CourseSelectorProps {
  courses: {
    id: string;
    name: string;
    color: string;
  }[];
  selectedCourseId: string;
  onChange: (courseId: string) => void;
  error?: boolean;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  courses,
  selectedCourseId,
  onChange,
  error = false
}) => {
  // Group courses into recent and all
  const recentCourses = courses.slice(0, 3); // Just showing first 3 as "recent" for this example
  const allCourses = courses;
 
  return (
    <div className="space-y-3">
      <Select value={selectedCourseId} onValueChange={onChange}>
        <SelectTrigger
          className={cn(error ? "border-destructive" : "")}
        >
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent>
          {/* Section headers and content */}
          <div className="pl-2 py-1.5 text-xs font-medium text-muted-foreground">
            Recent Courses
          </div>
          {recentCourses.map((course) => (
            <SelectItem key={`recent-${course.id}`} value={course.id}>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
                {course.name}
              </div>
            </SelectItem>
          ))}
          
          <div className="pl-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">
            All Courses
          </div>
          
          {/* Create a filtered version of allCourses that excludes recent courses to avoid duplicates */}
          {allCourses
            .filter(course => !recentCourses.some(recent => recent.id === course.id))
            .map((course) => (
              <SelectItem key={course.id} value={course.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  {course.name}
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {/* Recently used courses quick access */}
      <div className="flex flex-wrap gap-2">
        {recentCourses.map((course) => (
          <button
            key={`quick-${course.id}`}
            type="button"
            onClick={() => onChange(course.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
              selectedCourseId === course.id
                ? "bg-primary/10 border-primary/30 text-primary"
                : "hover:bg-muted"
            )}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: course.color }}
            />
            {course.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseSelector;