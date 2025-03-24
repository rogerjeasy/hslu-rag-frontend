"use client";

import React from 'react';
import { RefreshCw, History, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HistoryHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function HistoryHeader({ onRefresh, isRefreshing }: HistoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <History className="h-6 w-6 text-primary" aria-hidden="true" />
        <h2 className="text-2xl font-bold tracking-tight">Practice History</h2>
      </div>
      
      <div className="flex items-center space-x-3">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onRefresh}
                disabled={isRefreshing}
                className="transition-all hover:bg-primary/10"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh history</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 transition-all hover:bg-primary/10"
              >
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">Bookmarked</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View bookmarked question sets</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}