// src/components/about/AboutFAQ.tsx
"use client";
import { FC } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

const AboutFAQ: FC = () => {
  const faqs: FAQItem[] = [
    {
      question: "Who can use this application?",
      answer: "This application is designed specifically for MSc students in Applied Information and Data Science at Lucerne University of Applied Sciences and Arts (HSLU). Students will need to authenticate with their university credentials to access the full functionality."
    },
    {
      question: "How accurate are the answers provided?",
      answer: "The system's responses are generated based on your actual course materials, including lecture slides, notes, and lab exercises. All information is sourced directly from these materials, with citations provided so you can verify the source. The AI has been trained to acknowledge when it doesn't have sufficient information rather than providing speculative answers."
    },
    {
      question: "How is my data handled and protected?",
      answer: "We take data privacy seriously. Your questions, usage patterns, and personal information are stored securely and not shared with third parties. The system uses this data only to improve your learning experience and provide personalized recommendations. All data processing complies with relevant privacy regulations."
    },
    {
      question: "Which courses are currently supported?",
      answer: "The system currently supports core modules in the MSc Applied Information and Data Science program, including Machine Learning, Statistics, Big Data, Data Visualization, and more. We're continually expanding our coverage to include all courses in the program."
    },
    {
      question: "Can I use this on my mobile device?",
      answer: "Yes, the application is fully responsive and works on desktops, tablets, and mobile phones, allowing you to study wherever you are. The interface adapts to your screen size to provide the optimal learning experience."
    },
    {
      question: "How often is the content updated?",
      answer: "The system's knowledge base is updated regularly to reflect the most current course materials and curriculum changes. Major updates typically align with semester schedules, with minor updates implemented as needed throughout the academic year."
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-700 dark:text-slate-400 md:text-lg">
              Find answers to common questions about our platform, features, and access.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 dark:text-slate-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default AboutFAQ;