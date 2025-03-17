"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen, 
  GraduationCap, 
  Home, 
  BookMarked, 
  FileQuestion, 
  Settings, 
  Menu, 
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: { title: string; href: string }[];
}

export default function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Navigation items with their icons
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />
    },
    {
      title: "Courses",
      href: "/courses",
      icon: <BookOpen className="h-5 w-5" />,
      submenu: [
        { title: "Machine Learning", href: "/courses/machine-learning" },
        { title: "Data Science 101", href: "/courses/data-science-101" },
        { title: "Big Data", href: "/courses/big-data" }
      ]
    },
    {
      title: "Study Guides",
      href: "/study-guides",
      icon: <BookMarked className="h-5 w-5" />
    },
    {
      title: "Practice Questions",
      href: "/practice",
      icon: <FileQuestion className="h-5 w-5" />
    },
    {
      title: "Exam Preparation",
      href: "/exam-prep",
      icon: <GraduationCap className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  // Logic to auto-expand the submenu of the active item
  useEffect(() => {
    const activeMainNav = navItems.find(item => 
      item.submenu?.some(subItem => pathname === subItem.href) || pathname === item.href
    );
    
    if (activeMainNav?.submenu) {
      setExpandedItem(activeMainNav.title);
    }
  }, [pathname, navItems]);

  // Toggle submenu expansion
  const toggleSubmenu = (title: string) => {
    setExpandedItem(prev => prev === title ? null : title);
  };

  // Mobile sidebar variants
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && !isDesktop && (
          <motion.div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
        )}
      </AnimatePresence>

      {/* Different sidebar behavior for mobile vs desktop */}
      {isDesktop ? (
        // Desktop: static sidebar
        <div 
          className={cn(
            "h-full bg-card border-r shadow-sm",
            open ? "w-64" : "w-20",
            "transition-all duration-300 ease-in-out"
          )}
        >
          <SidebarContent 
            navItems={navItems} 
            open={open} 
            expandedItem={expandedItem} 
            toggleSubmenu={toggleSubmenu} 
            pathname={pathname} 
          />
        </div>
      ) : (
        // Mobile: animated slide-in sidebar
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r shadow-sm"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2 font-semibold">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span>HSLU Exam Prep</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SidebarContent 
                navItems={navItems} 
                open={true} // Always fully open on mobile
                expandedItem={expandedItem} 
                toggleSubmenu={toggleSubmenu} 
                pathname={pathname} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

// Extracted sidebar content to avoid duplication
function SidebarContent({ 
  navItems, 
  open, 
  expandedItem, 
  toggleSubmenu, 
  pathname 
}: { 
  navItems: NavItem[],
  open: boolean,
  expandedItem: string | null,
  toggleSubmenu: (title: string) => void,
  pathname: string
}) {
  return (
    <>
      {/* Sidebar Header - Only show on desktop when not mobile view */}
      {open && (
        <div className="py-3 px-4 border-b hidden lg:block">
          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>HSLU Exam Prep</span>
          </div>
        </div>
      )}

      {/* Navigation Items with ScrollArea to handle overflow */}
      <ScrollArea className="flex-1 h-[calc(100vh-10rem)]">
        <TooltipProvider delayDuration={100}>
          <nav className="space-y-1 px-2 py-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                item.submenu?.some(subItem => pathname === subItem.href);
              const hasSubmenu = Boolean(item.submenu && item.submenu.length > 0);
              const isExpanded = expandedItem === item.title;

              return (
                <div key={item.title}>
                  {/* Main nav item */}
                  {open ? (
                    <Button
                      asChild={!hasSubmenu}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-between mb-1",
                        isActive && "font-medium"
                      )}
                      onClick={hasSubmenu ? () => toggleSubmenu(item.title) : undefined}
                    >
                      {hasSubmenu ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            {item.icon}
                            <span className="ml-3">{item.title}</span>
                          </div>
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "transform rotate-90"
                          )} />
                        </div>
                      ) : (
                        <Link href={item.href} className="flex items-center w-full">
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </Link>
                      )}
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant={isActive ? "secondary" : "ghost"}
                          size="icon"
                          className="w-full h-10 mb-1"
                        >
                          <Link href={item.href}>
                            {item.icon}
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Submenu items */}
                  {hasSubmenu && open && item.submenu && (
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pl-9 space-y-1"
                        >
                          {item.submenu.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            
                            return (
                              <li key={subItem.title}>
                                <Button
                                  asChild
                                  variant={isSubActive ? "secondary" : "ghost"}
                                  className={cn(
                                    "w-full justify-start h-9",
                                    isSubActive && "font-medium"
                                  )}
                                >
                                  <Link href={subItem.href}>
                                    {subItem.title}
                                  </Link>
                                </Button>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
        </TooltipProvider>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="p-3 mt-auto border-t">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start",
            open ? "px-3" : "px-0 justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {open && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </>
  );
}