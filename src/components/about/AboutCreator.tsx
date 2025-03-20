// src/components/about/AboutCreator.tsx
"use client";

import { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { LinkedinIcon, MailIcon } from 'lucide-react';
import GitHubIcon from '@/components/icons/GitHubIcon';
import Link from 'next/link';

const AboutCreator: FC = () => {
  return (
    <section className="w-full py-12 md:py-16 bg-white dark:bg-slate-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden rounded-full border-4 border-blue-100 dark:border-blue-900 shadow-xl">
              <Image
                src="/assets/roger_pic.png"
                alt="Roger Jeasy Bavibidila"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 256px, 320px"
                priority
              />
            </div>
          </div>
          
          <div className="md:w-1/2 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Meet the Creator</h2>
              <h3 className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400">Roger Jeasy Bavibidila</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Applied Information and Data Science</p>
            </div>
            
            <p className="text-slate-700 dark:text-slate-300">
              {/* As a student at Lucerne University of Applied Sciences and Arts pursuing my MSc in Applied Information and Data Science, 
              I developed this application to address the challenges faced by fellow students preparing for exams. 
              With my background in mathematical sciences and experience as a Research Assistant at the University of Zurich, 
              I've combined academic knowledge with practical engineering skills to create this educational assistant. */}
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Card className="inline-flex bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardContent className="flex items-center gap-2 p-3">
                  <LinkedinIcon className="h-4 w-4 text-blue-600" />
                  <Link href="https://linkedin.com/in/roger-jeasy-bavibidila-757270197" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                    rogerjeasy
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="inline-flex bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardContent className="flex items-center gap-2 p-3">
                  <GitHubIcon className="h-4 w-4" />
                  <Link href="https://github.com/rogerjeasy" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                    GitHub
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="inline-flex bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardContent className="flex items-center gap-2 p-3">
                  <MailIcon className="h-4 w-4 text-red-500" />
                  <Link href="mailto:rogerjeasy@gmail.com" className="text-sm font-medium hover:underline">
                    rogerjeasy@gmail.com
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCreator;