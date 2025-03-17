"use client";
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import 'katex/dist/katex.min.css';
import CodeBlock from '../chat/CodeBlock';
import { Components } from 'react-markdown';
import React from 'react';

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  // Use state to handle client-side rendering of Markdown
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simple protection against XSS in markdown
  const sanitizedContent = content.replace(/javascript:/g, 'blocked:');

  // Don't render on the server to avoid hydration issues with math and code blocks
  if (!isMounted) {
    return <div className="prose prose-sm dark:prose-invert max-w-none">{content}</div>;
  }

  // Define custom components for markdown rendering
  const components: Components = {
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && language) {
        return (
          <CodeBlock
            language={language}
            value={String(children).replace(/\n$/, '')}
          />
        );
      }
      
      return inline ? (
        <code className={className} {...props}>
          {children}
        </code>
      ) : (
        <CodeBlock
          language="text"
          value={String(children).replace(/\n$/, '')}
        />
      );
    },
    
    a: ({ href, children, ...props }: any) => {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    },
    
    table: ({ children, ...props }: any) => {
      return (
        <div className="overflow-x-auto my-4">
          <table className="border-collapse border border-border w-full" {...props}>
            {children}
          </table>
        </div>
      );
    },
    
    th: ({ children, ...props }: any) => {
      return (
        <th className="border border-border bg-muted px-4 py-2 text-left" {...props}>
          {children}
        </th>
      );
    },
    
    td: ({ children, ...props }: any) => {
      return (
        <td className="border border-border px-4 py-2" {...props}>
          {children}
        </td>
      );
    }
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypePrism]}
        components={components}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}