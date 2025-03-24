// src/components/ui/error-alert.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface ErrorAlertProps {
  message: string;
  title?: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, title = 'Error', onRetry }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="ml-2">{title}</AlertTitle>
      <AlertDescription className="ml-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span>{message}</span>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
