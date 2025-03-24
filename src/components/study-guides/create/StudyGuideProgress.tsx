'use client';

import React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudyGuideProgressProps {
  steps: string[];
  currentStep: number;
}

export function StudyGuideProgress({
  steps,
  currentStep
}: StudyGuideProgressProps) {
  return (
    <div className="w-full">
      {/* Mobile progress (visible on small screens) */}
      <div className="sm:hidden mb-4">
        <p className="text-sm font-medium text-slate-600 mb-1">
          Step {currentStep + 1} of {steps.length}: <span className="text-primary">{steps[currentStep]}</span>
        </p>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop progress (exactly matching the screenshot) */}
      <div className="hidden sm:flex w-full items-center justify-between relative">
        {/* Step 1 connector */}
        <div className="absolute w-[calc(50%-1rem)] h-0.5 bg-slate-800 left-[calc(1rem+10px)] top-1/2 transform -translate-y-1/2"></div>
        
        {/* Step 2 connector */}
        <div className="absolute w-[calc(50%-1rem)] h-0.5 bg-slate-200 right-[calc(1rem+10px)] top-1/2 transform -translate-y-1/2"></div>
        
        {/* Step indicators */}
        <div className="flex flex-col items-center z-10">
          {/* First dot (Topic - completed) */}
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <CheckIcon className="h-4 w-4 text-white" />
          </div>
          <span className="mt-2 text-sm text-center">Topic</span>
        </div>
        
        <div className="flex flex-col items-center z-10">
          {/* Second dot (Settings - completed) */}
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <CheckIcon className="h-4 w-4 text-white" />
          </div>
          <span className="mt-2 text-sm text-center">Settings</span>
        </div>
        
        <div className="flex flex-col items-center z-10">
          {/* Third dot (Confirm - current) */}
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center relative">
            <span className="text-white text-sm font-medium">3</span>
          </div>
          <span className="mt-2 text-sm text-center">Confirm</span>
        </div>
      </div>
    </div>
  );
}

// Make this component dynamic again with the ability to handle any number of steps
export function StudyGuideProgressDynamic({
  steps,
  currentStep
}: StudyGuideProgressProps) {
  return (
    <div className="w-full">
      {/* Mobile progress (visible on small screens) */}
      <div className="sm:hidden mb-4">
        <p className="text-sm font-medium text-slate-600 mb-1">
          Step {currentStep + 1} of {steps.length}: <span className="text-primary">{steps[currentStep]}</span>
        </p>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop progress (visible on medium screens and up) */}
      <div className="hidden sm:block w-full">
        <div className="flex items-center justify-between relative">
          {/* Background connector lines */}
          <div className="absolute h-0.5 bg-slate-200 left-[20px] right-[20px] top-1/2 -translate-y-1/2"></div>
          
          {/* Progress connector lines */}
          {currentStep > 0 && (
            <div 
              className="absolute h-0.5 bg-black left-[20px] top-1/2 -translate-y-1/2 transition-all duration-300"
              style={{ 
                width: `calc(${(currentStep / (steps.length - 1)) * 100}% - ${currentStep < steps.length - 1 ? '20px' : '0px'})` 
              }}
            ></div>
          )}
          
          {/* Step indicators */}
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step} className="flex flex-col items-center z-10">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isCompleted || isCurrent ? "bg-black" : "bg-white border border-slate-300"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-4 w-4 text-white" />
                  ) : (
                    <span className={cn("text-sm", isCurrent ? "text-white" : "text-slate-500")}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className={cn("mt-2 text-sm text-center", isCurrent ? "text-slate-800 font-medium" : "text-slate-600")}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudyGuideProgress;