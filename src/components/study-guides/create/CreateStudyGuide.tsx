'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudyGuideStore } from '@/store/studyGuideStore';
import { useCourseStore } from '@/store/courseStore';
import { DetailLevel, StudyGuideFormat } from '@/types/study-guide';

import { StudyGuideSettingsForm } from './StudyGuideSettingsForm';
import { StudyGuideTopicForm } from './StudyGuideTopicForm';
import { StudyGuideConfirmation } from './StudyGuideConfirmation';
import { StudyGuideProgress } from './StudyGuideProgress';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useRAGStore } from '@/store/ragStore';
import { StudyGuideResponse, StudyGuideSummary } from '@/types/study-guide.types';

export function CreateStudyGuide() {
  const router = useRouter();
  // const { createGuide } = useStudyGuideStore();
  const { courses } = useCourseStore();
  
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    courseId: '',
    moduleId: '',
    detailLevel: DetailLevel.MEDIUM,
    format: StudyGuideFormat.OUTLINE,
    includePracticeQuestions: false,
  });

  // Update form data
  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Create the study guide request object based on form data
      const studyGuideRequest = {
        topic: formData.topic,
        moduleId: formData.moduleId || undefined,
        detailLevel: formData.detailLevel,
        format: formData.format,
        courseId: formData.courseId,
        additionalParams: {
          courseName: courses.find(c => c.id === formData.courseId)?.name || '',
        }
      };
      
      // Import and use the RAG store
      const { generateStudyGuide } = useRAGStore.getState();
      
      // Generate the study guide using the RAG service
      const response = await generateStudyGuide(studyGuideRequest);
      
      // Access potential ID fields in a type-safe way
      const guideId = typeof response.meta?.id === 'string' 
        ? response.meta.id 
        : typeof response.meta?.document_id === 'string'
          ? response.meta.document_id
          : typeof response.meta?.studyGuideId === 'string'
            ? response.meta.studyGuideId
            : undefined;
      
      if (guideId) {
        // Get the studyGuideStore to update state
        const studyGuideStore = useStudyGuideStore.getState();
        
        // Create a new StudyGuideSummary object
        const newGuide: StudyGuideSummary = {
          id: guideId,
          topic: formData.topic,
          courseId: formData.courseId,
          moduleId: formData.moduleId,
          createdAt: Date.now(),
          format: formData.format,
          detailLevel: formData.detailLevel
        };
        
        const studyGuideResponse: StudyGuideResponse = {
          ...response,
          queryId: guideId,
          query: formData.topic,
          promptType: 'study_guide',
          timestamp: new Date().toISOString()
        };
        
        studyGuideStore.setCurrentStudyGuide(studyGuideResponse);
        
        useStudyGuideStore.setState({
          studyGuides: [newGuide, ...studyGuideStore.studyGuides],
          filteredGuides: [newGuide, ...studyGuideStore.filteredGuides]
        });
        
        // Navigate to the specific guide page
        router.push(`/study-guides/${guideId}`);
      } else {
        // Fallback to the main study guides page
        console.warn('No guide ID found in response, redirecting to main page');
        router.push('/study-guides');
      }
      
    } catch (error) {
      console.error('Error creating study guide:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step validation
  const isStepValid = () => {
    if (currentStep === 0) {
      return formData.courseId !== '' && formData.topic.length >= 5;
    }
    return true;
  };

  // Steps content
  const steps = [
    {
      title: 'Topic',
      component: (
        <StudyGuideTopicForm
          formData={formData}
          updateFormData={updateFormData}
          courses={courses}
        />
      ),
    },
    {
      title: 'Settings',
      component: (
        <StudyGuideSettingsForm
          formData={formData}
          updateFormData={updateFormData}
        />
      ),
    },
    {
      title: 'Confirm',
      component: (
        <StudyGuideConfirmation
          formData={formData}
          courses={courses}
        />
      ),
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="bg-white border border-primary/10 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-primary/10">
          <h1 className="text-2xl font-semibold text-primary">Create Study Guide</h1>
          <p className="text-slate-600 mt-1">
            Generate a personalized study guide based on your course materials
          </p>

          {/* Progress indicator */}
          <div className="mt-6">
            <StudyGuideProgress
              steps={steps.map(step => step.title)}
              currentStep={currentStep}
            />
          </div>
        </div>

        <CardContent className="p-6">
          {/* Step content */}
          <div className="min-h-[320px]">
            {steps[currentStep].component}
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 0 || isSubmitting}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={goToNextStep}
                disabled={!isStepValid() || isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Study Guide
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateStudyGuide;