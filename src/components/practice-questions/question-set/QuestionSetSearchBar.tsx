"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search } from 'lucide-react';

interface QuestionSetSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const QuestionSetSearchBar: React.FC<QuestionSetSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  isRefreshing = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search practice questions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search practice questions"
        />
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label="Refresh question sets"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span className="sr-only">Refresh</span>
      </Button>
    </div>
  );
};

export default QuestionSetSearchBar;