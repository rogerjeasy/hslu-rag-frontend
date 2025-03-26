"use client";

// src/app/features/knowledge-gaps/components/success-stories-section.tsx
import { SectionHeader } from "./section-header";
import { TestimonialCard } from "./testimonial-card";

const testimonials = [
  {
    name: "Thomas H.",
    role: "MSc Data Science, 3rd Semester",
    avatarUrl: "https://randomuser.me/api/portraits/men/54.jpg",
    quote: "The knowledge gap analysis showed me I was weak in statistical hypothesis testing. After focusing on those areas, I improved my Statistics final exam score from a C to an A-.",
    improvement: {
      percentage: 85,
      description: "increase in statistical proficiency"
    }
  },
  {
    name: "Anna L.",
    role: "MSc Data Science, 2nd Semester",
    avatarUrl: "https://randomuser.me/api/portraits/women/46.jpg",
    quote: "The system identified that I had gaps in understanding the connections between regression models. The targeted recommendations helped me see how concepts build on each other.",
    improvement: {
      percentage: 72,
      description: "better conceptual understanding"
    }
  },
  {
    name: "Michael K.",
    role: "MSc Data Science, 4th Semester",
    avatarUrl: "https://randomuser.me/api/portraits/men/30.jpg",
    quote: "The progress tracking helped me stay consistent with my studying. I could clearly see which days were most productive and adjust my schedule accordingly.",
    improvement: {
      percentage: 65,
      description: "increase in study efficiency"
    }
  }
];

export function SuccessStoriesSection() {
  return (
    <section className="rounded-3xl bg-muted/50 p-8 md:p-10 lg:p-12 space-y-8">
      <SectionHeader
        title="Success Stories"
        description="See how HSLU students have improved their learning outcomes."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={index}
            name={testimonial.name}
            role={testimonial.role}
            avatarUrl={testimonial.avatarUrl}
            quote={testimonial.quote}
            improvement={testimonial.improvement}
          />
        ))}
      </div>
    </section>
  );
}