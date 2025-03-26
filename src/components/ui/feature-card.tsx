// src/components/ui/feature-card.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Feature } from "@/types/features";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const IconComponent = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link href={feature.href} className="h-full block">
        <Card className={cn(
          "h-full overflow-hidden transition-all duration-200 hover:shadow-lg",
          feature.highlight ? "border-blue-500 shadow-md" : "border-border"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className={cn(
                "p-2 rounded-lg",
                feature.iconBgColor || "bg-muted"
              )}>
                <IconComponent 
                  className={cn("w-5 h-5", feature.color || "text-foreground")} 
                />
              </div>
              <motion.div 
                initial={{ x: -5, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
              >
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </div>
            <CardTitle className="text-xl mt-4 tracking-tight">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-muted-foreground">
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}