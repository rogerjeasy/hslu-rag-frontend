'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Loading messages that cycle through during loading
const loadingMessages = [
  "Preparing your dashboard...",
  "Loading course information...",
  "Setting up the management interface...",
  "Fetching user data...",
  "Almost there...",
  "Initializing admin features...",
  "Optimizing your experience...",
  "Loading learning resources..."
];

export function EnhancedLoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Cycle through messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center z-50">
      <div className="relative w-full max-w-md mx-auto px-6 py-12">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2"></div>
          <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
      
        {/* Logo or brand element */}
        <div className="w-full flex justify-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-background/50 backdrop-blur-sm border border-border/50 p-6 rounded-2xl shadow-lg"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-12 h-12 text-primary mx-auto"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </motion.div>
        </div>

        {/* Animated spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Outer spinner */}
            <motion.div
              className="w-16 h-16 border-4 border-primary/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />
            {/* Inner spinner */}
            <motion.div
              className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
            />
            {/* Center dot */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Animated loading messages */}
        <div className="h-8 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center text-muted-foreground font-medium"
            >
              {loadingMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full mt-8 bg-muted rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "10%" }}
            animate={{ width: "90%" }}
            transition={{ duration: 15, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}