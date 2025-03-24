// src/lib/course-colors.ts
import { CourseColor, ColorClassMap, ColorClasses } from '@/types/course.types';
import { cn } from './utils';

// Define a minimal interface for the course input
interface CourseInput {
  code: string;
  name: string;
  description: string;
  color?: CourseColor;
  icon?: string;
  topics?: string[];
  sampleQuestion?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  highlights?: string[];
  credits: number;
  instructor: string;
  semester: string;
}

// Map colors to default if not specified
export function getDefaultCourseColor(code: string): CourseColor {
  // Generate a predictable color based on the course code
  const codeSum = code.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  const colors: CourseColor[] = [
    'blue', 'indigo', 'violet', 'purple', 'fuchsia',
    'pink', 'rose', 'red', 'orange', 'amber', 
    'yellow', 'lime', 'green', 'emerald', 'teal',
    'cyan', 'sky'
  ];
  
  return colors[codeSum % colors.length];
}

// Default color classes for all supported colors
export const courseColorClasses: ColorClassMap = {
  slate: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    hover: 'hover:bg-slate-200',
    border: 'border-slate-200'
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    hover: 'hover:bg-gray-200',
    border: 'border-gray-200'
  },
  zinc: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-600',
    hover: 'hover:bg-zinc-200',
    border: 'border-zinc-200'
  },
  neutral: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-600',
    hover: 'hover:bg-neutral-200',
    border: 'border-neutral-200'
  },
  stone: {
    bg: 'bg-stone-100',
    text: 'text-stone-600',
    hover: 'hover:bg-stone-200',
    border: 'border-stone-200'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    hover: 'hover:bg-red-200',
    border: 'border-red-200'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    hover: 'hover:bg-orange-200',
    border: 'border-orange-200'
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    hover: 'hover:bg-amber-200',
    border: 'border-amber-200'
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    hover: 'hover:bg-yellow-200',
    border: 'border-yellow-200'
  },
  lime: {
    bg: 'bg-lime-100',
    text: 'text-lime-600',
    hover: 'hover:bg-lime-200',
    border: 'border-lime-200'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    hover: 'hover:bg-green-200',
    border: 'border-green-200'
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    hover: 'hover:bg-emerald-200',
    border: 'border-emerald-200'
  },
  teal: {
    bg: 'bg-teal-100',
    text: 'text-teal-600',
    hover: 'hover:bg-teal-200',
    border: 'border-teal-200'
  },
  cyan: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-600',
    hover: 'hover:bg-cyan-200',
    border: 'border-cyan-200'
  },
  sky: {
    bg: 'bg-sky-100',
    text: 'text-sky-600',
    hover: 'hover:bg-sky-200',
    border: 'border-sky-200'
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-200',
    border: 'border-blue-200'
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    hover: 'hover:bg-indigo-200',
    border: 'border-indigo-200'
  },
  violet: {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    hover: 'hover:bg-violet-200',
    border: 'border-violet-200'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-200',
    border: 'border-purple-200'
  },
  fuchsia: {
    bg: 'bg-fuchsia-100',
    text: 'text-fuchsia-600',
    hover: 'hover:bg-fuchsia-200',
    border: 'border-fuchsia-200'
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-600',
    hover: 'hover:bg-pink-200',
    border: 'border-pink-200'
  },
  rose: {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    hover: 'hover:bg-rose-200',
    border: 'border-rose-200'
  }
};

// Helper function to get class strings with proper opacity
export function getCourseColorWithOpacity(
  color: CourseColor | undefined, 
  classType: keyof ColorClasses,
  opacity?: number
): string {
  // Default to blue if color is undefined
  const safeColor = color || 'blue';
  const classes = courseColorClasses[safeColor] || courseColorClasses.blue;
  
  // Get the base class
  let baseClass = classes[classType];
  
  // Apply opacity if provided
  if (opacity !== undefined) {
    // For background and border classes, we need to replace the intensity value
    if (classType === 'bg' || classType === 'border') {
      // Extract the color intensity (e.g., '100' from 'bg-blue-100')
      const match = baseClass.match(/-(\d+)$/);
      if (match && match[1]) {
        // Replace the intensity with the opacity
        baseClass = baseClass.replace(`-${match[1]}`, `-${match[1]}/${opacity}`);
      }
    }
  }
  
  return baseClass;
}

// Function to generate all required classes for a course card
export function getCourseCardClasses(color: CourseColor | undefined) {
  // Default to blue if undefined
  const safeColor = color || 'blue';
  
  return {
    container: cn(
      `border-${safeColor}-200/50`, 
      `bg-${safeColor}-50/30`
    ),
    icon: cn(
      `bg-${safeColor}-100/50`, 
      `text-${safeColor}-600`
    ),
    badge: cn(
      `bg-${safeColor}-100`, 
      `text-${safeColor}-700`
    ),
    highlight: cn(
      `text-${safeColor}-600`
    )
  };
}

// Extract course UI enhancement properties from other data
export function enhanceCourseForUI(course: CourseInput) {
  // If the course already has the UI properties, return it as is
  if (course.color && course.icon) return course;
  
  // Generate a color based on the course code if not already set
  const color = course.color || getDefaultCourseColor(course.code);
  
  // Create sample topics from the description if not provided
  let topics: string[] = [];
  if (!course.topics || course.topics.length === 0) {
    // Simple extraction of potential topics from description
    const topicKeywords = [
      'introduction', 'fundamental', 'advanced', 'theory',
      'practice', 'analysis', 'research', 'application',
      'method', 'technique', 'principle', 'concept'
    ];
    
    // Get words from description and find potential topics
    const words = course.description.split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      if (topicKeywords.includes(words[i].toLowerCase())) {
        const potentialTopic = `${words[i]} ${words[i+1]}`;
        if (potentialTopic.length > 5) {
          topics.push(potentialTopic);
        }
      }
    }
    
    // If we couldn't extract topics, create some generic ones
    if (topics.length === 0) {
      topics = [
        `Key ${course.name} concepts`,
        `${course.name} fundamentals`,
        `${course.name} applications`
      ];
    }
  } else {
    topics = course.topics;
  }
  
  // Generate a sample question if not provided
  const sampleQuestion = course.sampleQuestion || 
    `Can you explain the key concepts of ${course.name} in simple terms?`;
  
  // Determine difficulty level based on course code if not specified
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' = 'All Levels';
  if (!course.difficulty) {
    const code = course.code.toLowerCase();
    if (code.includes('intro') || code.includes('101') || /^[a-z]+1\d{2}$/.test(code)) {
      difficulty = 'Beginner';
    } else if (code.includes('adv') || /^[a-z]+4\d{2}$/.test(code)) {
      difficulty = 'Advanced';
    } else if (/^[a-z]+[23]\d{2}$/.test(code)) {
      difficulty = 'Intermediate';
    }
  } else {
    difficulty = course.difficulty;
  }
  
  // Create highlights if not provided
  const highlights = course.highlights || [
    `${course.credits} credit hours`,
    `Taught by ${course.instructor}`,
    `${course.semester} semester`
  ];
  
  // Return the enhanced course with UI properties
  return {
    ...course,
    color,
    topics,
    sampleQuestion,
    difficulty,
    highlights
  };
}