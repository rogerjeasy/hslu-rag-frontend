import { CourseColor, ColorClasses, ColorClassMap } from '@/types/course';

/**
 * Gets the appropriate Tailwind CSS classes for a given course color
 * @param color Course color identifier
 * @returns Object containing CSS classes for various elements
 */
export const getColorClasses = (color: CourseColor): ColorClasses => {
  const colorMap: ColorClassMap = {
    'purple': { 
      bg: 'bg-purple-100', 
      text: 'text-purple-800',
      hover: 'hover:bg-purple-200',
      border: 'border-purple-200'
    },
    'blue': { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800',
      hover: 'hover:bg-blue-200',
      border: 'border-blue-200'
    },
    'green': { 
      bg: 'bg-green-100', 
      text: 'text-green-800',
      hover: 'hover:bg-green-200',
      border: 'border-green-200'
    },
    'yellow': { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800',
      hover: 'hover:bg-yellow-200',
      border: 'border-yellow-200'
    },
    'red': { 
      bg: 'bg-red-100', 
      text: 'text-red-800',
      hover: 'hover:bg-red-200',
      border: 'border-red-200'
    },
    'indigo': { 
      bg: 'bg-indigo-100', 
      text: 'text-indigo-800',
      hover: 'hover:bg-indigo-200',
      border: 'border-indigo-200'
    },
    'teal': { 
      bg: 'bg-teal-100', 
      text: 'text-teal-800',
      hover: 'hover:bg-teal-200',
      border: 'border-teal-200'
    },
    'orange': { 
      bg: 'bg-orange-100', 
      text: 'text-orange-800',
      hover: 'hover:bg-orange-200',
      border: 'border-orange-200'
    },
    'violet': { 
      bg: 'bg-violet-100', 
      text: 'text-violet-800',
      hover: 'hover:bg-violet-200',
      border: 'border-violet-200'
    },
    'amber': { 
      bg: 'bg-amber-100', 
      text: 'text-amber-800',
      hover: 'hover:bg-amber-200',
      border: 'border-amber-200'
    },
    'emerald': { 
      bg: 'bg-emerald-100', 
      text: 'text-emerald-800',
      hover: 'hover:bg-emerald-200',
      border: 'border-emerald-200'
    }
  };
  
  return colorMap[color] || colorMap.blue;
};

/**
 * Gets the appropriate gradient classes for a button based on course color
 * @param color Course color identifier
 * @returns String containing CSS classes for button gradient
 */
export const getGradientClasses = (color: CourseColor): string => {
  if (['blue', 'indigo', 'purple', 'violet'].includes(color)) {
    return "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700";
  } else if (['green', 'emerald', 'teal'].includes(color)) {
    return "from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700";
  } else if (['red', 'orange', 'amber', 'yellow'].includes(color)) {
    return "from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700";
  }
  
  return "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700";
};

/**
 * Gets the number of indicator dots based on difficulty level
 * @param difficulty Course difficulty level
 * @returns Number of indicator dots to display
 */
export const getDifficultyLevel = (difficulty: string): number => {
  const difficultyMap: Record<string, number> = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'all levels': 2
  };
  
  return difficultyMap[difficulty.toLowerCase()] || 2;
};