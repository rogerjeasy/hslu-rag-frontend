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
import { UserPlus } from 'lucide-react'
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

  return (
    <div className="w-full max-w-md space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Join HSLU Data Science Exam Preparation Assistant
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          {fields.map((field, index) => (
            <AuthFormField
              key={field.id}
              {...field}
              value={formData[field.id as keyof RegisterFormData] as string}
              onChange={handleChange}
              error={getFieldError(errors, field.id)}
              customIndex={index + 1}
              // Disable animations for password fields
              animate={field.type !== 'password'}
            />
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
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
                <UserPlus className="h-4 w-4 mr-2" />
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
    </div>
  );
}