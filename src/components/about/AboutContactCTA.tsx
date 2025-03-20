// src/components/about/AboutContactCTA.tsx
"use client";

import { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

const AboutContactCTA: FC = () => {
  return (
    <section className="w-full py-12 md:py-16 bg-blue-600 dark:bg-blue-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-white">Ready to Elevate Your HSLU Studies?</h2>
            <p className="text-blue-100 dark:text-blue-200">
              Join students across HSLU who are enhancing their learning experience with our AI-powered study assistant.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="secondary" className="gap-2">
              <Link href="/contact">
                <Mail className="h-4 w-4" />
                <span>Contact Us</span>
              </Link>
            </Button>
            
            <Button asChild className="gap-2 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:bg-blue-200 dark:text-blue-900 dark:hover:bg-blue-100">
              <Link href="/register">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContactCTA;