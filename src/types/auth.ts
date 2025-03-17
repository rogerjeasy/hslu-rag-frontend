/**
 * Type definitions related to authentication
 */

export interface UserCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterFormData extends UserCredentials {
    name: string;
    confirmPassword: string;
    studentId?: string;
    program?: string;
    terms: boolean;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
  }
  
  export interface FormField {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
  }
  
  export interface FormFieldError {
    field: string;
    message: string;
  }
  
  export type AuthFormErrors = FormFieldError[];