"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, BookOpen, Sparkles, Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course.types';
import { cn } from '@/lib/utils';
import { getCourseCardClasses, enhanceCourseForUI } from '@/lib/course-colors';

export interface EmptyStateProps {
  course: Course | null;
  onStartConversation: (message: string) => void;
  isMobile?: boolean;
}

export default function EmptyState({
  course,
  onStartConversation,
  // isMobile = false
}: EmptyStateProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [enhancedCourse, setEnhancedCourse] = useState<Course | null>(null);

  // Enhance course with UI properties if needed
  useEffect(() => {
    if (course) {
      // Create a compatible input object for enhanceCourseForUI
      const courseInput = {
        code: course.code,
        name: course.name,
        description: course.description,
        color: course.color,
        icon: typeof course.icon === 'string' ? course.icon : undefined,
        topics: course.topics,
        sampleQuestion: course.sampleQuestion,
        difficulty: course.difficulty,
        highlights: course.highlights,
        credits: course.credits,
        instructor: course.instructor,
        semester: course.semester
      };
      
      // The enhanced course will have all UI properties set
      const enhanced = enhanceCourseForUI(courseInput);
      
      // Merge the enhanced properties back with the original course
      setEnhancedCourse({
        ...course,
        color: enhanced.color,
        topics: enhanced.topics,
        sampleQuestion: enhanced.sampleQuestion,
        difficulty: enhanced.difficulty,
        highlights: enhanced.highlights
      });
    } else {
      setEnhancedCourse(null);
    }
  }, [course]);

  // Default suggestions if no course is selected
  const defaultSuggestions = [
    {
      text: "Help me understand a complex topic",
      prompt: "I'd like to understand the concept of machine learning. Can you explain it in simple terms?"
    },
    {
      text: "Create a study plan for me",
      prompt: "Can you create a 4-week study plan to help me master basic calculus?"
    },
    {
      text: "Guide me through a problem",
      prompt: "I need help solving this problem: If a rectangle has a perimeter of 30 units and a width of 5 units, what is its area?"
    }
  ];

  // Course-specific sample questions generated from topics
  const courseSuggestions = enhancedCourse?.topics?.map(topic => ({
    text: topic,
    prompt: `Can you explain ${topic} in the context of ${enhancedCourse.name}?`
  })) || [];
  
  // Additional course-specific prompts
  const moreSuggestions = enhancedCourse ? [
    {
      text: `Introduce me to ${enhancedCourse.name}`,
      prompt: `Give me a comprehensive introduction to ${enhancedCourse.name}. What are the key concepts I should understand?`
    },
    {
      text: "Quiz me on this subject",
      prompt: `Create a 5-question quiz on ${enhancedCourse.name} to test my knowledge.`
    },
    {
      text: enhancedCourse.sampleQuestion || "Help me understand a concept",
      prompt: enhancedCourse.sampleQuestion || `Explain a fundamental concept in ${enhancedCourse.name}`
    }
  ] : [];

  // Combine suggestions based on whether a course is selected
  const suggestions = enhancedCourse 
    ? [...courseSuggestions.slice(0, 3), ...moreSuggestions]
    : defaultSuggestions;

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Get card classes based on course color
  const cardClasses = enhancedCourse?.color 
    ? getCourseCardClasses(enhancedCourse.color)
    : {
        container: "border-blue-200/50 bg-blue-50/30",
        icon: "bg-blue-100/50 text-blue-600",
        badge: "bg-blue-100 text-blue-700",
        highlight: "text-blue-600"
      };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8 md:px-8 lg:px-12 overflow-y-auto">
      <motion.div 
        className="max-w-3xl w-full flex flex-col items-center justify-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-lg mx-auto">
          <div className="mb-6 flex justify-center">
            {enhancedCourse ? (
              <div className={cn(
                "p-3 rounded-full",
                cardClasses.icon,
                "flex items-center justify-center"
              )}>
                {enhancedCourse.icon || <BookOpen className="h-8 w-8" />}
              </div>
            ) : (
              <div className="p-3 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <MessageSquare className="h-8 w-8" />
              </div>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {enhancedCourse 
              ? `Ready to discuss ${enhancedCourse.name}`
              : "Start a new conversation"}
          </h1>
          
          <p className="text-muted-foreground text-sm sm:text-base">
            {enhancedCourse 
              ? enhancedCourse.description || "Ask questions, get explanations, or explore concepts related to this course."
              : "Select a course and ask anything. Get help with assignments, explanations of concepts, or create study materials."}
          </p>
        </div>

        {/* Course Info Section - Only show when course is selected */}
        {enhancedCourse && (
          <motion.div 
            className={cn(
              "w-full rounded-lg border p-4 shadow-sm",
              cardClasses.container
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "rounded-md p-2.5 flex-shrink-0 hidden sm:flex",
                cardClasses.icon
              )}>
                {enhancedCourse.icon || <BookOpen className="h-5 w-5" />}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h3 className="font-medium text-foreground">{enhancedCourse.name}</h3>
                    <span className="text-xs text-muted-foreground">{enhancedCourse.code}</span>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    cardClasses.badge
                  )}>
                    {enhancedCourse.difficulty || enhancedCourse.status}
                  </span>
                </div>
                
                {enhancedCourse.highlights && enhancedCourse.highlights.length > 0 && (
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {enhancedCourse.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className={cn("h-4 w-4 flex-shrink-0 mt-0.5", cardClasses.highlight)} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggestions Section */}
        <div className="w-full">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-foreground">Suggested prompts</h2>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className={cn(
                  "border rounded-lg p-4 transition-all duration-200 cursor-pointer",
                  "hover:border-primary/60 hover:bg-primary/5 hover:shadow-sm",
                  selectedPrompt === suggestion.prompt 
                    ? "border-primary/60 bg-primary/5 shadow-sm" 
                    : "border-border bg-background"
                )}
                onClick={() => setSelectedPrompt(suggestion.prompt)}
              >
                <div className="flex items-start gap-3">
                  <Sparkles className={cn(
                    "h-5 w-5 flex-shrink-0 mt-0.5",
                    selectedPrompt === suggestion.prompt ? "text-primary" : "text-muted-foreground"
                  )} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{suggestion.text}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{suggestion.prompt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Send Button */}
        <div className="w-full flex justify-center mt-4">
          <Button 
            onClick={() => selectedPrompt && onStartConversation(selectedPrompt)}
            disabled={!selectedPrompt || !enhancedCourse}
            className="gap-2 px-8 py-6 h-auto sm:min-w-[200px] shadow-sm"
            size="lg"
          >
            <Send className="h-4 w-4" />
            <span>{enhancedCourse ? "Ask this question" : "Select a course"}</span>
          </Button>
        </div>

        {/* No Course Selected Hint */}
        {!enhancedCourse && (
          <motion.p 
            className="text-xs text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Select a course from the dropdown above to get started
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}