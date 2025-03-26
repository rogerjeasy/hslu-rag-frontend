"use client";

import { 
  Target, 
  TrendingUp,
  Lightbulb,
  Layers,
  Binary,
  PieChart
} from "lucide-react";

import { HeroSection } from "./knowledge-gaps/hero-section";
import { SectionHeader } from "./knowledge-gaps/section-header";
import { DashboardDemo } from "./knowledge-gaps/dashboard-demo";
import { FeatureCardsSection } from "./knowledge-gaps/feature-cards-section";
import { HowItWorksSection } from "./knowledge-gaps/how-it-works-section";
import { AnalyticsViewsSection } from "./knowledge-gaps/analytics-views-section";
import { SuccessStoriesSection } from "./knowledge-gaps/success-stories-section";
import { FaqSection } from "./knowledge-gaps/faq-section";
import { CtaSection } from "./knowledge-gaps/cta-section";

// Feature data that can be reused in multiple places
const featuresData = [
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your learning progress over time with detailed metrics and visualization of your improvement.",
    iconColor: "text-amber-600",
    iconBgColor: "bg-amber-100"
  },
  {
    icon: Target,
    title: "Knowledge Gap Detection",
    description: "Identify specific areas where your understanding is incomplete or needs reinforcement.",
    iconColor: "text-red-600",
    iconBgColor: "bg-red-100"
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "Receive AI-powered study recommendations tailored to your learning needs and goals.",
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100"
  },
  {
    icon: PieChart,
    title: "Topic Mastery Analysis",
    description: "Visualize your proficiency across different topics and subjects in your data science courses.",
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-100"
  },
  {
    icon: Layers,
    title: "Concept Connection Mapping",
    description: "See how concepts connect across courses and identify foundational knowledge gaps.",
    iconColor: "text-emerald-600",
    iconBgColor: "bg-emerald-100"
  },
  {
    icon: Binary,
    title: "Learning Pattern Insights",
    description: "Understand your study habits, optimal learning times, and effectiveness of different study methods.",
    iconColor: "text-indigo-600",
    iconBgColor: "bg-indigo-100"
  }
];

// FAQs data
const faqsData = [
  {
    question: "How is my knowledge gap determined?",
    answer: "We analyze your performance across practice questions, quizzes, and interactions with course content. Our AI system identifies patterns in your answers to detect specific concepts you may be struggling with."
  },
  {
    question: "How often is my data updated?",
    answer: "Your analytics are updated in real-time as you complete quizzes and interact with the platform. Comprehensive reports and recommendations are regenerated daily to reflect your latest progress."
  },
  {
    question: "Are my analytics private?",
    answer: "Yes, your learning analytics are completely private to you. We never share individual student data with other students or faculty without your explicit permission."
  },
  {
    question: "Can I download my analytics data?",
    answer: "Yes, you can export your analytics data in various formats (CSV, PDF, etc.) for your personal records or to share with your academic advisor if you choose."
  }
];

export default function KnowledgeGapsPage() {
  return (
    <div className="container py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero section */}
      <HeroSection />

      {/* Dashboard Demo */}
      <section className="space-y-8">
        <SectionHeader
          title="Powerful Analytics Dashboard"
          description="Get a comprehensive view of your learning progress and knowledge gaps."
        />
        
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
          <DashboardDemo />
        </div>
      </section>

      {/* Feature Cards */}
      <FeatureCardsSection 
        title="Personalized Analytics Features"
        description="Discover how our analytics tools can optimize your learning journey."
        features={featuresData}
      />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Analytics Views */}
      <AnalyticsViewsSection />

      {/* Success Cases */}
      <SuccessStoriesSection />

      {/* FAQs */}
      <FaqSection faqs={faqsData} />

      {/* CTA Section */}
      <CtaSection />
    </div>
  );
}