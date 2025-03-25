"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

// Define models with their capabilities
const MODELS = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model for complex tasks',
    capabilities: ['Advanced reasoning', 'Deep subject expertise', 'More accurate responses']
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5',
    description: 'Fast, cost-effective model',
    capabilities: ['Faster responses', 'Good for simpler queries', 'Lower resource usage']
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    description: 'Alternative model with different strengths',
    capabilities: ['Long context window', 'Detailed text analysis', 'Clear explanations']
  }
];

interface ModelSelectorProps {
  onModelChange?: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelChange }) => {
  const [selectedModel, setSelectedModel] = React.useState(MODELS[0].id);

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    
    if (onModelChange) {
      onModelChange(value);
    }
  };

  const currentModel = MODELS.find(model => model.id === selectedModel);

  return (
    <div className="flex items-center">
      <Select value={selectedModel} onValueChange={handleModelChange}>
        <SelectTrigger className="w-28 sm:w-32 h-8 text-xs">
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>AI Models</SelectLabel>
            {MODELS.map(model => (
              <SelectItem key={model.id} value={model.id} className="text-sm flex items-center">
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      {currentModel && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="ml-1 h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="w-64">
              <div>
                <p className="font-medium mb-1">{currentModel.name}</p>
                <p className="text-sm mb-2">{currentModel.description}</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {currentModel.capabilities.map((capability, index) => (
                    <li key={index}>{capability}</li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default ModelSelector;