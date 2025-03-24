'use client';

import { Course } from '@/types/course.types';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

// Define the module interface
interface Module {
  id: string;
  name: string;
  description?: string;
}

// Define a type for our form data
type StudyGuideTopicFormData = {
  topic: string;
  courseId: string;
  moduleId: string;
};

interface StudyGuideTopicFormProps {
  formData: StudyGuideTopicFormData;
  updateFormData: (data: Partial<StudyGuideTopicFormData>) => void;
  courses: (Course & { modules?: Module[] })[];
}

// Form schema with validation
const formSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters long"),
  courseId: z.string().min(1, "Please select a course"),
  moduleId: z.string().optional()
});

export function StudyGuideTopicForm({ 
  formData, 
  updateFormData, 
  courses 
}: StudyGuideTopicFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: formData.topic,
      courseId: formData.courseId,
      moduleId: formData.moduleId
    }
  });

  // Get selected course to show modules
  const selectedCourse = courses.find(c => c.id === form.watch('courseId'));
  
  // Example topic suggestions based on course
  const getTopicSuggestions = (courseId: string): string[] => {
    const courseMap: Record<string, string[]> = {
      // Example suggestions for a few courses
      'ml-course': [
        'Linear Regression and its applications',
        'Neural Networks fundamentals',
        'Clustering algorithms comparison'
      ],
      'stats-course': [
        'Hypothesis testing techniques',
        'Probability distributions overview',
        'Statistical analysis methods'
      ],
      'big-data-course': [
        'MapReduce paradigm',
        'Big data storage solutions',
        'Stream processing frameworks'
      ]
    };
    
    return courseMap[courseId] || [];
  };

  // Watch for form changes and update parent state
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateFormData(values);
  };

  // Update parent component when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<StudyGuideTopicFormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold">Course</FormLabel>
              <FormDescription>
                Select the course for which you want to create a study guide
              </FormDescription>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Courses</SelectLabel>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCourse?.modules && selectedCourse.modules.length > 0 && (
          <FormField
            control={form.control}
            name="moduleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Module (Optional)</FormLabel>
                <FormDescription>
                  You can narrow down your study guide to a specific module
                </FormDescription>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a module (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Modules</SelectLabel>
                      <SelectItem value="">All modules</SelectItem>
                      {selectedCourse.modules?.map((module: Module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Topic</FormLabel>
              <FormDescription>
                What specific topic would you like to study?
              </FormDescription>
              <FormControl>
                <Input 
                  placeholder="e.g., Linear Regression in Machine Learning" 
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Topic suggestions */}
        {form.watch('courseId') && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Topic suggestions</h4>
                <div className="mt-2 space-y-2">
                  {getTopicSuggestions(form.watch('courseId')).map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      className="block text-sm text-amber-700 hover:text-amber-900 hover:underline"
                      onClick={() => form.setValue('topic', suggestion, { shouldValidate: true })}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}

export default StudyGuideTopicForm;