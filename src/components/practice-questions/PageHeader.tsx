'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
      className
    )}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-1">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {title}
          </h1>
          {description && (
            <p className="text-slate-600 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {action && (
        <div className="self-start sm:self-center mt-2 sm:mt-0">
          {action}
        </div>
      )}
    </div>
  );
}