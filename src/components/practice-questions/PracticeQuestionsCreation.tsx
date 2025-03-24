"use client";

import React, { useState } from 'react';
import { DifficultyLevel, QuestionType } from '@/types/practice-questions';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { useToast } from "@/components/ui/toast-provider";
import FormSection from './creation/FormSection';
import QuestionTypeSelector from './creation/QuestionTypeSelector';
import DifficultySelector from './creation/DifficultySelector';
import TopicInput from './creation/TopicInput';
import CountSelector from './creation/CountSelector';
import CourseSelector from './creation/CourseSelector';
import CreationSummary from './creation/CreationSummary';

interface PracticeQuestionsCreationProps {
  courses: {
    id: string;
    name: string;
    color: string;
  }[];
}

export function PracticeQuestionsCreation({ courses }: PracticeQuestionsCreationProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { createQuestionSet, isCreating } = usePracticeQuestionsStore();
  
  // Form state
  const [topic, setTopic] = useState('');
  const [courseId, setCourseId] = useState('');
  const [moduleId, setModuleId] = useState<string | undefined>(undefined);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MEDIUM);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    QuestionType.MULTIPLE_CHOICE,
    QuestionType.SHORT_ANSWER
  ]);
  
  // Validation state
  const [formErrors, setFormErrors] = useState<{
    topic?: string;
    courseId?: string;
    questionTypes?: string;
  }>({});
  
  // Creation steps state
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { id: 'topic', title: 'Topic & Course', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'config', title: 'Configuration', icon: <Check className="h-4 w-4" /> },
    { id: 'review', title: 'Review', icon: <CheckCircle2 className="h-4 w-4" /> }
  ];

  // Progress percentage for step indicator
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  
  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: {
      topic?: string;
      courseId?: string;
      questionTypes?: string;
    } = {};
    
    if (!topic.trim()) {
      errors.topic = "Topic is required";
    }
    
    if (!courseId) {
      errors.courseId = "Please select a course";
    }
    
    if (selectedTypes.length === 0) {
      errors.questionTypes = "Select at least one question type";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      
      // Show error toast
      toast({
        title: "Validation Error",
        description: "Please check the highlighted fields",
        variant: "destructive",
        duration: 3000,
      });
      
      return;
    }
    
    // Clear any previous errors
    setFormErrors({});
    
    try {
      // Submit the form
      const questionSetId = await createQuestionSet({
        topic,
        courseId,
        moduleId,
        questionCount,
        difficulty,
        questionTypes: selectedTypes
      });
      
      if (questionSetId) {
        toast({
          title: "Success!",
          description: "Your practice questions have been created.",
          duration: 5000,
        });
        
        // Navigate to the created question set
        router.push(`/practice-questions/${questionSetId}`);
      }
    } catch (error) {
      console.error("Failed to create question set:", error);
      toast({
        title: "Error",
        description: "Failed to create practice questions. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  // Handler for type selection
  const handleTypeToggle = (type: QuestionType) => {
    setSelectedTypes(prev => {
      // If the type is already selected, remove it
      if (prev.includes(type)) {
        // Don't allow removing the last type
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter(t => t !== type);
      }
      
      // Otherwise, add it
      return [...prev, type];
    });
    
    // Clear error if any
    if (formErrors.questionTypes) {
      setFormErrors(prev => ({ ...prev, questionTypes: undefined }));
    }
  };
  
  // Handler for course selection
  const handleCourseChange = (courseId: string) => {
    setCourseId(courseId);
    // Reset moduleId when course changes
    setModuleId(undefined);
    
    // Clear error if any
    if (formErrors.courseId) {
      setFormErrors(prev => ({ ...prev, courseId: undefined }));
    }
  };
  
  // Handler for topic change
  const handleTopicChange = (value: string) => {
    setTopic(value);
    
    // Clear error if any
    if (formErrors.topic) {
      setFormErrors(prev => ({ ...prev, topic: undefined }));
    }
  };
  
  // Function to reset the form
  const resetForm = () => {
    setTopic('');
    setCourseId('');
    setModuleId(undefined);
    setQuestionCount(5);
    setDifficulty(DifficultyLevel.MEDIUM);
    setSelectedTypes([QuestionType.MULTIPLE_CHOICE, QuestionType.SHORT_ANSWER]);
    setFormErrors({});
    setCurrentStep(0);
  };
  
  // Navigation functions for steps
  const nextStep = () => {
    // Validation for each step
    if (currentStep === 0) {
      // Validate topic and course
      const errors: { topic?: string; courseId?: string } = {};
      
      if (!topic.trim()) {
        errors.topic = "Topic is required";
      }
      
      if (!courseId) {
        errors.courseId = "Please select a course";
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    } else if (currentStep === 1) {
      // Validate question types
      if (selectedTypes.length === 0) {
        setFormErrors(prev => ({ ...prev, questionTypes: "Select at least one question type" }));
        return;
      }
    }
    
    // If validation passes, proceed to next step
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  // Check if the current step is valid
  const isCurrentStepValid = () => {
    if (currentStep === 0) {
      return !!topic.trim() && !!courseId;
    } else if (currentStep === 1) {
      return selectedTypes.length > 0;
    }
    return true;
  };
  
//   // Question type info with icons, descriptions, and colors for display purposes
//   const questionTypeInfo = [
//     {
//       type: QuestionType.MULTIPLE_CHOICE,
//       label: 'Multiple Choice',
//       badgeColor: 'bg-blue-100 text-blue-700'
//     },
//     {
//       type: QuestionType.SHORT_ANSWER,
//       label: 'Short Answer',
//       badgeColor: 'bg-purple-100 text-purple-700'
//     },
//     {
//       type: QuestionType.TRUE_FALSE,
//       label: 'True/False',
//       badgeColor: 'bg-green-100 text-green-700'
//     },
//     {
//       type: QuestionType.FILL_IN_BLANK,
//       label: 'Fill in Blank',
//       badgeColor: 'bg-amber-100 text-amber-700'
//     },
//     {
//       type: QuestionType.MATCHING,
//       label: 'Matching',
//       badgeColor: 'bg-rose-100 text-rose-700'
//     },
//   ];
    
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b px-6 py-4">
              <CardTitle className="text-xl flex items-center gap-2">
                {steps[0].icon}
                {steps[0].title}
              </CardTitle>
              <CardDescription>
                Define what you want to practice and which course it belongs to
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Topic Section */}
              <div className="bg-background p-6 rounded-lg border shadow-sm">
                <FormSection 
                  title="What would you like to practice?" 
                  description="Enter a specific topic or concept you want to create questions about."
                  error={formErrors.topic}
                >
                  <TopicInput 
                    value={topic} 
                    onChange={handleTopicChange} 
                    error={!!formErrors.topic}
                  />
                </FormSection>
              </div>
              
              <Separator className="my-6" />
              
              {/* Course Selection */}
              <div className="bg-background p-6 rounded-lg border shadow-sm">
                <FormSection 
                  title="Select Course" 
                  description="Choose the course these questions are related to."
                  error={formErrors.courseId}
                >
                  <CourseSelector 
                    courses={courses} 
                    selectedCourseId={courseId} 
                    onChange={handleCourseChange}
                    error={!!formErrors.courseId}
                  />
                </FormSection>
              </div>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b px-6 py-4">
              <CardTitle className="text-xl flex items-center gap-2">
                {steps[1].icon}
                {steps[1].title}
              </CardTitle>
              <CardDescription>
                Configure your practice questions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Left column */}
                <div className="bg-background p-6 rounded-lg border shadow-sm">
                  {/* Question Types */}
                  <FormSection 
                    title="Question Types" 
                    description="Select the types of questions to include."
                    error={formErrors.questionTypes}
                  >
                    <QuestionTypeSelector 
                      selectedTypes={selectedTypes} 
                      onToggle={handleTypeToggle} 
                      error={!!formErrors.questionTypes}
                    />
                  </FormSection>
                </div>
                
                {/* Right column */}
                <div className="space-y-8">
                  {/* Difficulty Level */}
                  <div className="bg-background p-6 rounded-lg border shadow-sm">
                    <FormSection 
                      title="Difficulty Level" 
                      description="Choose how challenging the questions should be."
                    >
                      <DifficultySelector 
                        value={difficulty} 
                        onChange={setDifficulty} 
                      />
                    </FormSection>
                  </div>
                  
                  {/* Question Count */}
                  <div className="bg-background p-6 rounded-lg border shadow-sm">
                    <FormSection 
                      title="Number of Questions" 
                      description="How many questions would you like to generate?"
                    >
                      <CountSelector 
                        value={questionCount} 
                        onChange={setQuestionCount} 
                        min={3} 
                        max={20}
                      />
                    </FormSection>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b px-6 py-4">
              <CardTitle className="text-xl flex items-center gap-2">
                {steps[2].icon}
                {steps[2].title}
              </CardTitle>
              <CardDescription>
                Review your practice question settings before creating
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-background p-6 rounded-lg border shadow-sm">
                {/* Directly render the summary without making API calls */}
                <CreationSummary 
                  topic={topic}
                  courseId={courseId}
                  courses={courses}
                  questionCount={questionCount}
                  difficulty={difficulty}
                  selectedTypes={selectedTypes}
                />
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Practice Questions</h1>
        <p className="text-muted-foreground mt-1">
          Generate custom questions to test your knowledge and prepare for exams
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, idx) => (
            <div 
              key={step.id} 
              className={`flex items-center ${idx > 0 ? 'ml-4' : ''}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 shadow-sm ${
                  idx < currentStep 
                    ? 'bg-primary text-primary-foreground border-primary/50' 
                    : idx === currentStep 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-muted text-muted-foreground border-muted-foreground/30'
                }`}
              >
                {idx < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.icon || (idx + 1)
                )}
              </div>
              <span 
                className={`ml-2 text-sm font-medium hidden sm:inline-block ${
                  idx <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
              {idx < steps.length - 1 && (
                <div className="h-1.5 w-16 mx-2 bg-muted rounded-full hidden sm:block">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                    style={{ 
                      width: idx < currentStep ? '100%' : '0%' 
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 mb-1 shadow-inner">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out shadow-sm" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dynamic step content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>
        
        {/* Navigation and action buttons */}
        <div className="flex flex-wrap justify-between pt-6 border-t border-border">
          <div>
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="mr-4 border-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            
            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              disabled={isCreating}
              className="text-muted-foreground"
            >
              Reset Form
            </Button>
          </div>
          
          <div>
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isCurrentStepValid()}
                className="shadow-sm"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isCreating || !isCurrentStepValid()}
                className="min-w-[160px] bg-primary hover:bg-primary/90 shadow-md"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Questions
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
      
      {/* Help information */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1 bg-muted/20 p-4 rounded-lg border shadow-sm">
            <h4 className="text-foreground font-medium mb-2 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              Practice Question Types
            </h4>
            <p className="text-sm text-muted-foreground">
              Create a variety of question types to test different aspects of your understanding. Multiple choice questions help with recognition, while short answer and matching questions develop recall abilities.
            </p>
          </div>
          <div className="flex-1 bg-muted/20 p-4 rounded-lg border shadow-sm">
            <h4 className="text-foreground font-medium mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Study Tips
            </h4>
            <p className="text-sm text-muted-foreground">
              Regular practice with varied question types improves long-term retention. Consider creating question sets at different difficulty levels and revisiting them periodically for optimal learning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeQuestionsCreation;