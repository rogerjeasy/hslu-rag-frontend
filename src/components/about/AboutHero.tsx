"use client";
import { FC } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const AboutHero: FC = () => {
  return (
    <section className="relative w-full overflow-hidden py-8 md:py-12 lg:py-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Data Science Exam Preparation" 
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-900/85 to-slate-900/90 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <Badge variant="outline" className="px-4 py-1.5 text-sm bg-white/10 text-white border-white/20 backdrop-blur-sm">
            HSLU Data Science
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white max-w-4xl">
            Empowering Data Science Students
          </h1>
          
          <p className="max-w-[800px] text-slate-200 text-xl md:text-2xl leading-relaxed">
            An intelligent exam preparation assistant built specifically for HSLU MSc students in Applied Information and Data Science.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-full">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="text-sm font-medium text-white">Course-Specific AI</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-full">
              <div className="h-3 w-3 rounded-full bg-blue-400" />
              <span className="text-sm font-medium text-white">Practice Questions</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-full">
              <div className="h-3 w-3 rounded-full bg-purple-400" />
              <span className="text-sm font-medium text-white">Concept Clarification</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-full">
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="text-sm font-medium text-white">Knowledge Gaps</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="mt-8">
            <button className="px-8 py-3 bg-white text-blue-900 hover:bg-blue-50 transition-colors rounded-full font-medium shadow-lg shadow-blue-900/20">
              Get Started
            </button>
          </div>
          
          {/* Optional geometric decorative element */}
          {/* <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-slate-900/20 backdrop-blur-sm" /> */}
        </div>
      </div>
      
      {/* Optional: Decorative grid overlay for a tech feel */}
      {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIwLjIiPjxwYXRoIGQ9Ik0wIDYwTDYwIDAiLz48cGF0aCBkPSJNMCA0MEw0MCAwIi8+PHBhdGggZD0iTTAgMjBMMjAgMCIvPjxwYXRoIGQ9Ik0yMCA2MEw2MCAyMCIvPjxwYXRoIGQ9Ik00MCA2MEw2MCA0MCIvPjwvZz48L2c+PC9zdmc+')] opacity-20 z-0" /> */}
    </section>
  );
};

export default AboutHero;