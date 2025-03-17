'use client'

import { motion } from 'framer-motion'
import { JSX } from 'react';

/**
 * Component for decorative background gradient effects and patterns
 */
export function BackgroundEffects(): JSX.Element {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-40 left-0 w-96 h-96 rounded-full bg-blue-400 blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-400 blur-3xl"
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern-blue opacity-5" />
    </div>
  );
}