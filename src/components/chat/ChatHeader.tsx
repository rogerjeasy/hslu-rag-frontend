"use client";

import { useState, useEffect, useCallback } from 'react';
import { Menu, X, BookOpen, Settings, Loader2, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModelSelector from './ModelSelector';
import { AIModel } from '@/types/chat';
import { cn } from '@/lib/utils';
import FallbackCourseSelector from './FallbackCourseSelector';
import { Course } from '@/types/course.types';
import { useCourseStore } from '@/store/courseStore';
import { QueryType } from '@/types/query';
import { useConversationStore } from '@/store/conversationStore';

// Update the Props interface
interface ChatHeaderProps {
  course: Course | null;
  model: AIModel | null;
  onCourseChange: (course: Course) => void;
  onModelChange: (model: AIModel | null) => void;
  onToggleSidebar: () => void;
  isLoading?: boolean;
  sidebarVisible?: boolean;
}

export default function ChatHeader({ 
  course, 
  model, 
  onCourseChange, 
  onModelChange, 
  onToggleSidebar,
  isLoading = false,
  sidebarVisible = false
}: ChatHeaderProps) {
  const [models, setModels] = useState<AIModel[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get stores
  const courseStore = useCourseStore();
  const conversationStore = useConversationStore();
  
  // Get loading states
  const isLoadingCourses = courseStore.isLoading;
  const isLoadingConversations = conversationStore.isLoading;

  // Combined loading state
  const isAnyLoading = isLoading || isLoadingModels || isLoadingCourses || isLoadingConversations;

  // Safe course change handler
  const handleCourseChange = useCallback((newCourse: Course) => {
    try {
      if (typeof onCourseChange === 'function') {
        onCourseChange(newCourse);
        
        // Also filter conversations by this course
        conversationStore.setSelectedCourse(newCourse.id);
        conversationStore.applyFilters();
      } else {
        setError("Course change handler is not available");
      }
    } catch (err) {
      console.error("Error in course change:", err);
      setError("Failed to change course");
    }
  }, [onCourseChange, conversationStore]);

  // Safe model change handler
  const handleModelChange = useCallback((newModel: AIModel | null) => {
    try {
      if (typeof onModelChange === 'function') {
        onModelChange(newModel);
      } else {
        setError("Model change handler is not available");
      }
    } catch (err) {
      console.error("Error in model change:", err);
      setError("Failed to change model");
    }
  }, [onModelChange]);

  // Check viewport width for responsive adjustments
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    setMounted(true);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Fetch models data (still using mock data for now)
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true);
      setError(null);
      
      try {
        // Simulate API fetch with small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - replace with actual API calls
        const mockModels: AIModel[] = [
          { 
            id: '1', 
            name: 'GPT-4', 
            description: 'Advanced model with strong reasoning capabilities',
            context_length: 8192
          },
          { 
            id: '2', 
            name: 'Claude 3', 
            description: 'Balanced model with good comprehension',
            context_length: 12000
          },
          { 
            id: '3', 
            name: 'Gemini Pro', 
            description: 'Efficient model for most tasks',
            context_length: 4096
          }
        ];

        setModels(mockModels);

        // Set default model if none selected
        if (!model && mockModels.length) {
          handleModelChange(mockModels[0]);
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError("Failed to load models");
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, [model, handleModelChange]);

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Handle query type selection
  const handleQueryTypeChange = (type: QueryType) => {
    conversationStore.setSelectedQueryType(type);
    conversationStore.applyFilters();
  };

  return (
    <header className={cn(
      "border-b border-border w-full overflow-hidden bg-background/95 backdrop-blur-sm z-10",
      "transition-all duration-300",
      mounted ? "opacity-100" : "opacity-0",
      showSettings ? "shadow-sm" : ""
    )}>
      {error && (
        <div className="bg-destructive/10 text-destructive text-xs p-2 text-center">
          Error: {error}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between p-2 sm:p-3 md:p-4 gap-2">
        {/* Left section - Sidebar toggle & Course selector */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
            disabled={isAnyLoading}
            className={cn(
              "h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300",
              "hover:bg-primary/10",
              "relative overflow-hidden",
              sidebarVisible && "bg-muted"
            )}
          >
            {sidebarVisible && (isMobile || isTablet) ? (
              <X className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
            ) : (
              <Menu className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
            )}
            <span className="sr-only">{sidebarVisible ? "Hide" : "Show"} sidebar</span>
          </Button>

          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {isLoadingCourses ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-spin flex-shrink-0" />
            ) : (
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            )}
            
            {/* Use the Fallback CourseSelector instead */}
            <div className="w-40 sm:w-56 lg:w-64">
              <FallbackCourseSelector 
                selectedCourse={course}
                onCourseChange={handleCourseChange}
                disabled={isAnyLoading}
                placeholder="Select a course..."
                courses={courseStore.courses}
              />
            </div>
          </div>
        </div>

        {/* Right section - Model selection & Settings */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {!isMobile && (
            <ModelSelector 
              selectedModel={model}
              onModelChange={handleModelChange}
              models={models || []}
              isLoading={isAnyLoading}
            />
          )}

          <Button 
            variant={showSettings ? "secondary" : "ghost"}
            size="icon" 
            onClick={toggleSettings}
            title={showSettings ? "Close settings" : "Open settings"}
            disabled={isAnyLoading}
            className={cn(
              "h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300",
              "hover:bg-primary/10",
              showSettings ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )}
          >
            {showSettings ? (
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
            ) : (
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
            )}
            <span className="sr-only">{showSettings ? "Close" : "Open"} settings</span>
          </Button>
        </div>
        
        {/* Mobile model selector (full width row) */}
        {isMobile && (
          <div className="w-full mt-1.5 transition-all duration-300">
            <ModelSelector 
              selectedModel={model}
              onModelChange={handleModelChange}
              models={models || []}
              isLoading={isAnyLoading}
            />
          </div>
        )}
      </div>

      {/* Settings Panel - Only shown when settings are toggled */}
      {showSettings && (
        <div className={cn(
          "border-t border-border/50 bg-muted/30 backdrop-blur-sm overflow-y-auto",
          "transition-all duration-300 ease-in-out max-h-[70vh]",
          "p-3 sm:p-4 shadow-inner"
        )}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
              Study Session Settings
              <Sparkles className="h-3 w-3 text-primary/70 hidden sm:inline" />
            </h3>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Query Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium" htmlFor="query-type">
                Conversation Mode
              </label>
              <select 
                id="query-type" 
                className={cn(
                  "w-full border rounded-md p-1.5 sm:p-2 bg-background text-xs sm:text-sm",
                  "focus:border-primary/30 focus:ring focus:ring-primary/10 transition-all duration-200"
                )}
                disabled={isAnyLoading}
                onChange={(e) => handleQueryTypeChange(e.target.value as QueryType)}
                value={conversationStore.selectedQueryType || QueryType.QUESTION_ANSWERING}
              >
                <option value={QueryType.QUESTION_ANSWERING}>Question Answering</option>
                <option value={QueryType.KNOWLEDGE_GAP}>Knowledge Gap Analysis</option>
                <option value={QueryType.PRACTICE_QUESTIONS}>Practice Questions</option>
                <option value={QueryType.STUDY_GUIDE}>Study Guide</option>
              </select>
            </div>
            
            {/* Settings grid - Two columns on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium" htmlFor="context-length">
                  Context Length
                </label>
                <select 
                  id="context-length" 
                  className={cn(
                    "w-full border rounded-md p-1.5 sm:p-2 bg-background text-xs sm:text-sm",
                    "focus:border-primary/30 focus:ring focus:ring-primary/10 transition-all duration-200"
                  )}
                  disabled={isAnyLoading}
                >
                  <option value="4">Last 4 messages</option>
                  <option value="8">Last 8 messages</option>
                  <option value="16">Last 16 messages</option>
                  <option value="all">All messages</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium" htmlFor="citation-style">
                  Citation Style
                </label>
                <select 
                  id="citation-style" 
                  className={cn(
                    "w-full border rounded-md p-1.5 sm:p-2 bg-background text-xs sm:text-sm",
                    "focus:border-primary/30 focus:ring focus:ring-primary/10 transition-all duration-200"
                  )}
                  disabled={isAnyLoading}
                >
                  <option value="inline">Inline Citations</option>
                  <option value="footnote">Footnotes</option>
                  <option value="endnote">Endnotes</option>
                </select>
              </div>
            </div>
            
            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="include-formulas" 
                  className={cn(
                    "rounded border-border h-3.5 w-3.5 sm:h-4 sm:w-4",
                    "text-primary focus:ring-primary/20 transition-all duration-200"
                  )}
                  disabled={isAnyLoading}
                />
                <label className="text-xs font-medium" htmlFor="include-formulas">
                  Include Mathematical Formulas
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="include-code" 
                  className={cn(
                    "rounded border-border h-3.5 w-3.5 sm:h-4 sm:w-4",
                    "text-primary focus:ring-primary/20 transition-all duration-200"
                  )}
                  disabled={isAnyLoading}
                />
                <label className="text-xs font-medium" htmlFor="include-code">
                  Include Code Examples
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="use-images" 
                  className={cn(
                    "rounded border-border h-3.5 w-3.5 sm:h-4 sm:w-4",
                    "text-primary focus:ring-primary/20 transition-all duration-200"
                  )}
                  disabled={isAnyLoading}
                />
                <label className="text-xs font-medium" htmlFor="use-images">
                  Include Diagrams and Images
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium" htmlFor="response-length">
                Preferred Response Length
              </label>
              <select 
                id="response-length" 
                className={cn(
                  "w-full border rounded-md p-1.5 sm:p-2 bg-background text-xs sm:text-sm",
                  "focus:border-primary/30 focus:ring focus:ring-primary/10 transition-all duration-200"
                )}
                disabled={isAnyLoading}
              >
                <option value="concise">Concise</option>
                <option value="balanced">Balanced</option>
                <option value="detailed">Detailed</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-3 sm:mt-4">
            {isAnyLoading ? (
              <Button 
                size="sm" 
                variant="outline" 
                disabled
                className="text-xs h-8"
              >
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Processing
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={toggleSettings}
                className={cn(
                  "text-xs h-8 transition-all duration-200",
                  "hover:bg-primary/10 hover:text-primary border-primary/20"
                )}
              >
                Close
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}