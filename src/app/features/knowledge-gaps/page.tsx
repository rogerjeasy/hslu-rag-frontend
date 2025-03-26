import { Metadata } from "next";
import KnowledgeGapsPage from "@/components/features/KnowledgeGapsPage";

export const metadata: Metadata = {
    title: "Knowledge Analytics - HSLU Data Science Study Assistant",
    description: "Identify your knowledge gaps with AI-powered learning analytics and targeted recommendations.",
  };

export default function KnowledgeGapsComponentPage() {
    return (
        <main className="min-h-screen">
            <KnowledgeGapsPage />
        </main>
    );
}