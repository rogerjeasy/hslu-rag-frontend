"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen, 
  GraduationCap, 
  Settings, 
  LogOut,
  ChevronRight,
  X,
  Home,
  MessageSquare,
  BookMarked,
  CheckSquare,
  BarChart3,
  Menu,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useUserStore, useLogout } from '@/store/userStore';

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
  
  // Get user state from Zustand store using individual selectors - same as in Header
  const user = useUserStore(state => state.user);
  const isAuthenticated = useUserStore(state => state.isAuthenticated);

  // Navigation items with conditional display based on authentication
  const navItems: NavItem[] = isAuthenticated && user ? [
    // Authenticated user menu items
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5 text-primary" />
    },
    {
      title: "Courses",
      href: "/courses",
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      submenu: [
        { title: "Machine Learning", href: "/courses/machine-learning" },
        { title: "Data Science 101", href: "/courses/data-science-101" },
        { title: "Big Data", href: "/courses/big-data" }
      ]
    },
    {
      title: "Chat Assistant",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5 text-primary" />
    },
    {
      title: "Study Guides",
      href: "/study-guides",
      icon: <BookMarked className="h-5 w-5 text-primary" />
    },
    {
      title: "Practice Questions",
      href: "/practice-questions",
      icon: <CheckSquare className="h-5 w-5 text-primary" />
    },
    {
      title: "Knowledge Gap Analytics",
      href: "/knowledge-gaps",
      icon: <BarChart3 className="h-5 w-5 text-primary" />
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 text-primary" />
    }
  ] : [
    // Non-authenticated user menu items
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 text-primary" />
    },
    {
      title: "AI Learning Hub",
      href: "/learning-hub",
      icon: <GraduationCap className="h-5 w-5 text-primary" />,
      submenu: [
        { title: "AI Study Assistant", href: "/learning-hub/ai-assistant" },
        { title: "Study Guide Generator", href: "/learning-hub/guide-generator" },
        { title: "Practice Assessment", href: "/learning-hub/practice-assessment" },
        { title: "Knowledge Analytics", href: "/learning-hub/analytics" },
        { title: "Concept Explorer", href: "/learning-hub/concept-explorer" },
        { title: "Collaborative Learning", href: "/learning-hub/collaborative" }
      ]
    },
    {
      title: "About Us",
      href: "/about",
      icon: <Info className="h-5 w-5 text-primary" />
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

  // Get current page title from pathname
  const getCurrentPageTitle = () => {
    const activeItem = navItems.find(item => 
      pathname === item.href || item.submenu?.some(subItem => pathname === subItem.href)
    );
    
    if (!activeItem) return "Dashboard";
    
    if (activeItem.submenu) {
      const activeSubItem = activeItem.submenu.find(subItem => pathname === subItem.href);
      return activeSubItem ? activeSubItem.title : activeItem.title;
    }
    
    return activeItem.title;
  };

  return (
    <>
      {/* Mobile Header Bar (only show when sidebar is closed on mobile) */}
      {!isDesktop && !open && (
        <div className="fixed top-0 left-0 right-0 z-30 flex items-center px-4 h-16 bg-card border-b shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4 text-orange-500" // Matching the orange color from header
            onClick={() => onOpenChange(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold">{getCurrentPageTitle()}</span>
          </div>
        </div>
      )}
      
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
            isAuthenticated={isAuthenticated} 
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
                  <span>HSLU Data Science</span>
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
                isAuthenticated={isAuthenticated}
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
  pathname,
  isAuthenticated
}: { 
  navItems: NavItem[],
  open: boolean,
  expandedItem: string | null,
  toggleSubmenu: (title: string) => void,
  pathname: string,
  isAuthenticated: boolean
}) {
  const handleLogout = useLogout();
  
  return (
    <>
      {/* Sidebar Header - Only show on desktop when not mobile view */}
      {open && (
        <div className="py-3 px-4 border-b hidden lg:block">
          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>HSLU Data Science</span>
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
                <div key={item.title} className="relative group">
                  {/* Main nav item */}
                  {open ? (
                    <Button
                      asChild={!hasSubmenu}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-between mb-1 transition-all",
                        isActive && "font-medium bg-primary/10",
                        !isActive && "hover:bg-primary/5"
                      )}
                      onClick={hasSubmenu ? () => toggleSubmenu(item.title) : undefined}
                    >
                      {hasSubmenu ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 flex items-center justify-center">
                              {item.icon}
                            </div>
                            <span>{item.title}</span>
                          </div>
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "transform rotate-90"
                          )} />
                        </div>
                      ) : (
                        <Link href={item.href} className="flex items-center w-full">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 flex items-center justify-center">
                              {item.icon}
                            </div>
                            <span>{item.title}</span>
                          </div>
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
                          className={cn(
                            "w-full h-12 mb-1 transition-all flex items-center justify-center",
                            isActive && "bg-primary/10",
                            !isActive && "hover:bg-primary/5"
                          )}
                        >
                          <Link href={hasSubmenu ? item.submenu?.[0].href || item.href : item.href}>
                            <div className="flex-shrink-0 flex items-center justify-center">
                              {item.icon}
                            </div>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 h-12 w-1 bg-primary rounded-r-full" />
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
                          className="overflow-hidden pl-10 space-y-1"
                        >
                          {item.submenu.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            
                            return (
                              <li key={subItem.title} className="relative">
                                <Button
                                  asChild
                                  variant={isSubActive ? "secondary" : "ghost"}
                                  className={cn(
                                    "w-full justify-start h-9 text-sm",
                                    isSubActive ? "font-medium bg-primary/10" : "hover:bg-primary/5",
                                    "transition-all"
                                  )}
                                >
                                  <Link href={subItem.href} className="flex items-center">
                                    <span className="ml-1">{subItem.title}</span>
                                  </Link>
                                </Button>
                                {isSubActive && (
                                  <div className="absolute left-0 top-0 h-9 w-1 bg-primary rounded-r-full" />
                                )}
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

      {/* Sidebar Footer - Show Login/Register for non-authenticated users */}
      <div className="p-3 mt-auto border-t">
        {isAuthenticated ? (
          // Logout button for authenticated users
          <Button 
            variant="ghost" 
            className={cn(
              "w-full transition-all",
              open ? "justify-start px-3" : "justify-center",
              "hover:bg-destructive/10 hover:text-destructive"
            )}
            onClick={handleLogout}
          >
            {open ? (
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center">
                    <LogOut className="h-5 w-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            )}
          </Button>
        ) : (
          // Login/Register buttons for non-authenticated users
          <div className={cn("space-y-2", !open && "flex flex-col items-center")}>
            <Link href="/login" className="w-full">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full transition-all bg-green-500 text-white hover:bg-green-600",
                  !open && "h-10 w-10 p-0"
                )}
              >
                {open ? (
                  <span>Login</span>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>L</span>
                    </TooltipTrigger>
                    <TooltipContent side="right">Login</TooltipContent>
                  </Tooltip>
                )}
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button 
                variant="default" 
                className={cn(
                  "w-full transition-all",
                  !open && "h-10 w-10 p-0"
                )}
              >
                {open ? (
                  <span>Register</span>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>R</span>
                    </TooltipTrigger>
                    <TooltipContent side="right">Register</TooltipContent>
                  </Tooltip>
                )}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}