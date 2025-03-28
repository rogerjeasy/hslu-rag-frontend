// components/materials/MaterialsHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UploadCloud, RefreshCw } from "lucide-react";
import { useMaterialStore } from "@/store/materialStore";
import { useRouter } from "next/navigation";

interface MaterialsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function MaterialsHeader({ searchQuery, setSearchQuery }: MaterialsHeaderProps) {
  const { isLoading, fetchMaterials } = useMaterialStore();
  const router = useRouter();

  const handleRefresh = () => {
    fetchMaterials();
  };

  const handleUpload = () => {
    router.push("/application-management/files");
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Course Materials</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button onClick={handleUpload} className="hidden sm:flex">
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Material
          </Button>
          <Button className="sm:hidden" size="icon">
            <UploadCloud className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search materials by title or description..."
          className="pl-8 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        Manage course materials for your students. Filter, view details, and track processing status.
      </div>
    </div>
  );
}