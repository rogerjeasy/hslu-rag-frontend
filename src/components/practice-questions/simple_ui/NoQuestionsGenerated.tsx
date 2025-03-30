import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { PracticeQuestionsSetType } from '@/types/practice-questions-responses.types';

interface NoQuestionsGeneratedProps {
  currentSet: PracticeQuestionsSetType | null;
  onBackToList: () => void;
  onRetry?: () => void;
}

const NoQuestionsGenerated: React.FC<NoQuestionsGeneratedProps> = ({
  currentSet,
  onBackToList,
  onRetry
}) => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onBackToList}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Practice Questions
        </Button>
      </div>
      
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-amber-800">No Questions Available</CardTitle>
          <CardDescription className="text-amber-700">
            We weren&apos;t able to generate practice questions for this topic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-white rounded-md border border-amber-100">
            <h3 className="font-medium text-amber-900 mb-2">System Response:</h3>
            <div className="text-gray-700 whitespace-pre-wrap">
              {currentSet?.answer || "No additional information is available about why questions couldn't be generated."}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              onClick={onBackToList} 
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Practice Questions
            </Button>
            
            {onRetry && (
              <Button 
                onClick={onRetry}
                variant="default"
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again with Different Parameters
              </Button>
            )}
          </div>
          
          <div className="mt-4 text-sm text-amber-700">
            <p className="flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              Try selecting a different topic or adjusting the difficulty level.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoQuestionsGenerated;