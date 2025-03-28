"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useMaterialStore } from "@/store/materialStore";
import { Material } from "@/types/material.types";

interface DeleteMaterialDialogProps {
  open: boolean;
  material: Material;
  onClose: () => void;
}

export function DeleteMaterialDialog({ open, material, onClose }: DeleteMaterialDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteMaterial } = useMaterialStore();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteMaterial(material.id);
      onClose();
    } catch (error) {
      console.error("Error deleting material:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Material</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete this material? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 border-y">
          <h4 className="font-medium">{material.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {material.description || "No description"}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full inline-block animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Material"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}