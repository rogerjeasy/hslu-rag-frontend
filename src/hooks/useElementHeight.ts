"use client";

import { useState, useEffect } from 'react';

export function useElementHeight(selector: string): number {
  const [height, setHeight] = useState(0);
  
  useEffect(() => {
    const updateHeight = () => {
      const element = document.querySelector(selector);
      if (element) {
        setHeight(element.getBoundingClientRect().height);
      }
    };
    
    // Initial calculation
    updateHeight();
    
    // Update on resize
    window.addEventListener('resize', updateHeight);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateHeight);
  }, [selector]);
  
  return height;
}