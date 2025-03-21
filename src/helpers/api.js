import axios from "axios";
import { getDomain } from "./getDomain";

export const api = axios.create({
  baseURL: getDomain(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true 
});


export const handleError = error => {
  const response = error.response;
  
  // Special handling for CORS and network errors
  if (error.message && error.message.match(/Network Error/)) {
    console.error("Network Error or CORS issue detected:", error);
    console.log("Check if the server is running and CORS is properly configured");
    
    // More specific message for development
    if (process.env.NODE_ENV === 'development') {
      alert("The server cannot be reached or a CORS issue occurred.\nCheck that:\n1. The server is running\n2. CORS is properly configured\n3. You're using the correct URL");
    } else {
      alert("The server cannot be reached. Please try again later.");
    }
    
    return "Network error - server unreachable or CORS issue";
  }
  
  // Handle regular API errors (4xx, 5xx)
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\nRequest to: ${response.request.responseURL}`;
    if (response.data.status) {
      info += `\nStatus code: ${response.data.status}`;
      info += `\nError: ${response.data.error}`;
      info += `\nError message: ${response.data.message}`;
    } else {
      info += `\nStatus code: ${response.status}`;
      info += `\nError message:\n${response.data}`;
    }
    console.log("The request was made and answered but was unsuccessful.", error.response);
   
    return info;
  } else {
    // Other errors
    console.log("Something else happened.", error);
    return error.message;
  }
};