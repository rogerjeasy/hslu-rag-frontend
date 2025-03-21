/**
 * Type definitions related to authentication
 */

export interface User {
    id: string;
    full_name: string;
    email: string;
    studentId?: string;
    program?: string;
    token?: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    token?: string; // Add token as an optional property
  }
  
export interface AuthProviderProps {
  children: React.ReactNode;
  }


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