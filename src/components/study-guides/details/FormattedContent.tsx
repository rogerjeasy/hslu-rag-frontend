"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FormattedContentProps {
  content: string;
  citations: number[];
}

export function FormattedContent({ content, citations }: FormattedContentProps) {
  const processedContent = highlightCitations(content, citations);

  return (
    <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
      <TooltipProvider>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ ...props }) => (
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10 mb-4" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4" {...props} />
            ),
            h4: ({ ...props }) => (
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="text-base" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
            ),
            a: ({ ...props }) => {
              // Handle citation links
              if (props.href && props.href.startsWith('#citation-')) {
                const citationNum = props.href.replace('#citation-', '');
                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        className="inline-block px-1 font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded cursor-pointer"
                        {...props}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="max-w-sm">
                      <p className="text-sm">Reference {citationNum}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }
              
              return (
                <a className="font-medium text-blue-600 dark:text-blue-400 hover:underline" {...props} />
              );
            },
            strong: ({ ...props }) => (
              <strong className="font-semibold" {...props} />
            ),
            blockquote: ({ ...props }) => (
              <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
            ),
            // Fix the code component to properly type check the inline property
            code: ({ className, ...props }) => {
              // Check if it has a className to determine if it's a code block or inline code
              // Code blocks typically have a className like 'language-javascript'
              const isInline = !className;
              
              if (isInline) {
                return <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm" {...props} />;
              }
              
              return (
                <Card className="my-6 overflow-hidden">
                  <code className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm block p-4 overflow-x-auto ${className}`} {...props} />
                </Card>
              );
            },
            table: ({ ...props }) => (
              <div className="my-6 w-full overflow-y-auto">
                <table className="w-full" {...props} />
              </div>
            ),
            th: ({ ...props }) => (
              <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />
            ),
            td: ({ ...props }) => (
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />
            ),
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </TooltipProvider>
    </div>
  );
}

// Function to highlight citations in the text
function highlightCitations(content: string, citations: number[]): string {
  let processedContent = content;
  
  // Step 1: First handle and fix nested or malformed citation patterns
  // Fix cases like [[[[5]](#citation-5)](#citation-5)](#citation-5) or [[4]](#citation-4)
  // by normalizing them to simple [5] format before processing
  const nestedCitationPattern = /\[+\s*(\d+)\s*\]+(?:\(#citation-\d+\))*/g;
  processedContent = processedContent.replace(nestedCitationPattern, (match, citationNum) => {
    return `[${citationNum}]`;
  });
  
  // Step 2: Process normalized citation patterns
  const citationRegex = /\[(\d+)\]/g;
  let match;
  const processedIndices = new Set(); // Track positions we've already processed
  
  while ((match = citationRegex.exec(processedContent)) !== null) {
    const fullMatch = match[0];
    const citationNum = match[1];
    const position = match.index;
    
    // Skip if we've already processed this position
    if (processedIndices.has(position)) continue;
    
    // Only process if this citation number is in our citations array
    if (citations.includes(Number(citationNum))) {
      // Create markdown link if it's not already a link
      const replacement = `[${fullMatch}](#citation-${citationNum})`;
      
      // Replace just this instance (not all occurrences)
      const before = processedContent.substring(0, position);
      const after = processedContent.substring(position + fullMatch.length);
      processedContent = before + replacement + after;
      
      // Mark this position as processed
      processedIndices.add(position);
      
      // Adjust the regex index to account for the replacement
      citationRegex.lastIndex = position + replacement.length;
    }
  }
  
  return processedContent;
}

export default FormattedContent;