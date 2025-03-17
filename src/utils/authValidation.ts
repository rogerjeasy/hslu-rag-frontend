import { RegisterFormData, LoginFormData, AuthFormErrors } from '@/types/auth';

/**
 * Validates login form input
 * @param data Form data for login
 * @returns Array of validation errors or empty array if valid
 */
export const validateLoginForm = (data: LoginFormData): AuthFormErrors => {
  const errors: AuthFormErrors = [];

  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
};

/**
 * Validates registration form input
 * @param data Form data for registration
 * @returns Array of validation errors or empty array if valid
 */
export const validateRegisterForm = (data: RegisterFormData): AuthFormErrors => {
  const errors: AuthFormErrors = [];

  // Name validation
  if (!data.name) {
    errors.push({ field: 'name', message: 'Full name is required' });
  } else if (data.name.length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Student ID validation - optional but must be valid format if provided
  if (data.studentId && !/^\d{6,8}$/.test(data.studentId)) {
    errors.push({ field: 'studentId', message: 'Student ID must be 6-8 digits' });
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    errors.push({
      field: 'password',
      message: 'Password must include uppercase, lowercase, and numbers'
    });
  }

  // Confirm password validation
  if (!data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
  } else if (data.confirmPassword !== data.password) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  // Terms agreement validation
  if (!data.terms) {
    errors.push({ field: 'terms', message: 'You must agree to the terms and conditions' });
  }

  return errors;
};

/**
 * Get error message for a specific field
 * @param errors List of form errors
 * @param field Field name to check for errors
 * @returns Error message or undefined if no error
 */
export const getFieldError = (errors: AuthFormErrors, field: string): string | undefined => {
  const error = errors.find(e => e.field === field);
  return error?.message;
};

/**
 * Check if a field has an error
 * @param errors List of form errors
 * @param field Field name to check
 * @returns Boolean indicating if the field has an error
 */
export const hasFieldError = (errors: AuthFormErrors, field: string): boolean => {
  return errors.some(e => e.field === field);
};