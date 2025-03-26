"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  title,
  description,
  align = "center",
  className,
  titleClassName,
  descriptionClassName
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "space-y-4",
      align === "center" && "text-center mx-auto",
      align === "right" && "text-right ml-auto",
      align === "center" ? "max-w-3xl" : "",
      className
    )}>
      <h2 className={cn("text-3xl font-bold tracking-tight", titleClassName)}>
        {title}
      </h2>
      {description && (
        <p className={cn("text-muted-foreground text-lg", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
}