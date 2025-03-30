'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePracticeQuestionsStore } from '@/store/usePracticeQuestionsStore';
import { practiceQuestionsService } from '@/services/practiceQuestionsService';
import { useCourseStore } from '@/store/courseStore';
import { DifficultyLevel } from '@/types/practice-questions.types';
import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardDescription,
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  Clock, 
  Plus,
  CheckSquare,
  Trash2,
  Filter
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/toast-provider';

export function PracticeQuestionsList() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    // questionSets, 
    filteredSets, 
    fetchQuestionSets, 
    filterQuestionSets, 
    resetFilters 
  } = usePracticeQuestionsStore();
  const { courses } = useCourseStore();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Load question sets on mount
  useEffect(() => {
    const loadQuestionSets = async () => {
      try {
        setIsLoading(true);
        await fetchQuestionSets();
      } catch (error) {
        console.error("Failed to load practice question sets:", error);
        toast({
          title: "Error",
          description: "Failed to load practice question sets. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestionSets();
  }, []);
  
  // Apply filters when search term or selected course changes
  useEffect(() => {
    filterQuestionSets(searchTerm, selectedCourseId);
  }, [searchTerm, selectedCourseId]);
  
  // Filter by difficulty
  const filteredByDifficulty = selectedDifficulty 
    ? filteredSets.filter(set => set.difficulty === selectedDifficulty)
    : filteredSets;
  
  // Filter by time (recent vs all)
  const recent = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
  
  const filteredByTime = selectedTab === 'recent'
    ? filteredByDifficulty.filter(set => set.createdAt > recent)
    : filteredByDifficulty;
  
  // Sort by newest first
  const sortedSets = [...filteredByTime].sort((a, b) => b.createdAt - a.createdAt);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
  };
  
  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCourseId('');
    setSelectedDifficulty('');
    resetFilters();
  };
  
  const handleStartPractice = (id: string) => {
    router.push(`/practice-questions/${id}`);
  };
  
  const handleCreateNew = () => {
    router.push('/practice-questions/create');
  };
  
  const handleDeleteQuestionSet = async (id: string) => {
    try {
      setIsDeleting(true);
      
      await practiceQuestionsService.deletePracticeQuestionSet(id);
      
      toast({
        title: "Success",
        description: "Practice question set deleted successfully.",
      });
      
      // Refresh the list
      await fetchQuestionSets();
    } catch (error) {
      console.error("Failed to delete practice question set:", error);
      toast({
        title: "Error",
        description: "Failed to delete practice question set. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Get nice difficulty name
  const getDifficultyName = (difficulty: string): string => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };
  
  // Get course name from course ID
  const getCourseName = (courseId: string | undefined): string => {
    if (!courseId) return 'General';
    
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };
  
  // Get appropriate difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    return practiceQuestionsService.getDifficultyColor(difficulty);
  };
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Practice Questions
            </h1>
            <p className="text-slate-600">
              Test your knowledge with practice questions based on your course materials
            </p>
          </div>
          <Button onClick={handleCreateNew} className="self-start flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>
        
        {/* Filters and search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="relative md:col-span-5">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search practice questions..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="md:col-span-3">
            <Select value={selectedCourseId} onValueChange={handleCourseChange}>
                <SelectTrigger>
                    <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                        {course.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-3">
            <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger>
                    <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    {Object.values(DifficultyLevel).map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                        {getDifficultyName(difficulty)}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-1 flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleClearFilters}>
                  Clear all filters
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSelectedTab('all')}
                  className={selectedTab === 'all' ? 'bg-slate-100' : ''}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedTab('recent')}
                  className={selectedTab === 'recent' ? 'bg-slate-100' : ''}
                >
                  Recent (7 days)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Tabs for filtering by time (alternative to dropdown) */}
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="all">All Sets</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* List of question sets */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-slate-600">Loading practice questions...</p>
          </div>
        ) : sortedSets.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
            {searchTerm || selectedCourseId || selectedDifficulty ? (
              <Alert className="max-w-md">
                <AlertDescription className="flex flex-col items-center text-center">
                  <p className="mb-2">No practice questions match your filters.</p>
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="max-w-md">
                <AlertDescription className="flex flex-col items-center text-center">
                  <p className="mb-2">You don&apos;t have any practice question sets yet.</p>
                  <Button onClick={handleCreateNew} size="sm">
                    Create Your First Set
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSets.map((set) => (
              <Card key={set.id} className="flex flex-col h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge className={getDifficultyColor(set.difficulty)}>
                      {getDifficultyName(set.difficulty)}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mt-1 -mr-2 h-8 w-8">
                          <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 1.5C1.5 2.32843 2.17157 3 3 3C3.82843 3 4.5 2.32843 4.5 1.5C4.5 0.671573 3.82843 0 3 0C2.17157 0 1.5 0.671573 1.5 1.5Z" fill="currentColor"/>
                            <path d="M6 1.5C6 2.32843 6.67157 3 7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5Z" fill="currentColor"/>
                            <path d="M10.5 1.5C10.5 2.32843 11.1716 3 12 3C12.8284 3 13.5 2.32843 13.5 1.5C13.5 0.671573 12.8284 0 12 0C11.1716 0 10.5 0.671573 10.5 1.5Z" fill="currentColor"/>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteQuestionSet(set.id)}
                          className="text-red-600"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <CardTitle className="text-lg line-clamp-2 mt-2">{set.topic}</CardTitle>
                  
                  <CardDescription className="flex items-center gap-2 mt-1 text-xs">
                    <BookOpen className="h-3.5 w-3.5" />
                    {getCourseName(set.courseId)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <CheckSquare className="h-4 w-4" />
                      <span>{set.questionCount} questions</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{Math.ceil(set.questionCount * 1.5)} min</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 mt-auto">
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Created {formatDistanceToNow(set.createdAt, { addSuffix: true })}</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleStartPractice(set.id)}
                      className="w-full"
                    >
                      Start Practice
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}