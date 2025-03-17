'use client'

import { JSX, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AuthFormField } from '@/components/ui/auth/AuthFormField'
import { AuthCheckbox } from '@/components/ui/auth/AuthCheckbox'
import { AuthLinks } from '@/components/ui/auth/AuthLinks'
import { SocialLogin } from '@/components/ui/auth/SocialLogin'
import { LoginFormData, AuthFormErrors, FormField } from '@/types/auth'
import { validateLoginForm, getFieldError, hasFieldError } from '@/utils/authValidation'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api } from "@/helpers/api";

export function LoginForm(): JSX.Element {
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  // Form errors state
  const [errors, setErrors] = useState<AuthFormErrors>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form field definitions
  const fields: FormField[] = [
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      autoComplete: 'email'
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      autoComplete: 'current-password'
    }
  ];

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
    
    if (hasFieldError(errors, name)) {
      setErrors(prev => prev.filter(error => error.field !== name));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData); // Debug logging
    
    // Validate form
    const validationErrors = validateLoginForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', formData);
      console.log('Login response:', response.data);
      localStorage.setItem('userDetails', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.access_token);
      
      // Redirect or show success message
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors([{ field: 'email', message: 'Invalid email or password' }]);
    } finally {
      setIsLoading(false);
    }
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Access your HSLU Data Science Exam Preparation Assistant
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
              value={formData[field.id as keyof LoginFormData] as string}
              onChange={handleChange}
              error={getFieldError(errors, field.id)}
              customIndex={index + 1}
              // Remove the conditional animation - allow all fields to work
              animate={true}
            />
          ))}
          
          <AuthCheckbox
            id="rememberMe"
            label="Remember me"
            checked={formData.rememberMe}
            onChange={handleCheckboxChange}
            customIndex={3}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
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
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="h-4 w-4 mr-2" />
                Sign in
              </div>
            )}
          </Button>
        </motion.div>

        <SocialLogin />
        <AuthLinks mode="login" />
      </motion.form>
    </div>
  );
}