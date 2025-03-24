"use strict";
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubmissionResult } from '@/types/practice-questions';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BarChart, 
  Download, 
  Share2, 
  Printer, 
  RotateCcw 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from 'sonner';
import Link from 'next/link';

interface ResultsSummaryProps {
  results: SubmissionResult;
  questionSetId: string;
  questionSetTitle: string;
  onRetry: () => void;
}

export function ResultsSummary({ 
  results, 
  questionSetId,
  questionSetTitle,
  onRetry 
}: ResultsSummaryProps) {
  const { total_questions, correct_answers, question_results, score_percentage } = results;
  
  // Count different result types
  const correctCount = correct_answers;
  const reviewCount = question_results.filter(q => q.requires_review).length;
  const incorrectCount = total_questions - correctCount - reviewCount;
  
  // Calculate percentages for chart
  const correctPercentage = (correctCount / total_questions) * 100;
  const reviewPercentage = (reviewCount / total_questions) * 100;
  const incorrectPercentage = (incorrectCount / total_questions) * 100;
  
  // Determine performance level
  const getPerformanceLevel = () => {
    if (score_percentage === null) return "Requires Review";
    if (score_percentage >= 90) return "Excellent";
    if (score_percentage >= 80) return "Very Good";
    if (score_percentage >= 70) return "Good";
    if (score_percentage >= 60) return "Satisfactory";
    if (score_percentage >= 50) return "Needs Improvement";
    return "Needs Significant Review";
  };
  
  // Get feedback based on performance
  const getFeedback = () => {
    if (score_percentage === null) {
      return "Your answers require manual review. Use the sample answers as a guide to self-assess your understanding.";
    }
    
    if (score_percentage >= 90) {
      return "Excellent work! You have a strong understanding of this material.";
    }
    
    if (score_percentage >= 70) {
      return "Good job! You have a solid grasp of most concepts, but there are a few areas to review.";
    }
    
    if (score_percentage >= 50) {
      return "You're on the right track, but should review the material more thoroughly.";
    }
    
    return "Don't worry! This is an opportunity to identify and strengthen your weak areas.";
  };
  
  // Handle download results
  const handleDownload = () => {
    try {
      // Create a text representation of the results
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `practice-results-${timestamp}.txt`;
      
      let content = `Practice Questions Results\n`;
      content += `Title: ${questionSetTitle}\n`;
      content += `Date: ${new Date().toLocaleString()}\n\n`;
      content += `Score: ${correct_answers}/${total_questions}`;
      if (score_percentage !== null) {
        content += ` (${score_percentage}%)\n`;
      } else {
        content += ` (Requires Review)\n`;
      }
      content += `Performance: ${getPerformanceLevel()}\n\n`;
      
      // Add individual question results
      content += `Question Results:\n`;
      question_results.forEach((result, index) => {
        content += `Question ${index + 1}: `;
        if (result.requires_review) {
          content += `Requires Review\n`;
        } else if (result.is_correct) {
          content += `Correct\n`;
        } else {
          content += `Incorrect\n`;
        }
        
        if (result.explanation) {
          content += `Explanation: ${result.explanation}\n`;
        }
        
        content += `\n`;
      });
      
      // Create a blob and download it
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Results downloaded successfully');
    } catch (error) {
      console.error('Failed to download results:', error);
      toast.error('Failed to download results');
    }
  };
  
  // Handle share results
  const handleShare = async () => {
    try {
      // Create a simple text representation to share
      const shareText = `I scored ${correct_answers}/${total_questions}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Practice Question Results',
          text: shareText,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success('Results copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to share results:', error);
      toast.error('Failed to share results');
    }
  };
  
  // Handle print results
  const handlePrint = () => {
    try {
      window.print();
    } catch (error) {
      console.error('Failed to print results:', error);
      toast.error('Failed to print results');
    }
  };
  
  return (
    <Card className="print:shadow-none">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Practice Results</CardTitle>
        <CardDescription>
          {questionSetTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score overview */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {score_percentage !== null ? `${score_percentage}%` : 'Review Required'}
          </div>
          <div className="text-muted-foreground">
            {correct_answers} correct out of {total_questions} questions
          </div>
          <div className="text-sm font-medium mt-2">
            {getPerformanceLevel()}
          </div>
          <div className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {getFeedback()}
          </div>
        </div>
        
        {/* Results breakdown */}
        <div className="space-y-4">
          <h3 className="font-medium">Results Breakdown</h3>
          
          <div className="space-y-2">
            {/* Correct answers */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                <span>Correct</span>
              </div>
              <span>{correctCount} ({Math.round(correctPercentage)}%)</span>
            </div>
            <div className="relative w-full">
              <Progress value={correctPercentage} className="h-2 bg-muted" />
              <div 
                className="absolute top-0 left-0 h-2 bg-green-600 dark:bg-green-500 rounded-full" 
                style={{ width: `${correctPercentage}%` }}
              />
            </div>
            
            {/* Incorrect answers */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center">
                <XCircle className="h-4 w-4 mr-2 text-red-600 dark:text-red-500" />
                <span>Incorrect</span>
              </div>
              <span>{incorrectCount} ({Math.round(incorrectPercentage)}%)</span>
            </div>
            <div className="relative w-full">
              <Progress value={incorrectPercentage} className="h-2 bg-muted" />
              <div 
                className="absolute top-0 left-0 h-2 bg-red-600 dark:bg-red-500 rounded-full" 
                style={{ width: `${incorrectPercentage}%` }}
              />
            </div>
            
            {/* Needs review answers */}
            {reviewCount > 0 && (
              <>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-500" />
                    <span>Needs Review</span>
                  </div>
                  <span>{reviewCount} ({Math.round(reviewPercentage)}%)</span>
                </div>
                <div className="relative w-full">
                  <Progress value={reviewPercentage} className="h-2 bg-muted" />
                  <div 
                    className="absolute top-0 left-0 h-2 bg-yellow-600 dark:bg-yellow-500 rounded-full" 
                    style={{ width: `${reviewPercentage}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Performance chart or visualization could go here */}
        <div className="p-4 border rounded-md bg-muted/30 flex items-center justify-center">
          <div className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Detailed analytics will appear here after multiple practice sessions
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-2 flex-1 justify-center sm:justify-start print:hidden">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
              <div className="text-sm">
                Share your results via the platform&apos;s sharing mechanism or copy them to your clipboard
              </div>
            </HoverCardContent>
          </HoverCard>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
        
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button size="sm" asChild>
            <Link href={`/practice-questions/${questionSetId}/review`}>
              Review Questions
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}