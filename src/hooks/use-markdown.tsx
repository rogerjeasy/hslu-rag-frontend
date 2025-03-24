import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

export function useMarkdown(markdownString: string) {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // Create a new marked instance
    const marked = new Marked(
      {
        gfm: true,
        breaks: false
      }
    );
    
    // Add highlight.js syntax highlighting
    marked.use(
      markedHighlight({
        highlight: (code, lang) => {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language }).value;
        }
      })
    );

    // Use an async function to handle parsing
    const parseMarkdown = async () => {
      try {
        // Parse markdown and handle both string and Promise<string> return types
        const html = await marked.parse(markdownString);
        
        // Now html is guaranteed to be a string
        const cleanHtml = DOMPurify.sanitize(html);
        setMarkdown(cleanHtml);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        setMarkdown('');
      }
    };

    parseMarkdown();
  }, [markdownString]);

  return { markdown };
}