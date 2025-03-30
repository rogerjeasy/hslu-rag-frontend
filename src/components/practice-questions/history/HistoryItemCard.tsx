"use client";

import React from 'react';
import { format } from 'date-fns';
import { Calendar, Award, BookOpen, Eye } from 'lucide-react';
import { QuestionSetSummary } from '@/types/practice-questions.types';
import { DifficultyBadge } from '@/components/practice-questions/DifficultyBadge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QuestionTypeBadge } from '../QuestionTypeBadge';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface HistoryItemCardProps {
  questionSet: QuestionSetSummary;
  courseInfo: { id: string; name: string; color: string } | null;
  showScore?: boolean;
  index?: number;
}

export function HistoryItemCard({ 
  questionSet, 
  courseInfo, 
  showScore = false,
  index = 0
}: HistoryItemCardProps) {
  // Generate a random score for demo purposes
  // In a real app, this would come from your data
  const randomScore = Math.floor(Math.random() * (100 - 65) + 65);
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  // Helper function to get relative time
  // const getRelativeTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return formatDistanceToNow(date, { addSuffix: true });
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/practice-questions/${questionSet.id}`} passHref>
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 cursor-pointer flex flex-col group">
          <CardHeader className="pb-2 group-hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                {courseInfo && (
                  <Badge 
                    variant="outline" 
                    className="mb-1 font-normal text-xs border-0 px-2"
                    style={{ 
                      backgroundColor: `${courseInfo.color}20`, 
                      color: courseInfo.color 
                    }}
                  >
                    {courseInfo.name}
                  </Badge>
                )}
                <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
                  {questionSet.title}
                </CardTitle>
              </div>
              
              {/* Display score for completed sets */}
              {showScore && (
                <div className="flex items-center bg-secondary/50 rounded-full py-1 px-3 text-sm font-medium">
                  <Award className="h-3.5 w-3.5 mr-1 text-yellow-600 dark:text-yellow-400" />
                  {randomScore}%
                </div>
              )}
            </div>
            
            {questionSet.description && (
              <CardDescription className="line-clamp-2 mt-1">
                {questionSet.description}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="pb-3 pt-0 flex-grow">
            <div className="flex flex-wrap gap-1.5 mt-2">
              <DifficultyBadge difficulty={questionSet.difficulty} className="text-xs font-normal" />
              
              {/* Show only up to 2 question types directly, rest in tooltip */}
              {questionSet.types.slice(0, 2).map((type) => (
                <QuestionTypeBadge key={type} type={type} />
              ))}
              
              {questionSet.types.length > 2 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs font-normal">
                        +{questionSet.types.length - 2} more
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Additional question types: {questionSet.types
                          .slice(2)
                          .map((type) => {
                            switch (type) {
                              case "multiple_choice": return "Multiple Choice";
                              case "short_answer": return "Short Answer";
                              case "true_false": return "True/False";
                              case "fill_in_blank": return "Fill in Blank";
                              case "matching": return "Matching";
                              default: return type;
                            }
                          })
                          .join(", ")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <div className="flex items-center mt-3 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 mr-1.5" />
              <span>{questionSet.questionCount} questions</span>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 border-t flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <TooltipProvider>
                <Tooltip>
                  {/* <TooltipTrigger>
                    <span>{formatDate(questionSet.createdAt)}</span>
                  </TooltipTrigger> */}
                  <TooltipContent>
                    <p>{format(new Date(questionSet.createdAt), 'PPPP')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto text-xs font-normal text-muted-foreground hover:text-primary hover:bg-transparent group-hover:text-primary transition-colors"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              View Details
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}