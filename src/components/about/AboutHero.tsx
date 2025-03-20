// src/components/about/AboutHero.tsx
"use client";

import { FC } from 'react';
import { Badge } from '@/components/ui/badge';

const AboutHero: FC = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-b border-slate-200 dark:border-slate-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Badge variant="outline" className="px-3 py-1 text-sm border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            HSLU Data Science
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Empowering Data Science Students
          </h1>
          <p className="max-w-[42rem] text-slate-700 dark:text-slate-300 text-xl md:text-2xl">
            An intelligent exam preparation assistant built specifically for HSLU MSc students in Applied Information and Data Science.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Course-Specific AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Practice Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Concept Clarification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Knowledge Gaps</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;