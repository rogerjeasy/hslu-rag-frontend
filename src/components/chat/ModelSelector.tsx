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
import { Sparkles, Zap, Brain, Cpu } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Available models
const MODELS = [
  { 
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most powerful model, best for complex tasks',
    icon: Brain,
    color: 'text-purple-500',
  },
  { 
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Advanced reasoning and in-depth analysis',
    icon: Sparkles,
    color: 'text-blue-500',
  },
  { 
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    icon: Zap,
    color: 'text-green-500',
  },
  { 
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Quick responses, great for chat',
    icon: Cpu,
    color: 'text-amber-500',
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  className?: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  className,
}) => {
  const selectedModelInfo = MODELS.find(m => m.id === selectedModel) || MODELS[0];
  const Icon = selectedModelInfo.icon;

  return (
    <div className={className}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Select value={selectedModel} onValueChange={onSelectModel}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", selectedModelInfo.color)} />
                  <SelectValue>{selectedModelInfo.name}</SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Models</SelectLabel>
                  {MODELS.map(model => {
                    const ModelIcon = model.icon;
                    return (
                      <SelectItem
                        key={model.id}
                        value={model.id}
                        className="flex items-center gap-2 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <ModelIcon className={cn("h-4 w-4", model.color)} />
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {model.description}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>
            <p>{selectedModelInfo.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ModelSelector;