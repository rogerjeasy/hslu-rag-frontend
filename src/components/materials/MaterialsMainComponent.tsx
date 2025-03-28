"use client";

// app/materials/page.tsx
"use client";

import { useState } from "react";
import { MaterialsTable } from "./MaterialsTable";
import { MaterialsHeader } from "./MaterialsHeader";
import { MaterialsFilters } from "./MaterialsFilters";
import { MaterialsEmptyState } from "./MaterialsEmptyState";
import { MaterialDetailDrawer } from "./MaterialDetailDrawer";
import { Material } from "@/types/material.types";
import { useMaterialStore } from "@/store/materialStore";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function MaterialsPage() {
  // State for the selected material to view or edit
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view");
  
  // Filters
  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get materials from store
  const { 
    materials, 
    isLoading, 
    fetchMaterials,
    error 
  } = useMaterialStore();

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Handle opening the detail drawer
  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setDrawerMode("view");
    setDrawerOpen(true);
  };

  // Handle opening the edit drawer
  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  // Filter materials based on current filters
  const filteredMaterials = materials.filter((material) => {
    // Apply course filter
    if (courseFilter && material.courseId !== courseFilter) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter && material.status !== statusFilter) {
      return false;
    }
    
    // Apply type filter
    if (typeFilter && material.type !== typeFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        material.title.toLowerCase().includes(query) ||
        (material.description?.toLowerCase().includes(query) || false)
      );
    }
    
    return true;
  });

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <MaterialsHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <MaterialsFilters 
        courseFilter={courseFilter} 
        setCourseFilter={setCourseFilter}
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter} 
        setTypeFilter={setTypeFilter}
      />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-medium">Error loading materials</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <MaterialsEmptyState 
          hasFilters={!!(courseFilter || statusFilter || typeFilter || searchQuery)}
          clearFilters={() => {
            setCourseFilter(null);
            setStatusFilter(null);
            setTypeFilter(null);
            setSearchQuery("");
          }}
        />
      ) : (
        <MaterialsTable 
          materials={filteredMaterials}
          onViewMaterial={handleViewMaterial}
          onEditMaterial={handleEditMaterial}
        />
      )}

      {selectedMaterial && (
        <MaterialDetailDrawer
          material={selectedMaterial}
          mode={drawerMode}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}