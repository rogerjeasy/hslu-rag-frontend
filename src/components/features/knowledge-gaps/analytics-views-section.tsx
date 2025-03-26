"use client";

import { SectionHeader } from "./section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsTabContent } from "./analytics-tab-content";

const tabsData = [
  {
    id: "overview",
    label: "Overview Dashboard",
    title: "Comprehensive Overview",
    description: "The main dashboard gives you a high-level view of your overall progress, highlighting key metrics and recent achievements.",
    points: [
      "At-a-glance summary of your learning progress",
      "Key performance indicators across all courses",
      "Recommended actions based on your current status"
    ],
    buttonText: "View Your Dashboard",
    imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1426&q=80",
    imageAlt: "Overview dashboard"
  },
  {
    id: "topic",
    label: "Topic Analysis",
    title: "Topic-Level Analysis",
    description: "Dive deep into specific topics to understand your proficiency levels and identify areas that need more attention.",
    points: [
      "Detailed breakdown of topics within each course",
      "Visualization of strengths and weaknesses",
      "Suggested resources for improving specific topics"
    ],
    buttonText: "Explore Topic Analysis",
    imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    imageAlt: "Topic analysis"
  },
  {
    id: "trends",
    label: "Progress Trends",
    title: "Progress Over Time",
    description: "Track how your knowledge and skills are evolving over time with historical data analysis and trend visualization.",
    points: [
      "Historical performance data across weeks and months",
      "Improvement trends in different subject areas",
      "Predictive insights based on your learning patterns"
    ],
    buttonText: "View Your Progress Trends",
    imageSrc: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    imageAlt: "Progress trends"
  }
];

export function AnalyticsViewsSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title="Comprehensive Analytics Views"
        description="Explore different perspectives on your learning data."
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          {tabsData.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
        
        {tabsData.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="p-6 border rounded-xl mt-6 bg-card">
            <AnalyticsTabContent
              title={tab.title}
              description={tab.description}
              points={tab.points}
              buttonText={tab.buttonText}
              imageSrc={tab.imageSrc}
              imageAlt={tab.imageAlt}
            />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}