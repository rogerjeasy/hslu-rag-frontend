"use client";

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language: string;
  value: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({ 
  language, 
  value, 
  showLineNumbers = true 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Function to copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Format the language display name
  const formatLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      js: 'JavaScript',
      ts: 'TypeScript',
      jsx: 'React JSX',
      tsx: 'React TSX',
      py: 'Python',
      rb: 'Ruby',
      java: 'Java',
      cpp: 'C++',
      cs: 'C#',
      go: 'Go',
      rs: 'Rust',
      php: 'PHP',
      sh: 'Shell',
      sql: 'SQL',
      yaml: 'YAML',
      json: 'JSON',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      md: 'Markdown',
      text: 'Text',
    };

    return languageMap[lang.toLowerCase()] || lang;
  };

  return (
    <div className="relative my-4 rounded-md overflow-hidden">
      {/* Language label and copy button */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-900 text-xs text-neutral-200">
        <span className="font-mono font-medium">
          {formatLanguage(language)}
        </span>
        
        <button
          onClick={copyToClipboard}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-800 transition-colors",
            copied && "text-green-400"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code with syntax highlighting */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.375rem 0.375rem',
          fontSize: '0.9rem',
        }}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          textAlign: 'right',
          color: '#606366',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}