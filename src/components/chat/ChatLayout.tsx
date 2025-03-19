"use client";

import { ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (!isDesktop) {
    return <div className="flex h-screen bg-background">{children}</div>;
  }
  
  return (
    <div className="flex h-screen bg-background">
      {/* The full chat interface will be rendered inside the ChatLayout */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}