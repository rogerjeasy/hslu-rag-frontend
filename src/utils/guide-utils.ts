// /components/study-guides/utils/guide-utils.ts
import { StudyGuide, GuideType, DetailLevel, StudyGuideFormat } from '@/types/study-guide';
import { Course } from '@/types/course.types';

// Format date relative to current date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Get guide type label for display
export function getGuideTypeLabel(guideType: GuideType): string {
  switch (guideType) {
    case 'summary':
      return 'Summary Guide';
    case 'concept':
      return 'Concept Map';
    case 'practice':
      return 'Practice Test';
    case 'flashcard':
      return 'Flashcard Set';
    default:
      return 'Study Guide';
  }
}

// Get border color based on guide type
export function getGuideBorderColor(guideType: GuideType): string {
  switch (guideType) {
    case 'summary':
      return 'border-l-blue-500';
    case 'concept':
      return 'border-l-purple-500';
    case 'practice':
      return 'border-l-green-500';
    case 'flashcard':
      return 'border-l-orange-500';
    default:
      return 'border-l-blue-500';
  }
}

// Generate mock study guides for demonstration purposes
// Function with fixed StudyGuide implementation
export function generateMockStudyGuides(courses: Course[]): StudyGuide[] {
    const guideTypes: GuideType[] = ['summary', 'concept', 'practice', 'flashcard'];
    const guides: StudyGuide[] = [];
    
    courses.forEach(course => {
      // Create between 1-4 guides per course
      const guideCount = Math.floor(Math.random() * 4) + 1;
      
      for (let i = 0; i < guideCount; i++) {
        const guideType = guideTypes[Math.floor(Math.random() * guideTypes.length)];
        const progress = Math.floor(Math.random() * 100);
        const timeAgo = Math.floor(Math.random() * 14) + 1; // 1-14 days ago
        
        const title = getGuideTitle(course.name, guideType, i);
        
        guides.push({
          id: `${course.id}-guide-${i}`,
          title,
          description: `Study guide for ${course.name}`,
          type: guideType,
          courseId: course.id,
          userId: 'user-1', // Adding required userId
          createdAt: new Date(Date.now() - (timeAgo + 7) * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - timeAgo * 24 * 60 * 60 * 1000).toISOString(),
          progress,
          estimatedTime: Math.floor(Math.random() * 120) + 15, // 15-135 minutes
          lastStudied: Math.random() > 0.3 
            ? new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString() 
            : undefined,
          // Adding missing required properties
          detailLevel: DetailLevel.MEDIUM,
          format: StudyGuideFormat.SUMMARY,
          sections: [], 
          citations: []
        });
      }
    });
    
    return guides;
  }

// Generate guide title based on type and index
function getGuideTitle(courseName: string, guideType: GuideType, index: number): string {
  switch (guideType) {
    case 'summary':
      return index === 0 
        ? `Complete ${courseName} Summary` 
        : `${courseName} - Module ${index} Summary`;
    case 'concept':
      return index === 0
        ? `${courseName} Key Concepts Map`
        : `${courseName} - Advanced Concepts Map`;
    case 'practice':
      return index === 0
        ? `${courseName} Practice Exam`
        : `${courseName} Quiz ${index}`;
    case 'flashcard':
      return index === 0
        ? `${courseName} Terminology Flashcards`
        : `${courseName} - Set ${index} Flashcards`;
    default:
      return `${courseName} Study Guide`;
  }
}

// Filter and sort guides based on criteria
export function processGuides(
  guides: StudyGuide[],
  courses: Course[],
  selectedGuideType: string,
  sortOption: string
): StudyGuide[] {
  // Filter guides based on selected type and course status
  const filteredGuides = guides.filter(guide => {
    const courseIsActive = courses.find(c => c.id === guide.courseId)?.status === 'active';
    
    if (!courseIsActive) return false;
    if (selectedGuideType === 'all') return true;
    return guide.type === selectedGuideType;
  });
  
  // Sort guides based on selected option
  return [...filteredGuides].sort((a, b) => {
    switch (sortOption) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'priority':
        // Priority would be based on exam dates, here we'll just use reverse creation date
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
}