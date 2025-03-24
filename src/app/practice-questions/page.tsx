"use client";

import { Suspense } from "react";
import PracticeQuestionsPage from "@/components/practice-questions/PracticeQuestionsPage";

// Loading component to display while content is loading
function Loading() {
  return (
    <div className="w-full h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Loading practice questions...</p>
      </div>
    </div>
  );
}

export default function PracticeQuestionsPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <PracticeQuestionsPage />
    </Suspense>
  );
}