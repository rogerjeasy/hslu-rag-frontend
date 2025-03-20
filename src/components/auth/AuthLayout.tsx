'use client'

import React, { JSX, ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Database, BrainCircuit, Cpu, Network } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode;
  mode: 'login' | 'register';
}

export function AuthLayout({ children, mode }: AuthLayoutProps): JSX.Element {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Decorative side section - hidden on mobile */}
      <div 
        className="hidden md:flex md:w-1/2 text-white p-10 overflow-hidden relative"
        style={{ 
          position: 'relative',
        }}
      >
        {/* Background image for Lucerne */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/assets/luzerne.png" 
            alt="Lucerne landscape" 
            fill
            style={{ objectFit: 'cover' }}
            className="transition-opacity duration-700 ease-in-out"
            priority
          />
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-700/80" />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern-white opacity-5" />
        </div>
        
        {/* Animated decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-indigo-500 filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-blue-500 filter blur-3xl"
        />
        
        {/* Content over the background */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="z-10 flex flex-col w-full max-w-md relative"
        >
          {/* Logo and Title */}
          <div className="mb-12 backdrop-blur-sm rounded-xl p-6 bg-black/10">
            <Link href="/" className="flex items-center group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center p-2 rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20"
              >
                <BrainCircuit className="h-8 w-8 text-white" />
              </motion.div>
              <span className="ml-3 text-xl font-bold text-white">HSLU Data Science</span>
            </Link>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-10 text-4xl font-bold"
            >
              {mode === 'login' 
                ? 'Welcome back to your exam preparation partner' 
                : 'Join us for smarter exam preparation'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-3 text-lg text-blue-50"
            >
              {mode === 'login'
                ? 'Sign in to access personalized study materials and practice tests.'
                : 'Create an account to unlock personalized learning experiences tailored for HSLU students.'}
            </motion.p>
          </div>
          
          {/* Feature highlights */}
          <motion.div 
            className="mt-auto backdrop-blur-sm rounded-xl p-6 bg-black/10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl font-semibold mb-6"
            >
              Everything you need to excel
            </motion.h3>
            <div className="space-y-6">
              {[
                {
                  icon: <BrainCircuit className="h-6 w-6" />,
                  title: 'Smart Learning',
                  description: 'AI-powered study materials adapted to your needs'
                },
                {
                  icon: <Database className="h-6 w-6" />,
                  title: 'Comprehensive Content',
                  description: 'Access materials from all MSc Data Science courses'
                },
                {
                  icon: <Network className="h-6 w-6" />,
                  title: 'Track Progress',
                  description: 'Monitor your understanding and identify knowledge gaps'
                },
                {
                  icon: <Cpu className="h-6 w-6" />,
                  title: 'Practice Tests',
                  description: 'Test your knowledge with exam-focused questions'
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-start transition-all duration-300 hover:bg-white/5 p-2 rounded-lg"
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="flex-shrink-0 rounded-md bg-white/10 p-2"
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="ml-4">
                    <p className="text-base font-medium">{feature.title}</p>
                    <p className="text-sm text-blue-100">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Form section */}
      <div 
        className="flex flex-1 md:w-1/2 items-center justify-center p-6 sm:p-12 relative"
        style={{ position: 'relative' }}
      >
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/assets/luzerne.png" 
            alt="HSLU campus" 
            fill
            style={{ objectFit: 'cover' }}
            className="transition-opacity duration-700"
          />
        </div>
        
        {/* Content wrapper */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md backdrop-blur-sm bg-white/70 p-8 rounded-xl shadow-xl"
        > */}
          {children}
        {/* </motion.div> */}
      </div>
    </div>
  )
}