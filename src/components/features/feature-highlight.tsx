"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeatureHighlightProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureHighlight({ 
  icon, 
  title, 
  description, 
  className 
}: FeatureHighlightProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "p-6 rounded-xl border bg-background shadow-sm",
        className
      )}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}