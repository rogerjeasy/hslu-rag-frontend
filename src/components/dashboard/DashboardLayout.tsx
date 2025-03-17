"use client";

import { ReactNode, useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
 
  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isDesktop]);

  // Handle toggling sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="w-full">
      {/* Mobile Menu Toggle Button */}
      {!isDesktop && (
        <div className="p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      )}

      <div className="flex relative">
        {/* Sidebar component */}
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
       
        {/* Main content area - Removed margin classes */}
        <div className="w-full transition-all duration-300 ease-in-out">
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}