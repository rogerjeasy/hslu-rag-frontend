// src/components/about/AboutFeatures.tsx
"use client";

import { FC } from 'react';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  AlertCircle, 
  BookMarked 
} from 'lucide-react';

// Create a reusable feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description, accentColor }) => {
  return (
    <div className="flex flex-col p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${accentColor}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
};

const AboutFeatures: FC = () => {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-white" />,
      title: "Course-Specific Question Answering",
      description: "Get instant, accurate answers drawn directly from your course materials, lecture notes, and lab exercises.",
      accentColor: "bg-blue-600 dark:bg-blue-700"
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Exam Preparation Summaries",
      description: "Generate comprehensive study guides and concise summaries organized by topics and importance.",
      accentColor: "bg-emerald-600 dark:bg-emerald-700"
    },
    {
      icon: <BookMarked className="h-6 w-6 text-white" />,
      title: "Practice Question Generation",
      description: "Test your knowledge with automatically generated practice questions based on actual course content.",
      accentColor: "bg-amber-600 dark:bg-amber-700"
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-white" />,
      title: "Concept Clarification",
      description: "Understand complex data science concepts with clear explanations and practical examples from labs.",
      accentColor: "bg-purple-600 dark:bg-purple-700"
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-white" />,
      title: "Knowledge Gap Identification",
      description: "Identify areas needing additional focus and receive targeted recommendations for review.",
      accentColor: "bg-red-600 dark:bg-red-700"
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Key Features</h2>
          <p className="max-w-[85%] text-slate-700 dark:text-slate-400 md:text-xl">
            Our platform uses advanced AI and RAG technology to enhance your learning experience
            and optimize exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accentColor={feature.accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutFeatures;