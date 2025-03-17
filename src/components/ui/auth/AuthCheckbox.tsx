'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { JSX, ReactNode } from 'react'

interface AuthCheckboxProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  animate?: boolean;
  customIndex?: number;
}

export function AuthCheckbox({
  id,
  label,
  checked,
  onChange,
  error,
  animate = true,
  customIndex = 0
}: AuthCheckboxProps): JSX.Element {
  const hasError = !!error;
  
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

  const CheckboxContent = () => (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          className={cn(
            "mt-1",
            hasError 
              ? "border-red-300 data-[state=checked]:bg-red-500" 
              : "border-gray-300 data-[state=checked]:bg-blue-600"
          )}
        />
        <div className="space-y-1">
          <Label 
            htmlFor={id} 
            className={cn(
              "text-sm font-medium transition-colors text-gray-700",
              hasError && "text-red-500"
            )}
          >
            {label}
          </Label>
          {hasError && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div 
        variants={variants}
        initial="hidden"
        animate="visible"
        custom={customIndex}
      >
        <CheckboxContent />
      </motion.div>
    );
  }
  
  return <CheckboxContent />;
}