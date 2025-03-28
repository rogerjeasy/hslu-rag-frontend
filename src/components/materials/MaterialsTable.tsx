// components/materials/MaterialsTable.tsx
"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MaterialStatusBadge } from "./MaterialStatusBadge";
import { MaterialTypeBadge } from "./MaterialTypeBadge";
import { ProcessingProgressBar } from "./ProcessingProgressBar";
import { DeleteMaterialDialog } from "./DeleteMaterialDialog";
import { Material } from "@/types/material.types";
import { useMaterialStore } from "@/store/materialStore";
import { formatFileSize, formatDate } from "@/lib/utils";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  ExternalLink, 
  Eye 
} from "lucide-react";

interface MaterialsTableProps {
  materials: Material[];
  onViewMaterial: (material: Material) => void;
  onEditMaterial: (material: Material) => void;
}

export function MaterialsTable({ 
  materials, 
  onViewMaterial, 
  onEditMaterial 
}: MaterialsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const { processingStatuses, trackProcessingStatus } = useMaterialStore();

  // Start tracking processing status for materials in 'processing' state
  useState(() => {
    materials.forEach(material => {
      if (material.status === 'processing') {
        trackProcessingStatus(material.id);
      }
    });
  });

  const handleDeleteClick = (material: Material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const sortedMaterials = [...materials].sort((a, b) => {
    // Show processing items first, then sort by upload date
    if (a.status === 'processing' && b.status !== 'processing') return -1;
    if (a.status !== 'processing' && b.status === 'processing') return 1;
    
    // Then sort by upload date with newest first
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Material</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden lg:table-cell">Course</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Size</TableHead>
            <TableHead className="hidden lg:table-cell">Uploaded</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMaterials.map((material) => {
            const processingStatus = processingStatuses[material.id];
            const isProcessing = material.status === 'processing';
            
            return (
              <TableRow key={material.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <div className="truncate font-medium max-w-[250px]" title={material.title}>
                      {material.title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {material.description || "No description"}
                    </div>
                    
                    {/* Show progress bar for processing items on mobile */}
                    {isProcessing && processingStatus && (
                      <div className="mt-2 md:hidden">
                        <ProcessingProgressBar
                          progress={processingStatus.progress}
                          stage={processingStatus.stage}
                        />
                      </div>
                    )}
                    
                    {/* Show relevant info on mobile that would otherwise be hidden */}
                    <div className="md:hidden flex items-center mt-2 space-x-2">
                      <MaterialTypeBadge type={material.type} />
                      <MaterialStatusBadge status={material.status} />
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  <MaterialTypeBadge type={material.type} />
                </TableCell>
                
                <TableCell className="hidden lg:table-cell">
                  {material.courseId}
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col space-y-1">
                    <MaterialStatusBadge status={material.status} />
                    
                    {isProcessing && processingStatus && (
                      <ProcessingProgressBar
                        progress={processingStatus.progress}
                        stage={processingStatus.stage}
                      />
                    )}
                  </div>
                </TableCell>
                
                <TableCell className="hidden lg:table-cell">
                  {formatFileSize(material.fileSize)}
                </TableCell>
                
                <TableCell className="hidden lg:table-cell">
                  {formatDate(material.uploadedAt)}
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewMaterial(material)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => onEditMaterial(material)}
                        disabled={material.status === 'processing'}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => window.open(material.fileUrl, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open file
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClick(material)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {/* Delete Dialog */}
      {materialToDelete && (
        <DeleteMaterialDialog
          open={deleteDialogOpen}
          material={materialToDelete}
          onClose={() => setDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
}