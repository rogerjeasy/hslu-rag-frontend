"use client";
import { BarChart } from "lucide-react";

export function TopicHeatmap() {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <BarChart className="h-16 w-16 text-muted-foreground/50" />
      </div>
    );
  }