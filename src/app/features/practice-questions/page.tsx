import { Metadata } from "next";
import PracticeQuestionsPage from "@/components/features/PracticeQuestionsPage";

export const metadata: Metadata = {
    title: "Practice Questions - HSLU Data Science Study Assistant",
    description: "Test your knowledge with course-specific practice questions and detailed explanations.",
  };

export default function PracticeQuestions() {
    return (
        <main className="min-h-screen">
            <PracticeQuestionsPage />
        </main>
    );
}