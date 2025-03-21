'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  UserPlus, 
  ShieldCheck, 
  User, 
  GraduationCap,
  Mail,
  Loader2
} from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"

// Form schema with validation
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["admin", "instructor", "student"], {
    required_error: "Please select a user role.",
  }),
  sendInvite: z.boolean().default(true),
  courses: z.array(z.string()).optional(),
})

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Available courses
  const availableCourses = [
    "Machine Learning",
    "Statistical Methods",
    "Data Visualization",
    "Database Systems",
    "Big Data",
    "Data Mining"
  ]

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
      sendInvite: true,
      courses: [],
    },
  })

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)
      form.reset()
      onOpenChange(false)
    }, 1500)
  }
  
  // Get role icon
//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case 'admin':
//         return <ShieldCheck className="h-4 w-4 mr-2" />
//       case 'instructor':
//         return <GraduationCap className="h-4 w-4 mr-2" />
//       case 'student':
//         return <User className="h-4 w-4 mr-2" />
//       default:
//         return <User className="h-4 w-4 mr-2" />
//     }
//   }

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New User
          </DialogTitle>
          <DialogDescription>
            Create a new user account and set their role and permissions.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="john.doe@hslu.ch" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This will be the username for login.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin" className="flex items-center">
                          <div className="flex items-center">
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="instructor">
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Instructor
                          </div>
                        </SelectItem>
                        <SelectItem value="student">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Student
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Determines access permissions and functionality.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(form.watch("role") === "student" || form.watch("role") === "instructor") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FormField
                  control={form.control}
                  name="courses"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>
                          {form.watch("role") === "student" ? "Enroll in Courses" : "Assign Teaching Courses"}
                        </FormLabel>
                        <FormDescription>
                          {form.watch("role") === "student" 
                            ? "Select courses to enroll the student in"
                            : "Select courses the instructor will teach"
                          }
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {availableCourses.map((course) => (
                          <FormField
                            key={course}
                            control={form.control}
                            name="courses"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={course}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(course)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), course])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== course
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {course}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
            
            <FormField
              control={form.control}
              name="sendInvite"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Send welcome email</FormLabel>
                    <FormDescription>
                      The user will receive an email with login instructions.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}