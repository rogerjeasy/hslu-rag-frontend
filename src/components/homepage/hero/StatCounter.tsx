'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface StatCounterProps {
  icon: ReactNode;
  label: string;
  value: string;
  index: number;
  increment?: number; // Made optional since it's not used in the implementation
  duration: number;
}

export function StatCounter({ 
  icon, 
  label, 
  value, 
  index, 
  duration 
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const iconControls = useAnimation();
  const valueControls = useAnimation();
  const labelControls = useAnimation();
  
  // Extract the numeric part and any suffix (like '+')
  const numericValue = parseInt(value.replace(/\D/g, ''));
  const suffix = value.includes('+') ? '+' : '';
 
  // Animation for counting effect
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
   
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * numericValue));
     
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
   
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  // Handle hover animations efficiently
  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
    
    // Animate components on hover
    iconControls.start({ 
      scale: 1.2, 
      rotate: 5,
      transition: { duration: 0.3 }
    });
    
    valueControls.start({ 
      scale: 1.1, 
      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    });
    
    labelControls.start({ 
      color: "rgb(37 99 235)",
      transition: { duration: 0.3 }
    });
  }, [iconControls, valueControls, labelControls]);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
    
    // Reset animations on hover end
    iconControls.start({ 
      scale: 1, 
      rotate: 0,
      transition: { duration: 0.3 }
    });
    
    valueControls.start({ 
      scale: 1,
      textShadow: "none",
      transition: { duration: 0.3 }
    });
    
    labelControls.start({ 
      color: "rgb(75 85 99)",
      transition: { duration: 0.3 }
    });
    
    // Add subtle pulse animation to value when not hovered
    valueControls.start({
      scale: [1, 1.05, 1],
      transition: { 
        duration: 2, 
        delay: 1 + (index * 0.2), 
        repeat: Infinity, 
        repeatDelay: 5 
      }
    });
  }, [iconControls, valueControls, labelControls, index]);

  // Initialize non-hover animations on first render
  useEffect(() => {
    handleHoverEnd();
  }, [handleHoverEnd]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
      className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Background pattern element - optimized with memo pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20px 20px, rgba(37, 99, 235, 0.15) 4px, transparent 0)",
          backgroundSize: "24px 24px"
        }}
        animate={isHovered ? { opacity: 0.2, scale: 1.05 } : { opacity: 0.1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
     
      {/* Highlight effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-transparent opacity-0"
        animate={isHovered ? { opacity: 0.2 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
     
      <div className="flex flex-col items-center text-center relative z-10">
        <motion.div
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-80 mb-3 shadow-sm"
          animate={isHovered ? 
            { scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.95)" } : 
            { scale: 1, backgroundColor: "rgba(255, 255, 255, 0.8)" }
          }
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={iconControls}
            className="text-blue-600"
          >
            {icon}
          </motion.div>
        </motion.div>
       
        <motion.p
          className="text-3xl font-bold text-blue-700 mb-1"
          animate={valueControls}
        >
          {count}{suffix}
        </motion.p>
       
        <motion.p
          className="text-sm font-medium text-gray-600"
          animate={labelControls}
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  );
}