"use client";

interface FaqCardProps {
    question: string;
    answer: string;
  }
  
  export function FaqCard({ question, answer }: FaqCardProps) {
    return (
      <div className="bg-background rounded-xl p-6 shadow-sm border">
        <h3 className="font-semibold text-lg mb-2">{question}</h3>
        <p className="text-muted-foreground">
          {answer}
        </p>
      </div>
    );
  }
  