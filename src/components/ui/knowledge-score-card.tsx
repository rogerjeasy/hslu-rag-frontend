// src/components/ui/knowledge-score-card.tsx
import { cva } from 'class-variance-authority';
import { Progress } from './progress';
import { cn } from '@/lib/utils'; // Make sure to import cn

interface KnowledgeScoreCardProps {
  score: number; // 0-100
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const scoreVariants = cva('', {
  variants: {
    score: {
      low: 'text-red-500',
      medium: 'text-yellow-500',
      high: 'text-green-500',
      perfect: 'text-blue-500',
    },
  },
  defaultVariants: {
    score: 'medium',
  },
});

const progressVariants = cva('', {
  variants: {
    score: {
      low: 'bg-red-500',
      medium: 'bg-yellow-500',
      high: 'bg-green-500',
      perfect: 'bg-blue-500',
    },
  },
  defaultVariants: {
    score: 'medium',
  },
});

export function KnowledgeScoreCard({
  score,
  title = 'Knowledge Score',
  size = 'md',
  showLabel = true,
  className
}: KnowledgeScoreCardProps) {
  // Determine color based on score
  const getScoreCategory = (score: number) => {
    if (score >= 90) return 'perfect';
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };
  const category = getScoreCategory(score);
 
  const scoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Needs work';
  };

  const sizeClasses = {
    sm: {
      container: 'p-3',
      title: 'text-xs',
      score: 'text-xl font-bold',
      label: 'text-xs',
      progressHeight: 'h-1.5'
    },
    md: {
      container: 'p-4',
      title: 'text-sm',
      score: 'text-3xl font-bold',
      label: 'text-sm',
      progressHeight: 'h-2'
    },
    lg: {
      container: 'p-6',
      title: 'text-base',
      score: 'text-4xl font-bold',
      label: 'text-base',
      progressHeight: 'h-2.5'
    }
  };

  const classes = sizeClasses[size];
  const progressClass = progressVariants({ score: category });
  
  return (
    <div className={cn(`bg-white dark:bg-gray-800 border rounded-lg ${classes.container}`, className)}>
      <div className="space-y-2">
        <div className={`${classes.title} text-gray-500 dark:text-gray-400`}>{title}</div>
        <div className={`${classes.score} ${scoreVariants({ score: category })}`}>
          {score}%
        </div>
        {showLabel && (
          <div className={`${classes.label} text-gray-500 dark:text-gray-400`}>
            {scoreLabel()}
          </div>
        )}
        <Progress
          value={score}
          className={cn(classes.progressHeight, "bg-gray-100 dark:bg-gray-700", {
            [progressClass]: true // Apply the progress color class to the indicator
          })}
        />
      </div>
    </div>
  );
}