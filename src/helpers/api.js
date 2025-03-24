import axios from "axios";
import { getDomain } from "./getDomain";

/**
 * Custom API Error class with enhanced features
 */
export class ApiError extends Error {
  /**
   * Create a new ApiError
   * @param {string} message - User-friendly error message
   * @param {number} status - HTTP status code (0 for network errors)
   * @param {string} detail - Detailed error information for debugging
   * @param {*} originalError - Original error object
   */
  constructor(message, status = 500, detail = '', originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
    this.originalError = originalError;
  }

  /**
   * Indicates if this error represents a not-found resource
   */
  get isNotFound() {
    return this.status === 404;
  }

  /**
   * Indicates if this error represents an authentication issue
   */
  get isAuthError() {
    return this.status === 401 || this.status === 403;
  }

  /**
   * Indicates if this error represents a validation issue
   */
  get isValidationError() {
    return this.status === 400 || this.status === 422;
  }

  /**
   * Indicates if this error represents a server error
   */
  get isServerError() {
    return this.status >= 500;
  }
}

// Create axios instance
export const api = axios.create({
  baseURL: getDomain(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

/**
 * Log errors based on severity and environment
 * @param {string} level - Log level ('error', 'warn', 'info', 'log')
 * @param {string} message - Message to log
 * @param {object} data - Data to log
 */
const logWithLevel = (level, message, data = null) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, just log the message without details for certain levels
    if (level === 'error') {
      console.error(message);
    } else if (level === 'warn') {
      console.warn(message);
    } else if (level === 'info') {
      console.info(message);
    }
  } else {
    // In development, include all details
    if (level === 'error') {
      console.error(message, data);
    } else if (level === 'warn') {
      console.warn(message, data);
    } else if (level === 'info') {
      console.info(message, data);
    } else {
      console.log(message, data);
    }
  }
};

/**
 * Generate an appropriate error message based on status code and endpoint
 * @param {number} status - HTTP status code
 * @param {string} url - Request URL
 * @param {object} data - Response data
 * @returns {string} User-friendly error message
 */
const getErrorMessage = (status, url, data) => {
  // Extract resource type from URL path
  const urlPath = url.split('?')[0]; // Remove query params
  const pathSegments = urlPath.split('/').filter(Boolean);
  const resourceType = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
  const isCollection = pathSegments.length === 1 || 
                      (pathSegments.length > 1 && !isNaN(pathSegments[pathSegments.length - 1]));
  
  // Format the resource type for display (e.g., "practice-questions" -> "practice questions")
  const formattedResource = resourceType.replace(/-/g, ' ');
  
  // If the API provides a specific message, use it
  if (data?.message) {
    return data.message;
  }
  
  // Handle different status codes with context-aware messages
  switch (status) {
    case 400:
      return `Invalid request parameters for ${formattedResource}.`;
      
    case 401:
      return "Your session has expired. Please log in again to continue.";
      
    case 403:
      return "You don't have permission to access this resource.";
      
    case 404:
      // For collection endpoints vs. specific resources
      if (isCollection) {
        return `No ${formattedResource} are currently available.`;
      } else {
        return `The requested ${formattedResource} could not be found.`;
      }
      
    case 422:
      return `Unable to process your request for ${formattedResource}. Please check your input.`;
      
    case 429:
      return "You've made too many requests. Please try again later.";
      
    default:
      if (status >= 500) {
        return "Something went wrong on our servers. Please try again later.";
      }
      return "An unexpected error occurred. Please try again.";
  }
};

/**
 * Handles API errors and returns a standardized ApiError
 * @param {*} error - The error from axios or another source
 * @returns {ApiError} Standardized error with consistent structure
 */
export const handleError = (error) => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    // Network errors (CORS, server down, etc.)
    if (!error.response) {
      logWithLevel('error', "Network Error detected");
      
      // Log additional info for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log("Check if the server is running and CORS is properly configured");
      }
      
      return new ApiError(
        "Unable to connect to the server. Please check your internet connection and try again.",
        0,
        "Network connectivity issue",
        error
      );
    }
    
    // Server responded with an error status
    const status = error.response.status;
    const data = error.response.data;
    const url = error.config?.url || 'unknown endpoint';
    
    // Choose appropriate log level based on status code
    const logLevel = status === 404 ? 'info' : 
                     (status === 401 || status === 403) ? 'warn' : 
                     'error';
    
    // Log with appropriate message
    const logPrefix = status === 404 ? 'Resource not found' : 
                      (status === 401 || status === 403) ? 'Auth required' : 
                      'API Error';
    
    logWithLevel(logLevel, `${logPrefix} (${status}) at ${url}`, { 
      status, 
      data: process.env.NODE_ENV === 'development' ? data : null 
    });
    
    // Get context-aware error message
    const message = getErrorMessage(status, url, data);
    
    // Get appropriate detail information
    let detail = data?.detail || '';
    if (!detail && data && typeof data === 'object') {
      // Try to extract validation details or convert data to string
      if (data.errors || data.validationErrors) {
        detail = JSON.stringify(data.errors || data.validationErrors);
      } else {
        detail = JSON.stringify(data);
      }
    }
    
    // For resource not found on base endpoints, include useful info
    if (status === 404 && url.split('/').filter(Boolean).length <= 1) {
      detail = "This may indicate that no resources exist in this collection yet.";
    }
    
    return new ApiError(message, status, detail, error);
  }
  
  // Handle non-Axios errors
  logWithLevel('error', "Non-Axios error", error);
  
  return new ApiError(
    "An unexpected error occurred. Please try again.",
    500,
    error?.message || "Unknown error",
    error
  );
};

/**
 * Helper function to show appropriate UI messages based on environment
 * @param {ApiError} error - The standardized error
 */
export const showErrorMessage = (error) => {
  // Skip 404 errors - they're handled in the UI components
  if (error.status === 404) {
    return;
  }
  
  // Skip showing alerts in testing environments
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  
  // Create different UI notifications based on error type
  // This is a placeholder - replace with your UI toast/notification system
  if (process.env.NODE_ENV === 'development') {
    // More detailed in development
    console.group('Error Details');
    console.error(`${error.message} (${error.status})`);
    if (error.detail) console.info('Detail:', error.detail);
    console.groupEnd();
    
    // You could replace this with your UI toast/notification system
    alert(`Error (${error.status}): ${error.message}`);
  } else {
    // User-friendly message without technical details in production
    alert(error.message);
  }
};