import { Metadata } from "next";
import AIChatAssistantPage from "@/components/features/AIChatAssistantPage";

export const metadata: Metadata = {
    title: "AI Study Assistant - HSLU Data Science Study Assistant",
    description: "Get instant, accurate answers to your questions based on official HSLU course materials.",
  };

export default function AIChatAssistant() {
    return (
        <main className="min-h-screen">
            <AIChatAssistantPage />
        </main>
    );
}