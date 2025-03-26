"use client";

import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  role: string;
  avatarUrl: string;
  quote: string;
  improvement: {
    percentage: number;
    description: string;
  };
}

export function TestimonialCard({ 
  name, 
  role, 
  avatarUrl, 
  quote, 
  improvement 
}: TestimonialCardProps) {
  return (
    <div className="bg-background rounded-xl p-6 shadow-sm border">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={avatarUrl}
          alt={name}
          width={56}
          height={56}
          className="rounded-full"
        />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="text-muted-foreground">
      &quot;{quote}&quot;
      </p>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-medium">Improvement:</p>
        <div className="mt-2 w-full bg-muted rounded-full h-2.5">
          <div 
            className="bg-amber-500 h-2.5 rounded-full" 
            style={{ width: `${improvement.percentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {improvement.percentage}% {improvement.description}
        </p>
      </div>
    </div>
  );
}