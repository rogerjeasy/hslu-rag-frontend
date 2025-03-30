'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { practiceQuestionsService, PracticeQuestionsSummary } from '@/services/practice-questions-responses.service';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Search, GraduationCap, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';

export default function PracticeQuestionsList() {
  const router = useRouter();
  const [questionSets, setQuestionSets] = useState<PracticeQuestionsSummary[]>([]);
  const [filteredSets, setFilteredSets] = useState<PracticeQuestionsSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch practice question sets on mount
  useEffect(() => {
    const fetchQuestionSets = async () => {
      try {
        setIsLoading(true);
        const data = await practiceQuestionsService.getPracticeQuestionSets(20);
        setQuestionSets(data);
        setFilteredSets(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load practice questions:', err);
        setError('Failed to load practice questions');
        setIsLoading(false);
      }
    };

    fetchQuestionSets();
  }, []);

  // Filter question sets based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSets(questionSets);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = questionSets.filter(set => 
      set.topic.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredSets(filtered);
  }, [searchQuery, questionSets]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Navigate to question set
  const handleOpenQuestionSet = (id: string) => {
    router.push(`/practice-questions/${id}`);
  };

  // Get difficulty color based on difficulty string
  const getDifficultyColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === 'basic') {
      return 'bg-green-100 text-green-800';
    }
    if (lowerDifficulty === 'medium') {
      return 'bg-amber-100 text-amber-800';
    }
    if (lowerDifficulty === 'advanced') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Practice Questions</h1>
        <div className="mb-6">
          <Skeleton className="h-10 w-full" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-7 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Practice Questions</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Practice Questions</h1>
      
      {/* Search and filter */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by topic..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500">
        {filteredSets.length} {filteredSets.length === 1 ? 'set' : 'sets'} found
      </div>
      
      {/* Empty state */}
      {filteredSets.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No practice question sets found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or check back later for new content.</p>
        </div>
      )}
      
      {/* Question set list */}
      <div className="space-y-4">
        {filteredSets.map((set) => (
          <Card 
            key={set.id} 
            className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => handleOpenQuestionSet(set.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className={getDifficultyColor(set.difficulty)} variant="secondary">
                  {set.difficulty.charAt(0).toUpperCase() + set.difficulty.slice(1)}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDistanceToNow(new Date(set.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold mt-2">{set.topic}</CardTitle>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>{set.questionCount} {set.questionCount === 1 ? 'question' : 'questions'}</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenQuestionSet(set.id);
                }}
              >
                Start Practice
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}