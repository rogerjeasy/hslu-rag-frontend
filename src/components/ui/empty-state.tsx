// src/components/ui/empty-state.tsx
import { ReactNode } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center text-center p-12">
        {icon && <div className="mb-4">{icon}</div>}
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-500 max-w-md mb-6">{description}</p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
