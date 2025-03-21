// src/components/application-management/courses/CourseForm.tsx
'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { Course } from './CourseContext'

// Define form schema with Zod for validation
const courseFormSchema = z.object({
  code: z.string()
    .min(2, { message: "Course code must be at least 2 characters." })
    .max(10, { message: "Course code must not exceed 10 characters." }),
  name: z.string()
    .min(5, { message: "Course name must be at least 5 characters." })
    .max(100, { message: "Course name must not exceed 100 characters." }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(500, { message: "Description must not exceed 500 characters." }),
  semester: z.string({
    required_error: "Please select a semester.",
  }),
  credits: z.coerce.number()
    .int()
    .min(1, { message: "Credits must be at least 1." })
    .max(30, { message: "Credits must not exceed 30." }),
  status: z.enum(['active', 'inactive', 'archived'], {
    required_error: "Please select a status.",
  }),
  instructor: z.string()
    .min(5, { message: "Instructor name must be at least 5 characters." })
    .max(100, { message: "Instructor name must not exceed 100 characters." }),
})

// Infer type from schema
type CourseFormValues = z.infer<typeof courseFormSchema>

// Define props interface
interface CourseFormProps {
  initialData?: Course | null
  onSubmit: (data: CourseFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
}

export function CourseForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting
}: CourseFormProps) {
  // Available semesters
  const semesters = [
    "Fall 2023",
    "Spring 2024",
    "Fall 2024",
    "Spring 2025",
  ]
  
  // Create form with react-hook-form and zod resolver
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      semester: initialData?.semester || "",
      credits: initialData?.credits || 3,
      status: initialData?.status || "active",
      instructor: initialData?.instructor || "",
    }
  })
  
  // Handle form submission
  const handleSubmit = (values: CourseFormValues) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Code</FormLabel>
                <FormControl>
                  <Input placeholder="DS101" {...field} />
                </FormControl>
                <FormDescription>
                  A unique identifier for the course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="Introduction to Data Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Course description and learning objectives" 
                  className="resize-none min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credits</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={30} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Jane Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Form>
  )
}