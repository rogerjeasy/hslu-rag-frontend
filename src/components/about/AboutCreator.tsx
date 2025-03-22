"use client";

import { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { LinkedinIcon, MailIcon } from 'lucide-react';
import GitHubIcon from '@/components/icons/GitHubIcon';
import Link from 'next/link';

const AboutCreator: FC = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-slate-950">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Profile Image */}
          <div className="lg:w-5/12 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 overflow-hidden rounded-full border-4 border-blue-100 dark:border-blue-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800">
              <Image
                src="/assets/roger_pic.png"
                alt="Roger Jeasy Bavibidila"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
                priority
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="lg:w-7/12 space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Meet the Creator</h2>
              <h3 className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Roger Jeasy Bavibidila</h3>
              <div className="inline-flex items-center justify-center lg:justify-start px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Full Stack Developer • AI Specialist
                </span>
              </div>
            </div>
            
            {/* Bio */}
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                I am a passionate full stack developer with expertise in building modern AI-powered applications. 
                My work focuses on creating innovative solutions that leverage the latest advancements in 
                artificial intelligence and machine learning.
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                With a background in mathematical sciences and a deep interest in AI, I combine technical knowledge with practical engineering skills to build tools that solve 
                real-world problems through intelligent automation and data-driven insights.
              </p>
            </div>
            
            {/* Contact Links */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="https://linkedin.com/in/roger-jeasy-bavibidila-757270197" target="_blank" rel="noopener noreferrer">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
                  <CardContent className="flex items-center gap-3 p-4">
                    <LinkedinIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">LinkedIn Profile</span>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="https://github.com/rogerjeasy" target="_blank" rel="noopener noreferrer">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
                  <CardContent className="flex items-center gap-3 p-4">
                    <GitHubIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">GitHub Profile</span>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="mailto:rogerjeasy@gmail.com">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
                  <CardContent className="flex items-center gap-3 p-4">
                    <MailIcon className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">rogerjeasy@gmail.com</span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCreator;