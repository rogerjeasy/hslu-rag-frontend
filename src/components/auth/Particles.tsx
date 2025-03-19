'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Particles = () => {
  const [loginAttempt, setLoginAttempt] = useState(0);

  // Particle animation variants
  const particleVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.2, 1],
      x: [0, Math.random() * 10 - 5, 0],
      y: [0, Math.random() * 10 - 5, 0],
      transition: {
        delay: i * 0.02,
        duration: 5 + Math.random() * 4,
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    })
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoginAttempt(prev => prev + 1);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}-${loginAttempt}`}
          custom={i}
          variants={particleVariants}
          initial="hidden"
          animate="visible"
          className="absolute w-8 h-8 rounded-full bg-blue-400 opacity-10"
          style={{
            top: `${20 + (i * 4) % 60}%`,
            left: `${15 + (i * 5) % 70}%`,
            width: `${20 + (i % 8) * 3}px`,
            height: `${20 + (i % 6) * 4}px`,
          }}
        />
      ))}
    </>
  );
};

export default Particles;