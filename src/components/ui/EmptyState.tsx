"use client";

import { BrainCircuit, MessagesSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyStateProps, Subject } from '@/types/chat';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function EmptyState({ 
  subject, 
  onStartConversation,
  isMobile = false
}: EmptyStateProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample prompts based on the selected subject
  const getSubjectPrompts = (subject: Subject | null): string[] => {
    if (!subject) return defaultPrompts;
    const promptsBySubject: Record<string, string[]> = {
      'Mathematics': [
        'Explain the concept of integrals in calculus.',
        'Help me understand the Pythagorean theorem.',
        'What are eigenvalues and eigenvectors?',
        'Explain statistical significance in simple terms.',
        'How do I solve systems of linear equations?'
      ],
      'Computer Science': [
        'Explain how recursion works with an example.',
        'What is the difference between O(n) and O(log n) time complexity?',
        'How does a hash table work?',
        'Explain the concept of inheritance in OOP.',
        'What are promises in JavaScript?'
      ],
      'Physics': [
        'Explain Newton\'s laws of motion.',
        'How does quantum entanglement work?',
        'What is the theory of relativity in simple terms?',
        'Explain the concept of entropy.',
        'How do electromagnetic waves propagate?'
      ],
      'Chemistry': [
        'Explain the periodic table organization.',
        'How do covalent bonds form?',
        'What is the difference between acids and bases?',
        'Explain redox reactions with examples.',
        'How does electronegativity affect molecular properties?'
      ],
      'Biology': [
        'Explain how DNA replication works.',
        'What happens during cellular respiration?',
        'How does natural selection drive evolution?',
        'Explain the process of mitosis.',
        'What is the role of enzymes in biological processes?'
      ]
    };
    return promptsBySubject[subject.name] || defaultPrompts;
  };
  
  const defaultPrompts = [
    'Can you explain this concept to me?',
    'I need help understanding this topic.',
    'What are the key points I should know about this subject?',
    'How do I solve problems related to this topic?',
    'Can you give me a practice question on this topic?'
  ];
  
  const prompts = subject ? getSubjectPrompts(subject) : defaultPrompts;
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center",
      "transition-opacity duration-500 ease-in-out",
      mounted ? "opacity-100" : "opacity-0",
      "overflow-auto"
    )}>
      <div className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6",
        "bg-gradient-to-br from-primary/20 to-primary/5",
        "shadow-sm transition-all duration-500 ease-out",
        "animate-pulse-slow"
      )}>
        <BrainCircuit className={cn(
          "h-6 w-6 sm:h-8 sm:w-8 text-primary",
          "transition-transform duration-700",
          "animate-float"
        )} />
      </div>
     
      <h2 className={cn(
        "text-xl sm:text-2xl font-bold mb-2",
        "transition-all duration-500 ease-out",
        "animate-fadeIn"
      )}>
        {subject 
          ? (
            <span className="flex items-center justify-center gap-2">
              Start studying {subject.name}
              <Sparkles className="h-4 w-4 text-primary/70 animate-twinkle" />
            </span>
          ) 
          : 'Select a subject to begin'
        }
      </h2>
     
      <p className={cn(
        "text-muted-foreground mb-6 sm:mb-8 max-w-md text-sm sm:text-base",
        "transition-all duration-500 ease-out delay-100",
        "animate-fadeIn"
      )}>
        {subject
          ? `Ask questions, get explanations, or practice problems related to ${subject.name}.`
          : 'Choose a subject from the dropdown above to start your study session.'}
      </p>
     
      {subject && (
        <div className={cn(
          "w-full max-w-md transition-all duration-500 ease-out delay-200",
          "animate-fadeIn"
        )}>
          <h3 className="font-medium mb-2 sm:mb-3 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
            <MessagesSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Suggested questions:
          </h3>
         
          <div className="grid gap-2">
            {prompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className={cn(
                  "justify-start text-left h-auto py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm",
                  "transition-all duration-300 hover:shadow-md",
                  "border-primary/10 hover:border-primary/30",
                  "bg-background/80 hover:bg-background backdrop-blur-sm",
                  "group overflow-hidden relative",
                  "animate-slideIn",
                  {"delay-100": index === 0},
                  {"delay-150": index === 1},
                  {"delay-200": index === 2},
                  {"delay-250": index === 3},
                  {"delay-300": index === 4},
                )}
                onClick={() => onStartConversation(prompt)}
                style={{
                  animationDelay: `${300 + (index * 100)}ms`
                }}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}