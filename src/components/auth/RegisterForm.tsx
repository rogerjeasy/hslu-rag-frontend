'use client'

import { JSX, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AuthFormField } from '@/components/ui/auth/AuthFormField'
import { AuthCheckbox } from '@/components/ui/auth/AuthCheckbox'
import { AuthLinks } from '@/components/ui/auth/AuthLinks'
import { SocialLogin } from '@/components/ui/auth/SocialLogin'
import { ModalRegistrationSuccessful } from '@/components/ui/auth/ModalRegistration'
import { RegisterFormData, AuthFormErrors, FormField } from '@/types/auth'
import { validateRegisterForm, getFieldError, hasFieldError } from '@/utils/authValidation'
import Link from 'next/link'
import { api } from "@/helpers/api";

export function RegisterForm(): JSX.Element {
  // Form state
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    program: '',
    terms: false,
  });
  
  // Form errors state
  const [errors, setErrors] = useState<AuthFormErrors>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Form field definitions
  const fields: FormField[] = [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
      autoComplete: 'name'
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      autoComplete: 'email'
    },
    {
      id: 'studentId',
      label: 'Student ID',
      type: 'text',
      placeholder: 'Enter your HSLU student ID',
      required: false,
      autoComplete: 'off'
    },
    {
      id: 'program',
      label: 'Study Program',
      type: 'text',
      placeholder: 'e.g., MSc Applied Information and Data Science',
      required: false,
      autoComplete: 'off'
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a strong password',
      required: true,
      autoComplete: 'new-password'
    },
    {
      id: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      required: true,
      autoComplete: 'new-password'
    }
  ];

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Use functional update to ensure we're working with the latest state
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the specific field error when user starts typing
    // Also use functional update here for consistency
    if (hasFieldError(errors, name)) {
      setErrors(prev => prev.filter(error => error.field !== name));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, terms: checked }));
    
    // Clear checkbox error when user checks it
    // Also use functional update here
    if (checked && hasFieldError(errors, 'terms')) {
      setErrors(prev => prev.filter(error => error.field !== 'terms'));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateRegisterForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Make API call to register the user
      await api.post('/auth/register', formData);
      
      // Show success modal instead of redirecting immediately
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors([{ field: 'email', message: 'This email is already in use' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  // Form animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="relative w-full max-w-md space-y-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-80"></div>
        
        {/* Static particles with fixed positions to avoid hydration issues */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            custom={i}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
                transition: {
                  delay: i * 0.02,
                  duration: 5 + (i % 4),
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="absolute w-8 h-8 rounded-full bg-blue-400 opacity-10"
            style={{
              top: `${20 + (i * 4) % 60}%`,
              left: `${15 + (i * 5) % 70}%`,
              width: `${20 + (i % 8) * 3}px`,
              height: `${20 + (i % 6) * 4}px`,
            }}
          />
        ))}
        
        {/* Frosted glass effect */}
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center z-10"
      >
        <div className="inline-flex items-center justify-center p-2 mb-2 rounded-xl bg-white shadow-sm">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 12C17.88 12 18.99 10.88 18.99 9.5C18.99 8.12 17.88 7 16.5 7C15.12 7 14 8.12 14 9.5C14 10.88 15.12 12 16.5 12ZM9 11C10.66 11 11.99 9.66 11.99 8C11.99 6.34 10.66 5 9 5C7.34 5 6 6.34 6 8C6 9.66 7.34 11 9 11ZM16.5 14C14.67 14 11 14.92 11 16.75V19H22V16.75C22 14.92 18.33 14 16.5 14ZM9 13C6.67 13 2 14.17 2 16.5V19H9V16.75C9 15.9 9.33 14.41 11.37 13.28C10.5 13.1 9.66 13 9 13Z" fill="#3B82F6"/>
          </svg>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Join HSLU Data Science Exam Preparation Assistant
        </p>
      </motion.div>

      <motion.form
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="relative mt-8 space-y-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 z-10"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400 z-10">
                {getIconForField(field.id)}
              </div>
              <div className="pl-11">
                <AuthFormField
                  {...field}
                  value={formData[field.id as keyof RegisterFormData] as string}
                  onChange={handleChange}
                  error={getFieldError(errors, field.id)}
                  customIndex={index + 1}
                  animate={field.type !== 'password'}
                />
              </div>
            </div>
          ))}
          
          <AuthCheckbox
            id="terms"
            label={
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                  Privacy Policy
                </Link>
              </span>
            }
            checked={formData.terms}
            onChange={handleCheckboxChange}
            error={getFieldError(errors, 'terms')}
            customIndex={7}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM15 6C16.1 6 17 6.9 17 8C17 9.1 16.1 10 15 10C13.9 10 13 9.1 13 8C13 6.9 13.9 6 15 6ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14ZM9 18C9.22 17.28 12.31 16 15 16C17.7 16 20.8 17.29 21 18H9ZM6 15V12H9V10H6V7H4V10H1V12H4V15H6Z" fill="white"/>
                </svg>
                Create Account
              </div>
            )}
          </Button>
        </motion.div>

        <SocialLogin customIndex={9} />
        <AuthLinks mode="register" customIndex={10} />
      </motion.form>
      
      {/* Registration success modal */}
      <ModalRegistrationSuccessful 
        isOpen={showSuccessModal} 
        onClose={handleCloseModal} 
      />
      
      {/* Decorative elements */}
      <div className="absolute top-[-50px] right-[-20px] w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl z-0"></div>
      <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-xl z-0"></div>
    </div>
  );
}

// Helper function to get the appropriate icon for each field
function getIconForField(fieldId: string) {
  switch (fieldId) {
    case 'name':
      return (
        <div className="flex justify-center items-center bg-blue-100 rounded-full p-1 w-7 h-7">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13ZM6 18C6.22 17.28 9.31 15 12 15C14.7 15 17.8 17.29 18 18H6Z" fill="#3B82F6"/>
          </svg>
        </div>
      );
    case 'email':
      return (
        <div className="flex justify-center items-center bg-blue-100 rounded-full p-1 w-7 h-7">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#3B82F6"/>
          </svg>
        </div>
      );
    case 'studentId':
      return (
        <div className="flex justify-center items-center bg-blue-100 rounded-full p-1 w-7 h-7">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7H4C2.9 7 2.01 7.9 2.01 9L2 17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V9C22 7.9 21.1 7 20 7ZM20 17H4V12H20V17ZM20 10H4V9H20V10ZM11 14H13V16H15V14H17V12H15V10H13V12H11V14ZM7 14H5V16H7V14ZM7 12H5V10H7V12Z" fill="#3B82F6"/>
          </svg>
        </div>
      );
    case 'program':
      return (
        <div className="flex justify-center items-center bg-blue-100 rounded-full p-1 w-7 h-7">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" fill="#3B82F6"/>
          </svg>
        </div>
      );
    case 'password':
    case 'confirmPassword':
      return (
        <div className="flex justify-center items-center bg-indigo-100 rounded-full p-1 w-7 h-7">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="#4F46E5"/>
          </svg>
        </div>
      );
    default:
      return null;
  }
}