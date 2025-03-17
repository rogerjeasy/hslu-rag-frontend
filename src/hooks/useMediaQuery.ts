// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state with the current value
    const updateMatches = () => {
      setMatches(media.matches);
    };
    
    // Set the initial value
    updateMatches();
    
    // Add the change listener
    if (media.addEventListener) {
      media.addEventListener('change', updateMatches);
      return () => media.removeEventListener('change', updateMatches);
    } else {
      // Fallback for older browsers
      media.addListener(updateMatches);
      return () => media.removeListener(updateMatches);
    }
  }, [query]);
  
  return matches;
}