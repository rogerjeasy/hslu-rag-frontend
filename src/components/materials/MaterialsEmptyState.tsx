"use client";

// components/materials/MaterialsEmptyState.tsx
import { Button } from "@/components/ui/button";
import { FileQuestion, Upload, FilterX } from "lucide-react";

interface MaterialsEmptyStateProps {
  hasFilters: boolean;
  clearFilters: () => void;
}

export function MaterialsEmptyState({ hasFilters, clearFilters }: MaterialsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
      {hasFilters ? (
        <>
          <FilterX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No matching materials</h3>
          <p className="text-sm text-muted-foreground text-center mt-2 mb-4 max-w-md">
            We couldn&apos;t find any materials that match your current filters. Try adjusting your filters or clear them to see all materials.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            <FilterX className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </>
      ) : (
        <>
          <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No materials found</h3>
          <p className="text-sm text-muted-foreground text-center mt-2 mb-4 max-w-md">
            You haven&apos;t uploaded any course materials yet. Get started by uploading your first material.
          </p>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Material
          </Button>
        </>
      )}
    </div>
  );
}