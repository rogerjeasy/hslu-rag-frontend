"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AnalyticsTabContentProps {
  title: string;
  description: string;
  points: string[];
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

export function AnalyticsTabContent({
  title,
  description,
  points,
  buttonText,
  imageSrc,
  imageAlt
}: AnalyticsTabContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">
          {description}
        </p>
        <ul className="space-y-2">
          {points.map((point, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 h-5 w-5 text-amber-500 mt-0.5">•</div>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <Button className="bg-amber-600 hover:bg-amber-700">
          {buttonText}
        </Button>
      </div>
      <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden">
        <Image 
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}