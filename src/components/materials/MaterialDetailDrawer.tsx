// components/materials/MaterialDetailDrawer.tsx
"use client";

import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MaterialTypeBadge } from "./MaterialTypeBadge";
import { MaterialStatusBadge } from "./MaterialStatusBadge";
import { ProcessingProgressBar } from "./ProcessingProgressBar";
import { 
  Material, 
  MaterialProcessingStatus, 
  MaterialUpdate 
} from "@/types/material.types";
import { useMaterialStore } from "@/store/materialStore";
import { 
  FileText, 
  Calendar, 
  HardDrive, 
  Link2, 
  DownloadCloud, 
  ExternalLink, 
  Edit3, 
  Save, 
  X, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight, 
  Loader2
} from "lucide-react";
import { formatFileSize, formatDateTime } from "@/lib/utils";

interface MaterialDetailDrawerProps {
  material: Material;
  mode: "view" | "edit";
  open: boolean;
  onClose: () => void;
}

const MATERIAL_TYPES = [
  { value: "lecture", label: "Lecture" },
  { value: "lab", label: "Lab" },
  { value: "exercise", label: "Exercise" },
  { value: "reading", label: "Reading" },
  { value: "other", label: "Other" },
];

export function MaterialDetailDrawer({ 
  material, 
  mode: initialMode, 
  open, 
  onClose 
}: MaterialDetailDrawerProps) {
  const [mode, setMode] = useState(initialMode);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<Partial<MaterialUpdate>>({
    title: material.title,
    description: material.description,
    type: material.type,
    courseId: material.courseId,
    moduleId: material.moduleId,
    topicId: material.topicId
  });

  const { processingStatuses, updateMaterial } = useMaterialStore();
  const processingStatus = processingStatuses[material.id];
  const isProcessing = material.status === 'processing';
  
  const handleChange = (field: keyof MaterialUpdate, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      // In a real app, you would validate the form here
      await updateMaterial(material.id, formState);
      setMode("view");
    } catch (error) {
      console.error("Error updating material:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderProcessingStatus = (status: MaterialProcessingStatus) => {
    return (
      <div className="space-y-4 mt-4 p-4 bg-secondary/30 rounded-md">
        <ProcessingProgressBar 
          progress={status.progress} 
          stage={status.stage} 
        />
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-muted-foreground">Current stage:</div>
          <div className="font-medium">{status.stage.replace(/_/g, ' ')}</div>
          
          {status.totalChunks && (
            <>
              <div className="text-muted-foreground">Total chunks:</div>
              <div className="font-medium">{status.totalChunks}</div>
            </>
          )}
          
          {status.processedChunks && (
            <>
              <div className="text-muted-foreground">Processed chunks:</div>
              <div className="font-medium">{status.processedChunks}</div>
            </>
          )}
          
          <div className="text-muted-foreground">Started at:</div>
          <div className="font-medium">{formatDateTime(status.startedAt)}</div>
        </div>
      </div>
    );
  };
  
  const renderStatusDetail = () => {
    switch (material.status) {
      case "processing":
        return (
          <div className="flex gap-2 items-center text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing in progress</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex gap-2 items-center text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Successfully processed</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex gap-2 items-center text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Processing failed</span>
          </div>
        );
      case "canceled":
        return (
          <div className="flex gap-2 items-center text-amber-600">
            <X className="h-4 w-4" />
            <span>Processing canceled</span>
          </div>
        );
      default:
        return (
          <div className="flex gap-2 items-center">
            <Info className="h-4 w-4" />
            <span>{material.status}</span>
          </div>
        );
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl w-full p-0 overflow-y-auto">
        <div className="sticky top-0 bg-background z-10 border-b">
          <SheetHeader className="p-6 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <SheetTitle className="text-xl text-left mb-1 pr-8">
                  {mode === "view" ? (
                    material.title
                  ) : (
                    "Edit Material"
                  )}
                </SheetTitle>
                {mode === "view" && (
                  <SheetDescription className="text-left">
                    {material.description || "No description provided"}
                  </SheetDescription>
                )}
              </div>
              {mode === "view" && material.status === "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMode("edit")}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </SheetHeader>
          
          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            className="px-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="metadata" disabled={mode === "edit"}>
                Metadata
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-6">
          {mode === "view" ? (
            <>
              <TabsContent value="details" className="m-0">
                <div className="space-y-6">
                  {/* Status section */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                    <div className="flex items-center gap-3">
                      <MaterialStatusBadge status={material.status} />
                      {renderStatusDetail()}
                    </div>
                    
                    {isProcessing && processingStatus && renderProcessingStatus(processingStatus)}
                  </div>
                  
                  <Separator />
                  
                  {/* Basic info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Material Type:</span>
                      <MaterialTypeBadge type={material.type} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Uploaded:</span>
                      <span>{formatDateTime(material.uploadedAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">File Size:</span>
                      <span>{formatFileSize(material.fileSize)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">File Type:</span>
                      <span>{material.fileType.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Course info */}
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Course ID:</span>
                      <span className="font-medium">{material.courseId}</span>
                    </div>
                    
                    {material.moduleId && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">Module ID:</span>
                        <span className="font-medium">{material.moduleId}</span>
                      </div>
                    )}
                    
                    {material.topicId && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">Topic ID:</span>
                        <span className="font-medium">{material.topicId}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3 mt-8">
                    <Button className="w-full" onClick={() => window.open(material.fileUrl, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open File
                    </Button>
                    <Button variant="outline" className="w-full">
                      <DownloadCloud className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="metadata" className="m-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">System Information</h3>
                    <div className="grid grid-cols-3 gap-y-2 text-sm">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="col-span-2 font-mono">{material.id}</span>
                      
                      <span className="text-muted-foreground">Created:</span>
                      <span className="col-span-2">{formatDateTime(material.uploadedAt)}</span>
                      
                      {material.updatedAt && (
                        <>
                          <span className="text-muted-foreground">Last updated:</span>
                          <span className="col-span-2">{formatDateTime(material.updatedAt)}</span>
                        </>
                      )}
                      
                      <span className="text-muted-foreground">File URL:</span>
                      <div className="col-span-2 truncate font-mono text-xs">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="truncate underline" onClick={() => navigator.clipboard.writeText(material.fileUrl)}>
                              {material.fileUrl}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to copy URL</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {material.status === "completed" && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Processing Information</h3>
                        <div className="grid grid-cols-3 gap-y-2 text-sm">
                          <span className="text-muted-foreground">Chunks:</span>
                          <span className="col-span-2">
                            {material.chunkCount || "Unknown"}
                          </span>
                          
                          <span className="text-muted-foreground">Vector IDs:</span>
                          <span className="col-span-2">
                            {material.vectorIds?.length || 0} vectors
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                  <Info className="h-3 w-3 ml-1" />
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="font-normal">
                                  <h4 className="font-semibold mb-2">Vector IDs</h4>
                                  <div className="text-xs font-mono bg-muted p-2 rounded-md max-h-32 overflow-y-auto">
                                    {material.vectorIds?.join('\n') || "No vector IDs available"}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </span>
                        </div>
                      </div>
                      
                      <Separator />
                    </>
                  )}

                  {material.batchId && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Batch Information</h3>
                      <div className="grid grid-cols-3 gap-y-2 text-sm">
                        <span className="text-muted-foreground">Batch ID:</span>
                        <span className="col-span-2 font-mono">{material.batchId}</span>
                        
                        <span className="text-muted-foreground">View batch:</span>
                        <Button variant="link" className="p-0 h-auto justify-start col-span-2">
                          Open batch details
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          ) : (
            // Edit mode form
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formState.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formState.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Add a description for this material..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Material Type</Label>
                  <Select
                    value={formState.type}
                    onValueChange={(value) => handleChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="courseId">Course ID</Label>
                  <Input
                    id="courseId"
                    value={formState.courseId}
                    onChange={(e) => handleChange("courseId", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="moduleId">Module ID (Optional)</Label>
                  <Input
                    id="moduleId"
                    value={formState.moduleId || ""}
                    onChange={(e) => handleChange("moduleId", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topicId">Topic ID (Optional)</Label>
                  <Input
                    id="topicId"
                    value={formState.topicId || ""}
                    onChange={(e) => handleChange("topicId", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setMode("view")}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}