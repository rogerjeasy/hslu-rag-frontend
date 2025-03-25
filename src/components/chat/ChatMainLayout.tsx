"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * MainLayout component wraps content with appropriate max-width constraints
 * and centering for better proportions on larger screens.
 */
const ChatMainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  maxWidth = '2xl',
  padding = 'md',
}) => {
  const maxWidthClass = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  }[maxWidth];

  const paddingClass = {
    none: 'px-0',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6',
    lg: 'px-6 sm:px-8',
  }[padding];

  return (
    <div className={cn('w-full mx-auto', maxWidthClass, paddingClass, className)}>
      {children}
    </div>
  );
};

export default ChatMainLayout;