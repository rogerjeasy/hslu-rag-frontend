import {
    BrainCircuit,
    FileQuestion,
    MessageSquareText,
    Users,
    BarChart,
    BookText,
    LucideIcon,
  } from "lucide-react";
  
  export interface Feature {
    title: string;
    href: string;
    description: string;
    icon: LucideIcon;
    highlight?: boolean;
    color?: string;
    iconBgColor?: string;
  }
  
  export const features: Feature[] = [
    {
      title: "AI Study Assistant",
      href: "/features/ai-chat-assistant",
      description: "Get instant, accurate answers to your questions based on official HSLU course materials.",
      icon: MessageSquareText,
      highlight: true,
      color: "text-blue-600",
      iconBgColor: "bg-blue-100"
    },
    {
      title: "Study Guide Generator",
      href: "/features/study-guides",
      description: "Create personalized exam preparation summaries and structured study plans.",
      icon: BookText,
      color: "text-emerald-600",
      iconBgColor: "bg-emerald-100"
    },
    {
      title: "Practice Assessment",
      href: "/features/practice-questions",
      description: "Test your knowledge with course-specific practice questions and detailed explanations.",
      icon: FileQuestion,
      color: "text-purple-600",
      iconBgColor: "bg-purple-100"
    },
    {
      title: "Knowledge Analytics",
      href: "/features/knowledge-gaps",
      description: "Identify your knowledge gaps with AI-powered learning analytics and targeted recommendations.",
      icon: BarChart,
      color: "text-amber-600",
      iconBgColor: "bg-amber-100"
    },
    {
      title: "Concept Explorer",
      href: "/features/materials",
      description: "Master complex data science concepts through interactive explanations and practical examples.",
      icon: BrainCircuit,
      color: "text-red-600",
      iconBgColor: "bg-red-100"
    },
    {
      title: "Collaborative Learning",
      href: "/features/groups",
      description: "Form study groups, share resources, and learn collaboratively with your classmates.",
      icon: Users,
      color: "text-indigo-600",
      iconBgColor: "bg-indigo-100"
    },
  ];