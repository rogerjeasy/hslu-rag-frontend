// src/components/dashboard/QuickAccess.tsx
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { FileText, Clock, GraduationCap, Search } from 'lucide-react';

export default function QuickAccess() {
  const quickLinks = [
    { 
      icon: <FileText className="h-5 w-5" />, 
      title: "Study Guides", 
      description: "Access premade study materials" 
    },
    { 
      icon: <Search className="h-5 w-5" />, 
      title: "Knowledge Base", 
      description: "Search for specific topics" 
    },
    { 
      icon: <Clock className="h-5 w-5" />, 
      title: "Recent Materials", 
      description: "Continue where you left off" 
    },
    { 
      icon: <GraduationCap className="h-5 w-5" />, 
      title: "Exam Prep", 
      description: "Get ready for upcoming tests" 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                {link.icon}
              </div>
              <div>
                <CardTitle className="text-base">{link.title}</CardTitle>
                <CardDescription className="text-xs">{link.description}</CardDescription>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}