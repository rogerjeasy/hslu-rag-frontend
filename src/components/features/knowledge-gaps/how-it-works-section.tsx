"use client";

import { SectionHeader } from "./section-header";
import { StepCard } from "./step-card";

const steps = [
  {
    number: 1,
    title: "Data Collection",
    description: "The system collects data from your interactions with practice questions, quiz results, study sessions, and content engagement.",
    imageSrc: "https://images.unsplash.com/photo-1599658880436-c61792e70672?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    imageAlt: "Data collection"
  },
  {
    number: 2,
    title: "AI Analysis",
    description: "Our AI algorithms analyze your performance data to identify patterns, strengths, weaknesses, and knowledge gaps in your understanding.",
    imageSrc: "https://images.unsplash.com/photo-1609921141835-710b7fa6e438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    imageAlt: "AI analysis"
  },
  {
    number: 3,
    title: "Personalized Insights",
    description: "Based on the analysis, you receive personalized recommendations, study plans, and targeted content to address your specific needs.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    imageAlt: "Personalized insights"
  }
];

export function HowItWorksSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title="How Knowledge Analytics Works"
        description="Our sophisticated system analyzes your learning data to provide actionable insights."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <StepCard
            key={step.number}
            number={step.number}
            title={step.title}
            description={step.description}
            imageSrc={step.imageSrc}
            imageAlt={step.imageAlt}
          />
        ))}
      </div>
    </section>
  );
}