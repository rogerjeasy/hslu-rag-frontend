"use client";

import { Check, ChevronDown, InfoIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ModelSelectorProps, AIModel } from '@/types/chat';

export default function ModelSelector({ 
  selectedModel, 
  onModelChange, 
  models = [], // Default to empty array
  isLoading = false
}: ModelSelectorProps) {
  // Ensure models is always an array
  const safeModels = Array.isArray(models) ? models : [];
  
  // Safe model selection handler
  const handleModelSelect = (model: AIModel) => {
    try {
      if (!model) {
        console.error("Cannot select model: Model is undefined");
        return;
      }
      
      // Validate model has required properties
      if (!model.id || !model.name) {
        console.error("Invalid model data");
        return;
      }
      
      // Call the callback with the validated model
      onModelChange(model);
    } catch (err) {
      console.error("Error while changing model:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              {selectedModel?.name || "Select model"}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {safeModels.length > 0 ? (
          safeModels.map((model) => (
            <ModelOption 
              key={model.id || Math.random().toString()}
              model={model}
              isSelected={selectedModel?.id === model.id}
              onSelect={() => handleModelSelect(model)}
            />
          ))
        ) : (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            No models available
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ModelOptionProps {
  model: AIModel;
  isSelected: boolean;
  onSelect: () => void;
}

function ModelOption({ model, isSelected, onSelect }: ModelOptionProps) {
  if (!model) return null; // Safety check
  
  // Extract model properties with fallbacks
  const {
    name = "Unknown Model",
    description = "",
    context_length,
    capabilities = []
  } = model;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuItem 
            className="flex items-center justify-between cursor-pointer"
            onClick={onSelect}
          >
            <div className="flex items-center">
              <span>{name}</span>
              <InfoIcon className="h-4 w-4 ml-1.5 text-muted-foreground" />
            </div>
            {isSelected && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">{name}</p>
            {description && <p className="text-xs">{description}</p>}
            {context_length && (
              <p className="text-xs">
                Context: {new Intl.NumberFormat().format(context_length)} tokens
              </p>
            )}
            {Array.isArray(capabilities) && capabilities.length > 0 && (
              <div className="text-xs">
                <p className="font-medium mb-1">Capabilities:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {capabilities.map((capability, index) => (
                    <li key={index}>{capability}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}