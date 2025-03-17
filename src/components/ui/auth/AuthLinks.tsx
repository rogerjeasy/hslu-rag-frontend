'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { JSX } from 'react';

interface AuthLinksProps {
  mode: 'login' | 'register';
  customIndex?: number;
}

export function AuthLinks({ mode, customIndex = 5 }: AuthLinksProps): JSX.Element {
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={customIndex}
      className="text-center mt-8"
    >
      {mode === 'login' ? (
        <>
          <p className="text-sm text-gray-500 mb-1">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              <span>Register now</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </p>
          <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
            Forgot your password?
          </Link>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            <span>Sign in</span>
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </p>
      )}
    </motion.div>
  );
}