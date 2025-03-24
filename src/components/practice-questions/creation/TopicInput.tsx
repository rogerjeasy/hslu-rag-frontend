"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  X, 
  Brain, 
  Database,
  BarChart,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface SuggestionButtonProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: (value: string) => void;
  color?: string;
}

// Popular topic suggestions with color assignment
const POPULAR_TOPICS = [
  {
    icon: <Brain className="w-3.5 h-3.5" />,
    label: "Machine Learning",
    value: "Machine Learning Fundamentals",
    color: "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900 border-indigo-200 dark:border-indigo-800"
  },
  {
    icon: <Database className="w-3.5 h-3.5" />,
    label: "Database Design",
    value: "Database Normalization",
    color: "bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300 hover:bg-cyan-200 dark:hover:bg-cyan-900 border-cyan-200 dark:border-cyan-800"
  },
  {
    icon: <BarChart className="w-3.5 h-3.5" />,
    label: "Statistics",
    value: "Statistical Hypothesis Testing",
    color: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900 border-violet-200 dark:border-violet-800"
  }
];

// Additional topic suggestions that appear only in expanded mode
const ADDITIONAL_TOPICS = [
  {
    icon: <Brain className="w-3.5 h-3.5" />,
    label: "Neural Networks",
    value: "Neural Networks and Deep Learning",
    color: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900 border-rose-200 dark:border-rose-800"
  },
  {
    icon: <Code className="w-3.5 h-3.5" />,
    label: "SQL Queries",
    value: "Advanced SQL Query Optimization",
    color: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 border-emerald-200 dark:border-emerald-800"
  }
];

const SuggestionButton: React.FC<SuggestionButtonProps> = ({ icon, label, value, onClick, color }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-8 text-xs flex items-center gap-1.5 rounded-full transition-all border shadow-sm",
            color || "bg-background hover:bg-muted/80 border-input/50"
          )}
          onClick={() => onClick(value)}
        >
          <span className="flex items-center justify-center">{icon}</span>
          <span className="truncate max-w-[100px] sm:max-w-none">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-popover text-popover-foreground border shadow-md">
        <p className="text-xs">Set topic to: {value}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const TopicInput: React.FC<TopicInputProps> = ({
  value,
  onChange,
  error = false,
  onFocus,
  onBlur
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update clear button visibility when value changes
  useEffect(() => {
    setShowClearButton(value.length > 0);
  }, [value]);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    
    // Focus the appropriate input after state update
    setTimeout(() => {
      if (!isExpanded) {
        textareaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }, 0);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };
  
  const clearInput = () => {
    onChange("");
    if (isExpanded) {
      textareaRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  };
  
  const handleTopicSelection = (newTopic: string) => {
    onChange(newTopic);
    
    // Provide visual feedback by briefly highlighting the input
    if (isExpanded) {
      textareaRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="relative group">
        {isExpanded ? (
          <Textarea
            ref={textareaRef}
            placeholder="Enter a topic or specific concept to study (e.g., 'Linear Regression in Machine Learning', 'Data Normalization Techniques')"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "min-h-[120px] max-h-[240px] resize-y pr-10 transition-all duration-200 shadow-sm",
              isFocused ? "ring-2 ring-primary/30" : "",
              error ? "border-destructive focus-visible:ring-destructive/30" : ""
            )}
          />
        ) : (
          <Input
            ref={inputRef}
            placeholder="Enter topic (e.g., 'Linear Regression', 'Data Normalization')"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "pr-10 transition-all duration-200 shadow-sm",
              isFocused ? "ring-2 ring-primary/30" : "",
              error ? "border-destructive focus-visible:ring-destructive/30" : ""
            )}
          />
        )}
        
        {/* Clear button */}
        {showClearButton && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full p-1 hover:bg-muted/80 transition-colors"
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Input mode toggle and suggestions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleExpanded}
          className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 w-fit"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-1.5 h-3.5 w-3.5" />
              <span>Use simple input</span>
            </>
          ) : (
            <>
              <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
              <span>Add more details</span>
            </>
          )}
        </Button>
        
        {/* AI Suggestion button */}
        {isExpanded && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs flex items-center gap-1.5 ml-auto sm:ml-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 shadow-sm"
            onClick={() => handleTopicSelection("Machine Learning Neural Network Architectures and Optimization Techniques")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Suggestion</span>
          </Button>
        )}
      </div>
      
      {/* Popular topics */}
      <div className="pt-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-xs font-medium text-foreground">Popular topics</div>
          <div className="h-px flex-1 bg-border/70"></div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {POPULAR_TOPICS.map((topic, index) => (
            <SuggestionButton
              key={index}
              icon={topic.icon}
              label={topic.label}
              value={topic.value}
              onClick={handleTopicSelection}
              color={topic.color}
            />
          ))}
          
          {/* Additional topics in expanded mode */}
          {isExpanded && ADDITIONAL_TOPICS.map((topic, index) => (
            <SuggestionButton
              key={`additional-${index}`}
              icon={topic.icon}
              label={topic.label}
              value={topic.value}
              onClick={handleTopicSelection}
              color={topic.color}
            />
          ))}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-xs mt-1 flex items-center p-2 rounded-md">
          <X className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          <span>Please enter a topic before continuing</span>
        </div>
      )}
      
      {/* Character counter when in expanded mode */}
      {isExpanded && value.length > 0 && (
        <div className="text-xs text-muted-foreground text-right">
          {value.length} characters
        </div>
      )}
    </div>
  );
};

export default TopicInput;