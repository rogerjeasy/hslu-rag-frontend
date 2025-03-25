import React from 'react';

interface LoadingIndicatorProps {
  streamingText?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ streamingText }) => {
  // If we have streaming text, show it instead of the loading dots
  if (streamingText) {
    return (
      <div className="animate-fade-in">
        {streamingText}
      </div>
    );
  }
  
  // Otherwise show animated typing indicator
  return (
    <div className="flex items-center space-x-1 py-2 px-1">
      <div className="animate-bounce w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full" style={{ animationDelay: '0ms' }} />
      <div className="animate-bounce w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full" style={{ animationDelay: '150ms' }} />
      <div className="animate-bounce w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

export default LoadingIndicator;