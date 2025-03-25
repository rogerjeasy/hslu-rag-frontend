"use client";

import React from 'react';
import { MessageCircle, BookOpen, FileQuestion, BrainCircuit } from 'lucide-react';
import { QueryType } from '@/types/query';

interface EmptyStateProps {
  courseId?: string | undefined;  
  onStartConversation: (content: string, queryType?: QueryType) => void | Promise<void>;
}

const EmptyState: React.FC<EmptyStateProps> = ({ courseId, onStartConversation }) => {
  // Example prompts for each query type
  const examplePrompts = {
    [QueryType.QUESTION_ANSWERING]: [
      "What is the difference between supervised and unsupervised learning?",
      "Explain the concept of overfitting in machine learning.",
      "How does backpropagation work in neural networks?",
      "What are the advantages of decision trees over other models?"
    ],
    [QueryType.STUDY_GUIDE]: [
      "Create a study guide for classification algorithms.",
      "Generate a summary of key concepts in data preprocessing.",
      "Make a study outline for understanding deep learning fundamentals.",
      "Prepare a concise review of clustering techniques."
    ],
    [QueryType.PRACTICE_QUESTIONS]: [
      "Generate practice questions about regression analysis.",
      "Create a quiz on feature selection methods.",
      "Make a set of multiple choice questions about ensemble learning.",
      "Provide practice problems on dimensionality reduction."
    ],
    [QueryType.KNOWLEDGE_GAP]: [
      "What topics should I focus on to understand reinforcement learning better?",
      "Identify gaps in my understanding of statistical hypothesis testing.",
      "What concepts am I missing to fully grasp neural networks?",
      "Help me identify weak areas in my understanding of data visualization."
    ]
  };

  // Card data for each query type
  const queryTypeCards = [
    {
      type: QueryType.QUESTION_ANSWERING,
      title: "Ask a Question",
      description: "Get answers to specific questions about course material",
      icon: <MessageCircle className="h-6 w-6" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
      hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/50"
    },
    {
      type: QueryType.STUDY_GUIDE,
      title: "Create Study Guide",
      description: "Generate comprehensive summaries and study materials",
      icon: <BookOpen className="h-6 w-6" />,
      bgColor: "bg-green-50 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
      hoverColor: "hover:bg-green-100 dark:hover:bg-green-900/50"
    },
    {
      type: QueryType.PRACTICE_QUESTIONS,
      title: "Generate Practice Questions",
      description: "Create quizzes and practice problems for self-assessment",
      icon: <FileQuestion className="h-6 w-6" />,
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-800",
      hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-900/50"
    },
    {
      type: QueryType.KNOWLEDGE_GAP,
      title: "Identify Knowledge Gaps",
      description: "Find areas where you need additional study and focus",
      icon: <BrainCircuit className="h-6 w-6" />,
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800",
      hoverColor: "hover:bg-amber-100 dark:hover:bg-amber-900/50"
    }
  ];

  // Handler for selecting an example prompt
  const handlePromptClick = (prompt: string, queryType: QueryType) => {
    onStartConversation(prompt, queryType);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 overflow-y-auto">
      <div className="max-w-3xl w-full space-y-8">
        {/* Welcome heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to your AI-powered Study Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get personalized help with your coursework, generate study materials, and practice your knowledge
          </p>
        </div>

        {/* Query type cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {queryTypeCards.map((card) => (
            <div 
              key={card.type}
              className={`border ${card.borderColor} rounded-lg ${card.bgColor} p-5 transition-colors ${card.hoverColor}`}
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-3 ${card.bgColor} ${card.iconColor}`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{card.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Example prompts for this card */}
              <div className="mt-4 space-y-2">
                {examplePrompts[card.type].slice(0, 2).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt, card.type)}
                    className="w-full text-left text-sm p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    &quot;{prompt}&quot;
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Course-specific guidance */}
        {courseId && (
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Currently exploring:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You can ask questions specific to your current course or explore other topics using the subject selector above.
            </p>
          </div>
        )}

        {/* Tips and help */}
        <div className="text-center space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <p>Type your question in the box below to get started</p>
          <p>You can change the conversation type using the buttons at the bottom</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;