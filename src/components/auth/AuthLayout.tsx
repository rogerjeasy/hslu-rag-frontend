'use client'

import React, { JSX, ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Database, BrainCircuit, Cpu, Network } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode;
  mode: 'login' | 'register';
}

export function AuthLayout({ children, mode }: AuthLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Decorative side section - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 overflow-hidden relative">
        <div className="absolute inset-0 bg-opacity-20 bg-black">
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern-white opacity-5" />
          
          {/* Decorative circles */}
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
        </div>
        
        <div className="z-10 flex flex-col w-full max-w-md">
          {/* Logo and Title */}
          <div className="mb-12">
            <Link href="/" className="flex items-center">
              <div className="flex items-center justify-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <BrainCircuit className="h-8 w-8 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">HSLU Data Science</span>
            </Link>
            <h1 className="mt-10 text-4xl font-bold">
              {mode === 'login' 
                ? 'Welcome back to your exam preparation partner' 
                : 'Join us for smarter exam preparation'}
            </h1>
            <p className="mt-3 text-lg text-blue-50">
              {mode === 'login'
                ? 'Sign in to access personalized study materials and practice tests.'
                : 'Create an account to unlock personalized learning experiences tailored for HSLU students.'}
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="mt-auto">
            <h3 className="text-xl font-semibold mb-6">Everything you need to excel</h3>
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 rounded-md bg-white/10 p-2">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-medium">{feature.title}</p>
                    <p className="text-sm text-blue-100">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Form section */}
      <div className="flex flex-1 md:w-1/2 items-center justify-center p-6 sm:p-12">
        {children}
      </div>
    </div>
  )
}