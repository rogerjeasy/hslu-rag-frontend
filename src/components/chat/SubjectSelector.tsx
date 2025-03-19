"use client";

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SubjectSelectorProps } from '@/types/chat';

export default function SubjectSelector({ 
  selectedSubject, 
  onSubjectChange, 
  subjects 
}: SubjectSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between font-normal"
        >
          {selectedSubject ? (
            <span className="flex items-center gap-2">
              {selectedSubject.icon && (
                <span className="text-base">{selectedSubject.icon}</span>
              )}
              {selectedSubject.name}
            </span>
          ) : (
            "Select subject..."
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <div className="max-h-[300px] overflow-y-auto py-1">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-muted",
                selectedSubject?.id === subject.id && "bg-muted"
              )}
              onClick={() => {
                onSubjectChange(subject);
                setOpen(false);
              }}
            >
              {subject.icon && (
                <span className="text-base">{subject.icon}</span>
              )}
              <span className="flex-1">{subject.name}</span>
              {selectedSubject?.id === subject.id && (
                <Check className="h-4 w-4" />
              )}
            </div>
          ))}
          
          {subjects.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No subjects available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}