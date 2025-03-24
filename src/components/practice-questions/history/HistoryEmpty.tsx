"use client";

import React from 'react';
import { History, FileQuestion, Search, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HistoryEmptyProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  emptyMessage?: string;
}

export function HistoryEmpty({ 
  hasFilters, 
  onClearFilters,
  emptyMessage = "No practice history found."
}: HistoryEmptyProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-16 h-16 mb-6 rounded-full bg-muted flex items-center justify-center">
        {hasFilters ? (
          <Search className="h-8 w-8 text-muted-foreground" />
        ) : (
          <History className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        {hasFilters ? "No matching results" : "No Practice History"}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6 px-4">
        {hasFilters 
          ? "No practice questions match your current filters. Try adjusting your search criteria or clear all filters."
          : emptyMessage
        }
      </p>
      
      {hasFilters ? (
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="flex items-center gap-2 transition-all"
        >
          <FilterX className="h-4 w-4" />
          Clear All Filters
        </Button>
      ) : (
        <Button asChild>
          <Link href="/practice-questions/create" className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            Create Practice Questions
          </Link>
        </Button>
      )}
    </motion.div>
  );
}