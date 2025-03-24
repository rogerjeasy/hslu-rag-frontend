'use client';

import { DetailLevel, StudyGuideFormat } from '@/types/study-guide';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { 
  ListTree, 
  Grid3X3, 
  AlignJustify, 
  Layers,
  CircleDashed,
  Circle,
  CircleDot,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

// Define the form data type separately so it can be referenced
type StudyGuideFormData = {
  detailLevel: DetailLevel;
  format: StudyGuideFormat;
  includePracticeQuestions: boolean;
};

interface StudyGuideSettingsFormProps {
  formData: StudyGuideFormData;
  updateFormData: (data: Partial<StudyGuideFormData>) => void;
}

export function StudyGuideSettingsForm({ 
  formData, 
  updateFormData 
}: StudyGuideSettingsFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<StudyGuideFormData>({
    defaultValues: {
      detailLevel: formData.detailLevel,
      format: formData.format,
      includePracticeQuestions: formData.includePracticeQuestions
    }
  });

  // Update parent component when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<StudyGuideFormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Detail Level */}
        <FormField
          control={form.control}
          name="detailLevel"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="space-y-1">
                <FormLabel className="text-lg font-semibold text-slate-800">Detail Level</FormLabel>
                <FormDescription className="text-slate-600">
                  Choose how detailed you want your study guide to be
                </FormDescription>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value as DetailLevel)}
                  defaultValue={field.value}
                  className="grid gap-4 pt-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={DetailLevel.BASIC}
                          id="detail-basic"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="detail-basic"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:border-blue-200 hover:bg-blue-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer w-full transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <CircleDashed className="mb-3 h-8 w-8 text-blue-500" />
                        <div className="text-center space-y-1">
                          <p className="font-medium leading-none text-slate-800">Basic</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Key concepts only
                          </p>
                        </div>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={DetailLevel.MEDIUM}
                          id="detail-medium"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="detail-medium"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:border-indigo-200 hover:bg-indigo-50 peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-50 [&:has([data-state=checked])]:border-indigo-500 [&:has([data-state=checked])]:bg-indigo-50 cursor-pointer w-full transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <Circle className="mb-3 h-8 w-8 text-indigo-500" />
                        <div className="text-center space-y-1">
                          <p className="font-medium leading-none text-slate-800">Medium</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Balanced coverage
                          </p>
                        </div>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={DetailLevel.COMPREHENSIVE}
                          id="detail-comprehensive"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="detail-comprehensive"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:border-purple-200 hover:bg-purple-50 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 [&:has([data-state=checked])]:border-purple-500 [&:has([data-state=checked])]:bg-purple-50 cursor-pointer w-full transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <CircleDot className="mb-3 h-8 w-8 text-purple-500" />
                        <div className="text-center space-y-1">
                          <p className="font-medium leading-none text-slate-800">Comprehensive</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Detailed explanations
                          </p>
                        </div>
                      </FormLabel>
                    </FormItem>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Format */}
        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="space-y-1">
                <FormLabel className="text-lg font-semibold text-slate-800">Study Guide Format</FormLabel>
                <FormDescription className="text-slate-600">
                  Choose how you want your study guide to be structured
                </FormDescription>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value as StudyGuideFormat)}
                  defaultValue={field.value}
                  className="grid gap-4 pt-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={StudyGuideFormat.OUTLINE}
                          id="format-outline"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="format-outline"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:border-green-200 hover:bg-green-50 peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50 [&:has([data-state=checked])]:border-green-500 [&:has([data-state=checked])]:bg-green-50 cursor-pointer w-full h-full transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <ListTree className="mb-3 h-8 w-8 text-green-500" />
                        <div className="text-center space-y-1">
                          <p className="font-medium leading-none text-slate-800">Outline</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Structured listing
                          </p>
                        </div>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={StudyGuideFormat.NOTES}
                          id="format-notes"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="format-notes"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:border-teal-200 hover:bg-teal-50 peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50 [&:has([data-state=checked])]:border-teal-500 [&:has([data-state=checked])]:bg-teal-50 cursor-pointer w-full h-full transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <AlignJustify className="mb-3 h-8 w-8 text-teal-500" />
                        <div className="text-center space-y-1">
                          <p className="font-medium leading-none text-slate-800">Notes</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Detailed explanation
                          </p>
                        </div>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={StudyGuideFormat.FLASHCARDS}
                          id="format-flashcards"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="format-flashcards"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:border-amber-200 hover:bg-amber-50 peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 [&:has([data-state=checked])]:border-amber-500 [&:has([data-state=checked])]:bg-amber-50 cursor-pointer w-full h-full transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <Layers className="mb-3 h-8 w-8 text-amber-500" />
                        <div className="text-center space-y-1">
                          <p className="font-medium leading-none text-slate-800">Flashcards</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Q&A format
                          </p>
                        </div>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={StudyGuideFormat.MIND_MAP}
                          id="format-mindmap"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="format-mindmap"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:border-rose-200 hover:bg-rose-50 peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:bg-rose-50 [&:has([data-state=checked])]:border-rose-500 [&:has([data-state=checked])]:bg-rose-50 cursor-pointer w-full h-full transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <Grid3X3 className="mb-3 h-8 w-8 text-rose-500" />
                        <div className="text-center space-y-1">
                          <p className="font-medium leading-none text-slate-800">Mind Map</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Concept connections
                          </p>
                        </div>
                      </FormLabel>
                    </FormItem>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Include practice questions */}
        <FormField
          control={form.control}
          name="includePracticeQuestions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 border-slate-200 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm hover:shadow transition-all duration-200">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="include-questions"
                  className="h-5 w-5 border-2 border-indigo-400 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
              </FormControl>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-500" />
                  <FormLabel htmlFor="include-questions" className="text-base font-semibold text-slate-800">
                    Include practice questions
                  </FormLabel>
                </div>
                <FormDescription className="text-slate-600">
                  Add practice questions with answers at the end of the study guide to test your knowledge
                </FormDescription>
                {field.value && (
                  <div className="mt-2 text-xs text-indigo-600 bg-indigo-100 p-2 rounded-md flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Questions will be tailored to your selected detail level and format</span>
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}

export default StudyGuideSettingsForm;