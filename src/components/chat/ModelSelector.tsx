"use client";

import { Check, ChevronDown, InfoIcon } from 'lucide-react';
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
  models 
}: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          {selectedModel?.name || "Select model"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {models.map((model) => (
          <ModelOption 
            key={model.id}
            model={model}
            isSelected={selectedModel?.id === model.id}
            onSelect={() => onModelChange(model)}
          />
        ))}
        
        {models.length === 0 && (
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
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onClick={onSelect}
        >
          <div className="flex items-center">
            <span>{model.name}</span>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 ml-1.5 text-muted-foreground" />
            </TooltipTrigger>
          </div>
          {isSelected && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">{model.name}</p>
            {model.description && <p className="text-xs">{model.description}</p>}
            {model.context_length && (
              <p className="text-xs">
                Context: {new Intl.NumberFormat().format(model.context_length)} tokens
              </p>
            )}
            {model.capabilities && model.capabilities.length > 0 && (
              <div className="text-xs">
                <p className="font-medium mb-1">Capabilities:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {model.capabilities.map((capability, index) => (
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