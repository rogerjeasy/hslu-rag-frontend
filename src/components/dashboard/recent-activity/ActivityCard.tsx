// src/components/dashboard/ActivityCard.tsx
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Component that renders a card container for activities
 */
const ActivityCard: React.FC<ActivityCardProps> = ({ 
  title, 
  action, 
  children 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="px-2">
        {children}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;