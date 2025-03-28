import { ProcessingStage } from "@/types/material.types";

interface ProcessingProgressBarProps {
  progress: number;
  stage: ProcessingStage;
}

export function ProcessingProgressBar({ progress, stage }: ProcessingProgressBarProps) {
  // Format stage name for display
  const formatStage = (stage: ProcessingStage): string => {
    switch (stage) {
      case "text_extraction":
        return "Extracting Text";
      case "chunking":
        return "Chunking Content";
      case "embedding":
        return "Generating Embeddings";
      case "indexing":
        return "Indexing";
      case "upload_complete":
        return "Upload Complete";
      default:
        return stage.charAt(0).toUpperCase() + stage.slice(1).replace(/_/g, ' ');
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{formatStage(stage)}</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-1.5">
        <div 
          className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${Math.max(5, progress * 100)}%` }} 
        />
      </div>
    </div>
  );
}