"use client";

// src/app/features/knowledge-gaps/components/hero-section.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Target } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 py-12 px-6 md:py-16 md:px-10">
      <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]" />
      
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Badge className="px-3 py-1 text-sm bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-amber-900 dark:hover:text-amber-200">
            Knowledge Analytics
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Identify Gaps and Optimize Your Learning
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl">
            Use advanced analytics and AI-powered insights to identify knowledge gaps,
            track your progress, and receive personalized study recommendations.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <BarChart className="mr-2 h-4 w-4" />
              View Your Analytics
            </Button>
            <Button size="lg" variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Take Diagnostic Quiz
            </Button>
          </div>
        </div>
        
        <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
            alt="Data analytics visualization"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}