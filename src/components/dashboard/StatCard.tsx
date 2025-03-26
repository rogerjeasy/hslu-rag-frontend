"use client";
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Animation variants for individual stat card
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

interface StatCardProps {
  title: string;
  icon: ReactNode;
  value: string;
  subValue?: ReactNode; // Can be string or complex element like Progress
  trend?: {
    value: string;
    icon?: ReactNode;
    positive?: boolean;
  };
  showProgress?: boolean;
  progressValue?: number;
}

/**
 * A reusable stat card component for the dashboard
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  value,
  subValue,
  trend,
  showProgress = false,
  progressValue = 0
}) => {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          
          {showProgress && (
            <Progress value={progressValue} className="h-2 mt-2" />
          )}
          
          {!showProgress && subValue && (
            typeof subValue === 'string' ? (
              <p className="text-xs text-muted-foreground">{subValue}</p>
            ) : (
              subValue
            )
          )}
          
          {trend && (
            <div className="flex items-center gap-1">
              {trend.icon}
              <span className={`text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.value}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;