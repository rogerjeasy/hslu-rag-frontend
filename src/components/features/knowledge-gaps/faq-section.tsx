"use client";

import { SectionHeader } from "./section-header";
import { FaqCard } from "./faq-card";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section className="space-y-8">
      <SectionHeader
        title="Frequently Asked Questions"
        description="Common questions about our Knowledge Analytics features."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {faqs.map((faq, index) => (
          <FaqCard 
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </section>
  );
}