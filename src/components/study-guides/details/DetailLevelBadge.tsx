import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  BedSingleIcon, 
  BuildingIcon, 
  LibraryIcon  // Changed from BuildingLibraryIcon
} from 'lucide-react';
import { DetailLevel } from '@/types/study-guide.types';

interface DetailLevelBadgeProps {
  level: DetailLevel;
}

// Make sure we're correctly exporting the component
export function DetailLevelBadge({ level }: DetailLevelBadgeProps) {
  const levelInfo = {
    [DetailLevel.BASIC]: {
      label: 'Basic',
      icon: BedSingleIcon,
      color: 'bg-teal-100 text-teal-800 hover:bg-teal-200'
    },
    [DetailLevel.MEDIUM]: {
      label: 'Medium',
      icon: BuildingIcon,
      color: 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    },
    [DetailLevel.COMPREHENSIVE]: {
      label: 'Comprehensive',
      icon: LibraryIcon,  // Changed from BuildingLibraryIcon
      color: 'bg-red-100 text-red-800 hover:bg-red-200'
    }
  };

  const { label, icon: Icon, color } = levelInfo[level] || levelInfo[DetailLevel.MEDIUM];

  return (
    <Badge variant="secondary" className={`${color} flex items-center`}>
      <Icon className="h-3.5 w-3.5 mr-1" />
      {label}
    </Badge>
  );
}

// Also export as default to ensure it can be imported either way
export default DetailLevelBadge;