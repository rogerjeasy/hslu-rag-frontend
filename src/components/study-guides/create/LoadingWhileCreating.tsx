"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Loader2, RefreshCw, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoadingWhileCreatingProps = {
  isLoading: boolean;
  isSuccess: boolean;
  studyGuideId?: string;
  studyGuideTopic?: string;
  onReset: () => void;
};

export function LoadingWhileCreating({
  isLoading,
  isSuccess,
  studyGuideId,
  studyGuideTopic,
  onReset,
}: LoadingWhileCreatingProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Show the dialog when loading starts
  useEffect(() => {
    if (isLoading || isSuccess) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isLoading, isSuccess]);

  // Show confetti animation when success state is reached
  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleViewDetails = () => {
    if (studyGuideId) {
      router.push(`/study-guides/${studyGuideId}`);
    }
  };

  const handleCreateNew = () => {
    setOpen(false);
    onReset();
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      // Only allow changing dialog state if not loading
      if (!isLoading) {
        setOpen(value);
      }
    }}>
      <DialogContent className="sm:max-w-md p-6 rounded-lg">
        {!isLoading && <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />}
        <DialogTitle className={cn("text-center", isLoading ? "" : "sr-only")}>
          {isLoading ? "Creating Your Study Guide" : "Study Guide Created"}
        </DialogTitle>
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          {isLoading && (
            <>
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <p className="text-slate-600 text-center">
                This may take a minute or two depending on the complexity of the topic.
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                <div className="bg-primary h-2 rounded-full animate-pulse"></div>
              </div>
            </>
          )}

          {isSuccess && (
            <>
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-green-50 mb-4 relative">
                <Check className="h-12 w-12 text-green-500" />
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="confetti-container">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="confetti"
                          style={{
                            top: '-10px',
                            left: `${10 + i * 5}%`,
                            animationDelay: `${i * 0.1}s`,
                            backgroundColor: ['#FFC700', '#FF0099', '#00C3FF', '#44D62C', '#9000FF'][i % 5],
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-center">Study Guide Created!</h3>
              <p className="text-slate-600 text-center mb-2">
                {studyGuideTopic ? `"${studyGuideTopic}"` : 'Your study guide'} is now ready to use.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleCreateNew}
                >
                  <RefreshCw className="h-4 w-4" />
                  Create New
                </Button>
                <Button
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
                  onClick={handleViewDetails}
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
      <style jsx>{`
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0;
          animation: confetti-fall 3s ease-out forwards;
          transform-origin: center;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </Dialog>
  );
}

export default LoadingWhileCreating;