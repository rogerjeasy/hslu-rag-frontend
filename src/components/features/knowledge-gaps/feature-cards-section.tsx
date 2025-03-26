"use client";

import { LucideIcon } from "lucide-react";
import { SectionHeader } from "./section-header";
import { FeatureCard } from "@/components/features/practice-question/feature-card";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBgColor?: string;
}

interface FeatureCardsSectionProps {
  title: string;
  description?: string;
  features: FeatureItem[];
  columns?: number;
}

export function FeatureCardsSection({
  title,
  description,
  features,
  columns = 3
}: FeatureCardsSectionProps) {
  return (
    <section className="space-y-10">
      <SectionHeader
        title={title}
        description={description}
      />
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}>
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            iconColor={feature.iconColor}
            iconBgColor={feature.iconBgColor}
          />
        ))}
      </div>
    </section>
  );
}