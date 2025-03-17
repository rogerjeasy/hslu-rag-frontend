"use client";

import { useEffect, useState } from 'react';

interface LoadingIndicatorProps {
  messages?: string[];
  speed?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'dots' | 'spinner' | 'both';
  showMessage?: boolean;
  className?: string;
}

export default function LoadingIndicator({
  messages = [
    "Thinking...",
    "Searching my knowledge...",
    "Analyzing information...",
    "Formulating response...",
  ],
  speed = 3000,
  size = 'medium',
  variant = 'both',
  showMessage = true,
  className = ''
}: LoadingIndicatorProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState('');

  // Rotate through the thinking messages
  useEffect(() => {
    if (!showMessage) return;

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, speed);
    
    return () => clearInterval(messageInterval);
  }, [messages, speed, showMessage]);

  // Animate the dots
  useEffect(() => {
    if (!showMessage) return;

    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(dotsInterval);
  }, [showMessage]);

  // Size classes for dots
  const dotSizes = {
    small: 'w-1.5 h-1.5',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  };

  // Size classes for spinner
  const spinnerSizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-3'
  };

  // Text sizes
  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`flex items-center ${showMessage ? 'space-x-3' : ''} ${className}`}>
      {/* Bouncing dots animation */}
      {(variant === 'dots' || variant === 'both') && (
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${dotSizes[size]} bg-primary/70 rounded-full animate-bounce`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}

      {/* Spinner animation */}
      {(variant === 'spinner' || variant === 'both') && (
        <div 
          className={`${spinnerSizes[size]} rounded-full border-primary/30 border-t-primary animate-spin ${variant === 'both' ? 'ml-2' : ''}`}
        />
      )}
     
      {/* Message with animated dots */}
      {showMessage && (
        <div className={`${textSizes[size]} text-muted-foreground`}>
          {messages[currentMessage]}{dots}
        </div>
      )}
    </div>
  );
}