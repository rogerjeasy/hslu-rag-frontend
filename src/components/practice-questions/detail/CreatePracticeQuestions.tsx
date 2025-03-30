'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourseStore } from '@/store/courseStore';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { practiceQuestionsService } from '@/services/practiceQuestionsService';
import { DifficultyLevel, QuestionTypeEnum } from '@/types/practice-questions.types';
import { LoadingWhileCreating } from '../../study-guides/create/LoadingWhileCreating';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Brain, CheckSquare, AlignLeft, ToggleLeft, TextCursorInput, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Module } from '@/types/course.types';

// Form schema for validation
const formSchema = z.object({
  topic: z.string().min(5, {
    message: "Topic must be at least 5 characters.",
  }),
  courseId: z.string().optional(),
  moduleId: z.string().optional(),
  difficulty: z.string(),
  questionCount: z.number().min(1).max(10),
  questionTypes: z.array(z.string()).min(1, {
    message: "Select at least one question type.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePracticeQuestions() {
  const router = useRouter();
  const { toast } = useToast();
  const { courses } = useCourseStore();
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdSetId, setCreatedSetId] = useState<string | undefined>(undefined);
  const [createdTopic, setCreatedTopic] = useState<string>('');
  
  // Available question types with icons
  const questionTypes = [
    { value: QuestionTypeEnum.MULTIPLE_CHOICE, label: 'Multiple Choice', icon: CheckSquare },
    { value: QuestionTypeEnum.SHORT_ANSWER, label: 'Short Answer', icon: AlignLeft },
    { value: QuestionTypeEnum.TRUE_FALSE, label: 'True/False', icon: ToggleLeft },
    { value: QuestionTypeEnum.FILL_IN_BLANK, label: 'Fill in the Blank', icon: TextCursorInput },
    { value: QuestionTypeEnum.MATCHING, label: 'Matching', icon: ArrowLeftRight },
  ];
  
  // Default form values
  const defaultValues: FormValues = {
    topic: '',
    courseId: '',
    moduleId: '',
    difficulty: DifficultyLevel.MEDIUM,
    questionCount: 5,
    questionTypes: [QuestionTypeEnum.MULTIPLE_CHOICE, QuestionTypeEnum.SHORT_ANSWER],
  };
  
  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Get modules for selected course
  const selectedCourseId = form.watch('courseId');
  const selectedCourse = courses.find(course => course.id === selectedCourseId);
  const modules: Module[] = selectedCourse?.modules || [];
  
  // Reset module selection when course changes
  React.useEffect(() => {
    if (selectedCourseId) {
      form.setValue('moduleId', '');
    }
  }, [selectedCourseId, form]);
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create request payload
      const request = {
        topic: values.topic,
        questionCount: values.questionCount,
        difficulty: values.difficulty,
        questionTypes: values.questionTypes,
        courseId: values.courseId && values.courseId !== "all" ? values.courseId : undefined,
        moduleId: values.moduleId && values.moduleId !== "all" ? values.moduleId : undefined,
      };
      
      setCreatedTopic(values.topic);
      
      // Call service to generate practice questions
      const response = await practiceQuestionsService.generatePracticeQuestions(request);
      
      // Store the ID of created question set
      setCreatedSetId(response.id);
      
      // Show success state
      setIsSuccess(true);
      
      // Update store with new question set
      // This will be done when navigating to the set page
      
      toast({
        title: "Success",
        description: "Practice questions have been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating practice questions:", error);
      toast({
        title: "Error",
        description: "Failed to generate practice questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form and state
  const handleReset = () => {
    form.reset(defaultValues);
    setIsSuccess(false);
    setCreatedSetId(undefined);
    setCreatedTopic('');
  };
  
  const handleCancel = () => {
    router.push('/practice-questions');
  };
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Card className="bg-white shadow-sm overflow-hidden border border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel}
              className="h-9 w-9 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl text-primary">Create Practice Questions</CardTitle>
            </div>
            
            <div className="w-9"></div> {/* Empty div for flex balance */}
          </div>
          <CardDescription className="text-center mt-2">
            Generate custom practice questions based on your course materials
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Topic field */}
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the topic for your practice questions (e.g., 'Data Quality in Business Intelligence')"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about the topic to get the most relevant questions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Question count */}
              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Number of Questions</FormLabel>
                      <span className="text-sm font-medium">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormDescription>
                      Choose between 1-10 questions. More questions may take longer to generate.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Course selection */}
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course (Optional)</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // If "all" is selected, we set it to empty string in the form state
                          if (value === "all") {
                            form.setValue("courseId", "");
                          }
                        }} 
                        value={field.value || "all"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Courses</SelectItem>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Questions will be based on this course's materials.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Module selection - only shown if course is selected */}
                <FormField
                  control={form.control}
                  name="moduleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module (Optional)</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // If "all" is selected, we set it to empty string in the form state
                          if (value === "all") {
                            form.setValue("moduleId", "");
                          }
                        }}
                        value={field.value || "all"}
                        disabled={!selectedCourseId || modules.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              !selectedCourseId 
                                ? "Select a course first" 
                                : modules.length === 0 
                                ? "No modules available" 
                                : "Select a module"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Modules</SelectItem>
                          {modules.map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                              {module.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Further narrow down to a specific module.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Difficulty level */}
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={DifficultyLevel.BASIC}>Basic</SelectItem>
                        <SelectItem value={DifficultyLevel.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={DifficultyLevel.ADVANCED}>Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the difficulty level for your practice questions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Question types */}
              <FormField
                control={form.control}
                name="questionTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Question Types</FormLabel>
                      <FormDescription>
                        Select the types of questions you want to include.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {questionTypes.map((type) => (
                        <FormField
                          key={type.value}
                          control={form.control}
                          name="questionTypes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={type.value}
                                className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type.value)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      
                                      if (checked) {
                                        field.onChange([...currentValues, type.value]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== type.value
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4 text-slate-600" />
                                  <FormLabel className="font-normal cursor-pointer">
                                    {type.label}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />
              
              <Separator className="my-6" />
              
              {/* Submit button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Generating...
                    </>
                  ) : (
                    "Generate Practice Questions"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Loading and Success dialog */}
      <LoadingWhileCreating
        isLoading={isSubmitting}
        isSuccess={isSuccess}
        studyGuideId={createdSetId}
        studyGuideTopic={createdTopic}
        onReset={handleReset}
      />
    </div>
  );
}