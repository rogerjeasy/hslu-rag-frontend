'use client'

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'simple' | 'pulse' | 'dots' | 'wave' | 'gradient';
  color?: string;
  secondaryColor?: string;
  speed?: 'slow' | 'normal' | 'fast';
  text?: string;
}

export function LoadingSpinner({ 
  className, 
  size = 'lg', 
  variant = 'gradient',
  color,
  secondaryColor,
  speed = 'normal',
  text
}: LoadingSpinnerProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-24 w-24'
  };
  
  const textSizeClasses = {
    sm: 'text-xs mt-1',
    md: 'text-sm mt-2',
    lg: 'text-base mt-3',
    xl: 'text-lg mt-3',
    '2xl': 'text-xl mt-4'
  };
  
  const speedClasses = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  };
  
  // Default colors that work well with dark/light themes
  const defaultColor = 'currentColor';
  const defaultSecondaryColor = color ? `${color}40` : 'currentColor';

  // Add custom animation if not present in global CSS
  if (isClient) {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes spin-slow {
        to { transform: rotate(360deg); }
      }
      @keyframes spin-fast {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.95); }
      }
      @keyframes wave {
        0%, 100% { transform: translateY(0); }
        25% { transform: translateY(-5px); }
        75% { transform: translateY(5px); }
      }
      @keyframes dots-pulse {
        0%, 100% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 1; }
      }
      .animate-spin-slow {
        animation: spin-slow 3s linear infinite;
      }
      .animate-spin-fast {
        animation: spin-fast 0.7s linear infinite;
      }
      .animate-pulse-custom {
        animation: pulse 2s ease-in-out infinite;
      }
      .animate-wave {
        animation: wave 1.5s ease-in-out infinite;
      }
      .animate-dots-pulse {
        animation: dots-pulse 1.5s ease-in-out infinite;
      }
    `;
    
    // Only add the style if it doesn't exist yet
    if (!document.querySelector('style#loading-spinner-styles')) {
      styleElement.id = 'loading-spinner-styles';
      document.head.appendChild(styleElement);
    }
  }

  if (variant === 'dots') {
    const dotCount = 3;
    const dotSize = {
      sm: 'h-1.5 w-1.5',
      md: 'h-2 w-2',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
      '2xl': 'h-5 w-5'
    };
    
    const containerSizeClasses = {
      sm: 'h-5 gap-1',
      md: 'h-8 gap-1.5',
      lg: 'h-12 gap-2',
      xl: 'h-16 gap-3',
      '2xl': 'h-24 gap-4'
    };

    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <div className={cn(`flex items-center justify-center ${containerSizeClasses[size]}`)}>
          {[...Array(dotCount)].map((_, index) => (
            <div 
              key={index}
              className={cn(
                `rounded-full ${dotSize[size]} animate-dots-pulse`,
                color ? color : 'bg-primary'
              )}
              style={{ 
                animationDelay: `${index * 0.2}s`,
                backgroundColor: color
              }}
            />
          ))}
        </div>
        {text && <p className={cn(`text-center ${textSizeClasses[size]}`, 'text-muted-foreground')}>{text}</p>}
      </div>
    );
  }

  if (variant === 'wave') {
    const barCount = 5;
    const barSize = {
      sm: 'w-1 h-5',
      md: 'w-1.5 h-8',
      lg: 'w-2 h-12',
      xl: 'w-2.5 h-16',
      '2xl': 'w-3 h-24'
    };
    
    const containerSizeClasses = {
      sm: 'gap-0.5',
      md: 'gap-1',
      lg: 'gap-1.5',
      xl: 'gap-2',
      '2xl': 'gap-3'
    };

    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <div className={cn(`flex items-center justify-center ${containerSizeClasses[size]}`)}>
          {[...Array(barCount)].map((_, index) => (
            <div 
              key={index}
              className={cn(
                `rounded-full ${barSize[size]} animate-wave`,
                color ? color : 'bg-primary'
              )}
              style={{ 
                animationDelay: `${index * 0.15}s`,
                backgroundColor: color
              }}
            />
          ))}
        </div>
        {text && <p className={cn(`text-center ${textSizeClasses[size]}`, 'text-muted-foreground')}>{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <div className={cn(`animate-pulse-custom`, className)}>
          <svg
            className={cn(sizeClasses[size])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={secondaryColor || defaultSecondaryColor}
              strokeWidth="4"
              className="opacity-40"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={color || defaultColor}
              strokeWidth="4"
              strokeDasharray="60 30"
              className="opacity-90"
            />
          </svg>
        </div>
        {text && <p className={cn(`text-center ${textSizeClasses[size]}`, 'text-muted-foreground')}>{text}</p>}
      </div>
    );
  }

  // Gradient or simple spinner
  const isGradient = variant === 'gradient';

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <svg
        className={cn(sizeClasses[size], speedClasses[speed])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {isGradient && (
          <defs>
            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color || 'currentColor'} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color || 'currentColor'} stopOpacity="1" />
            </linearGradient>
          </defs>
        )}
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={secondaryColor || defaultSecondaryColor}
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill={isGradient ? "none" : (color || defaultColor)}
          stroke={isGradient ? "url(#spinner-gradient)" : "none"}
          strokeWidth={isGradient ? "4" : "0"}
          strokeLinecap="round"
          d={isGradient 
            ? "M 12 2 A 10 10 0 0 1 20 7" 
            : "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          }
        />
      </svg>
      {text && <p className={cn(`text-center ${textSizeClasses[size]}`, 'text-muted-foreground')}>{text}</p>}
    </div>
  );
}