'use client'

import { HTMLInputTypeAttribute, JSX, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { FormField } from '@/types/auth'

interface AuthFormFieldProps extends FormField {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  animate?: boolean;
  customIndex?: number;
}

export function AuthFormField({
  id,
  label,
  type,
  placeholder,
  required = false,
  autoComplete,
  value,
  onChange,
  error,
  animate = true,
  customIndex = 0
}: AuthFormFieldProps): JSX.Element {
  const hasError = !!error;
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Create the input field once to avoid re-creation during animations
  const inputField = (
    <Input
      ref={inputRef}
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      className={cn(
        "w-full transition-all",
        hasError
          ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10"
      )}
    />
  );

  // Create the label once
  const labelElement = (
    <div className="flex items-center justify-between">
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium transition-colors",
          hasError ? "text-red-500" : "text-gray-700"
        )}
      >
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {hasError && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );

  // For password fields, return without animation
  if (type === 'password' || !animate) {
    return (
      <div className="space-y-2">
        {labelElement}
        {inputField}
      </div>
    );
  }

  // For non-password fields with animation enabled
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

  // Use a simpler approach for animated containers
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={customIndex}
      className="space-y-2"
    >
      {labelElement}
      {inputField}
    </motion.div>
  );
}