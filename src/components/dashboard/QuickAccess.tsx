"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Feature {
  title: string;
  href: string;
  description: string;
  icon: string;
  highlight?: boolean;
}

export default function QuickAccess() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // For enhanced entrance animations
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set isLoaded to true after component mounts for entrance animations
  useEffect(() => {
    setIsLoaded(true);
    console.log(hoveredIndex);
  }, []);

  const features: Feature[] = [
    {
      title: "AI Study Assistant",
      href: "/chat",
      description: "Get instant, accurate answers to your questions based on official HSLU course materials.",
      icon: "💬",
      highlight: true,
    },
    {
      title: "Study Guide Generator",
      href: "/study-guides",
      description: "Create personalized exam preparation summaries and structured study plans.",
      icon: "📚",
    },
    {
      title: "Practice Assessment",
      href: "/practice-questions",
      description: "Test your knowledge with course-specific practice questions and detailed explanations.",
      icon: "✓",
    },
    {
      title: "Knowledge Analytics",
      href: "/knowledge-gaps",
      description: "Identify your knowledge gaps with AI-powered learning analytics and targeted recommendations.",
      icon: "📊",
    },
    {
      title: "Concept Explorer",
      href: "/materials",
      description: "Master complex data science concepts through interactive explanations and practical examples.",
      icon: "🧠",
    },
    {
      title: "Collaborative Learning",
      href: "/groups",
      description: "Form study groups, share resources, and learn collaboratively with your classmates.",
      icon: "👥",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.5
      }
    }
  };

  return (
    <section className="w-full py-6">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quick
            </span> Access
          </h2>
          <p className="text-muted-foreground">
            Accelerate your learning with these AI-powered study resources
          </p>
        </div>

        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {isLoaded && features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Link href={feature.href} className="block h-full">
                  <Card 
                    className={cn(
                      "h-full overflow-hidden group relative",
                      feature.highlight ? "border-blue-500 border-2" : ""
                    )}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
                    
                    <CardContent className="p-6 relative z-10 transition-all duration-300 ease-in-out group-hover:translate-y-[-3px]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl transform transition-transform duration-300 ease-in-out group-hover:scale-110">{feature.icon}</div>
                        {feature.highlight && (
                          <Badge className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mb-2 text-xl font-bold transition-colors duration-300 ease-in-out group-hover:text-blue-600">{feature.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-3 transition-colors duration-300 ease-in-out group-hover:text-gray-800">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}