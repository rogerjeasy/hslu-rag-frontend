// components/materials/MaterialStatusBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle 
} from "lucide-react";

interface MaterialStatusBadgeProps {
  status: string;
}

export function MaterialStatusBadge({ status }: MaterialStatusBadgeProps) {
  switch (status) {
    case "processing":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Processing
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
    case "canceled":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Canceled
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          {status}
        </Badge>
      );
  }
}
