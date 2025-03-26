"use client";

import Image from "next/image";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export function StepCard({ number, title, description, imageSrc, imageAlt }: StepCardProps) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 rounded-full bg-amber-100 border border-amber-200 text-amber-800 h-8 w-8 flex items-center justify-center">
        {number}
      </div>
      <div className="border rounded-xl p-6 pt-8 mt-4 h-full bg-card">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">
          {description}
        </p>
        <div className="mt-4">
          <Image 
            src={imageSrc}
            alt={imageAlt}
            width={500}
            height={300}
            className="rounded-lg object-cover h-32 w-full"
          />
        </div>
      </div>
    </div>
  );
}