"use client";

import Image from "next/image";
import { features } from "@/types/features";
import { FeatureCard } from "@/components/ui/feature-card";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  return (
    <div className="container py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]" />
          
        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-6 py-12 md:px-10 md:py-16">
          <div className="space-y-5">
            <div className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-700 dark:text-blue-300">
              HSLU Data Science Study Assistant
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Your ultimate exam preparation companion
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Leverage AI-powered tools specifically designed for HSLU Applied Information and 
              Data Science students to boost your learning experience and ace your exams.
            </p>
            <div className="flex flex-wrap gap-4 pt-3">
              <Button size="lg">Get Started</Button>
              <Button size="lg" variant="outline">Watch Demo</Button>
            </div>
          </div>
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000"
              alt="HSLU students collaborating"
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need to succeed</h2>
          <p className="text-muted-foreground text-lg">
            Our comprehensive set of tools is designed to support every aspect of your 
            data science study journey at HSLU.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.href} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="rounded-3xl bg-muted/50 p-8 md:p-10 lg:p-12 space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Trusted by HSLU students</h2>
          <p className="text-muted-foreground text-lg">
            See what your fellow students have to say about our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="bg-background rounded-xl p-6 shadow-sm border"
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`}
                  alt={`Student ${i}`}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">Student Name</p>
                  <p className="text-sm text-muted-foreground">MSc Data Science</p>
                </div>
              </div>
              <p className="text-muted-foreground">
              &quot;This platform has completely transformed my study routine. 
                The AI-powered tools helped me identify my knowledge gaps and prepare more efficiently.&quot;
              </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto py-8">
        <h2 className="text-3xl font-bold tracking-tight">Ready to boost your learning?</h2>
        <p className="text-muted-foreground text-lg">
          Join hundreds of HSLU students already using our platform to improve their grades and 
          study more efficiently.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button size="lg">Sign Up for Free</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </section>
    </div>
  );
}