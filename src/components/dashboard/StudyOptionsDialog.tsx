"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare, BookMarked, CheckSquare, BarChart3 } from 'lucide-react';

interface StudyOption {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

interface StudyOptionsDialogProps {
  trigger: React.ReactNode;
}

const StudyOptionsDialog: React.FC<StudyOptionsDialogProps> = ({ trigger }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const studyOptions: StudyOption[] = [
    {
      title: "Chat Assistant",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      description: "Ask questions and get instant answers from your AI learning assistant"
    },
    {
      title: "Study Guides",
      href: "/study-guides",
      icon: <BookMarked className="h-5 w-5 text-primary" />,
      description: "Generate comprehensive study guides for any topic in your courses"
    },
    {
      title: "Practice Questions",
      href: "/practice-questions",
      icon: <CheckSquare className="h-5 w-5 text-primary" />,
      description: "Test your knowledge with adaptive practice questions"
    },
    {
      title: "Knowledge Gap Analytics",
      href: "/knowledge-gaps",
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      description: "Identify and address gaps in your understanding"
    }
  ];

  const handleOptionClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a study method</DialogTitle>
          <DialogDescription>
            Select how you&apos;d like to continue your studies
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          {studyOptions.map((option) => (
            <button
              key={option.title}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors text-left"
              onClick={() => handleOptionClick(option.href)}
            >
              <div className="rounded-full p-2 bg-primary/10 mt-0.5">
                {option.icon}
              </div>
              <div>
                <div className="font-medium">{option.title}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudyOptionsDialog;