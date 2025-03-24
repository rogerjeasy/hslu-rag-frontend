// src/components/ui/skill-level-badge.tsx
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface SkillLevelBadgeProps {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SkillLevelBadge({ level, showLabel = true, size = 'md', className }: SkillLevelBadgeProps) {
  const levels = {
    beginner: {
      color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100',
      label: 'Beginner',
      dots: 1
    },
    intermediate: {
      color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100',
      label: 'Intermediate',
      dots: 2
    },
    advanced: {
      color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100',
      label: 'Advanced',
      dots: 3
    },
    expert: {
      color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100',
      label: 'Expert',
      dots: 4
    }
  };

  const { color, label, dots } = levels[level];
  const dotSize = size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-1.5 w-1.5' : 'h-2 w-2';
  const spacing = size === 'sm' ? 'space-x-1' : 'space-x-1.5';

  return (
    <Badge 
      variant="outline" 
      className={cn(`flex items-center ${color}`, className)}
    >
      <div className={`flex ${spacing} mr-1.5`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            className={`rounded-full ${dotSize} ${i < dots ? 'bg-current opacity-100' : 'bg-current opacity-30'}`}
          />
        ))}
      </div>
      {showLabel && label}
    </Badge>
  );
}