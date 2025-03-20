'use client'

import { JSX, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AuthFormField } from '@/components/ui/auth/AuthFormField'
import { AuthCheckbox } from '@/components/ui/auth/AuthCheckbox'
import { AuthLinks } from '@/components/ui/auth/AuthLinks'
import { SocialLogin } from '@/components/ui/auth/SocialLogin'
import { LoginFormData, AuthFormErrors, FormField } from '@/types/auth'
import { validateLoginForm, getFieldError, hasFieldError } from '@/utils/authValidation'
import { useRouter } from 'next/navigation'
import { api } from "@/helpers/api"
import { useUserStore } from '@/store/userStore' // Import the Zustand store

export function LoginForm(): JSX.Element {
  // Get the setUser function from Zustand store
  const setUser = useUserStore(state => state.setUser);
  
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
      
      // Use the Zustand store to set user and token
      setUser(response.data.user, response.data.access_token);
      
      // Show success message before redirect
      setShowSuccessMessage(true);
      
      // Redirect after a short delay to show success animation
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setErrors([{ field: 'email', message: 'Invalid email or password' }]);
    } finally {
      setIsLoading(false);
    }
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

  // Success message animation
  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="relative w-full max-w-md space-y-8">
      {/* Animated background particles */}
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
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="#3B82F6"/>
          </svg>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your HSLU Data Science Exam Preparation Assistant
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {showSuccessMessage ? (
          <motion.div
            key="success"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 z-10"
          >
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="rounded-full bg-green-100 p-3">
                <svg 
                  className="w-8 h-8 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Login Successful!</h3>
              <p className="text-gray-600 text-center">Redirecting you to your dashboard...</p>
              <div className="w-12 h-1 bg-blue-100 rounded-full overflow-hidden mt-2">
                <motion.div 
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.9 }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
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
                    {field.id === 'email' ? (
                      <div className="flex justify-center items-center bg-blue-100 rounded-full p-1 w-7 h-7">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#3B82F6"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center bg-indigo-100 rounded-full p-1 w-7 h-7">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="#4F46E5"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="pl-11">
                    <AuthFormField
                      {...field}
                      value={formData[field.id as keyof LoginFormData] as string}
                      onChange={handleChange}
                      error={getFieldError(errors, field.id)}
                      customIndex={index + 1}
                      animate={true}
                    />
                  </div>
                </div>
              ))}
              
              <AuthCheckbox
                id="rememberMe"
                label="Remember me for 30 days"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7Z" fill="white"/>
                      <path d="M20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z" fill="white"/>
                    </svg>
                    Sign in
                  </div>
                )}
              </Button>
            </motion.div>

            <SocialLogin />
            <AuthLinks mode="login" />
          </motion.form>
        )}
      </AnimatePresence>
      
      {/* Decorative elements */}
      <div className="absolute top-[-50px] right-[-20px] w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl z-0"></div>
      <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-xl z-0"></div>
    </div>
  );
}