"use client";

import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Microscope, 
  Dumbbell, 
  BookOpen, 
  File 
} from "lucide-react";

interface MaterialTypeBadgeProps {
  type: string;
}

export function MaterialTypeBadge({ type }: MaterialTypeBadgeProps) {
  switch (type) {
    case "lecture":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Lecture
        </Badge>
      );
    case "lab":
      return (
        <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200 flex items-center gap-1">
          <Microscope className="h-3 w-3" />
          Lab
        </Badge>
      );
    case "exercise":
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 flex items-center gap-1">
          <Dumbbell className="h-3 w-3" />
          Exercise
        </Badge>
      );
    case "reading":
      return (
        <Badge variant="outline" className="bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          Reading
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <File className="h-3 w-3" />
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      );
  }
}