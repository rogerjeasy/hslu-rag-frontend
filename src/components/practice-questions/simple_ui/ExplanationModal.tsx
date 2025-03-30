// components/practice-questions/ExplanationModal.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QuestionType } from '@/types/practice-questions-responses.types';
import { LightbulbIcon } from 'lucide-react';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question?: QuestionType;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  question,
}) => {
  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <LightbulbIcon className="h-5 w-5 mr-2 text-amber-500" />
            Explanation
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Understanding the answer to this question
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 mb-4">
          <h3 className="font-medium text-base mb-2 text-gray-900">Question:</h3>
          <p className="text-gray-700 mb-4">{question.text}</p>

          <h3 className="font-medium text-base mb-2 text-gray-900">Explanation:</h3>
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <p className="text-gray-800 whitespace-pre-line">{question.explanation}</p>
          </div>

          {question.citations.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-base mb-2 text-gray-900">Source Citations:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {question.citations.map((citation) => (
                  <li key={citation}>Citation {citation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExplanationModal;