"use client";
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { 
  BookOpen, 
  GraduationCap, 
  ListChecks, 
  Settings, 
  PlusCircle,
  ChevronLeft,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PracticeHistory } from './history/PracticeHistory';

interface SidebarNavItem {
  title: string;
  key: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface PracticeQuestionsLayoutProps {
  children: React.ReactNode;
  courses: {
    id: string;
    name: string;
    color: string;
  }[];
}

export function PracticeQuestionsLayout({ 
  children,
  courses 
}: PracticeQuestionsLayoutProps) {
  const pathname = usePathname();
  const [activeView, setActiveView] = React.useState<string>('question-sets');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  // Memoize children to prevent unnecessary re-renders
  const memoizedChildren = React.useMemo(() => children, [children]);
  
  // Memoize courses to prevent unnecessary re-renders
  const memoizedCourses = React.useMemo(() => courses, [courses]);
  
  // Define sidebar navigation items with keys instead of hrefs
  const sidebarNavItems: SidebarNavItem[] = React.useMemo(() => [
    {
      title: "Question Sets",
      key: "question-sets",
      icon: <ListChecks className="h-5 w-5" />,
      active: activeView === "question-sets"
    },
    {
      title: "History",
      key: "history",
      icon: <BookOpen className="h-5 w-5" />,
      active: activeView === "history"
    },
    {
      title: "Courses",
      key: "courses",
      icon: <GraduationCap className="h-5 w-5" />,
      active: activeView === "courses"
    },
    {
      title: "Settings",
      key: "settings",
      icon: <Settings className="h-5 w-5" />,
      active: activeView === "settings"
    }
  ], [activeView]);
  
  // Handle navigation item click
  const handleNavItemClick = React.useCallback((key: string) => {
    setActiveView(key);
    setSidebarOpen(false);
  }, []);
  
  // Handle tab change on mobile
  const handleTabChange = React.useCallback((value: string) => {
    setActiveView(value);
  }, []);
  
  // Initialize activeView based on pathname
  React.useEffect(() => {
    if (pathname === "/practice-questions") {
      setActiveView("question-sets");
    }
    // We don't need other route checks since we're handling everything in-component
  }, [pathname]);
  
  // Check if we're on a specific question detail page
  const isQuestionDetail = React.useMemo(() => 
    pathname.includes('/practice-questions/') && 
    pathname !== "/practice-questions", 
  [pathname]);
  
  // Toggle sidebar on mobile
  const toggleSidebar = React.useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Component to render course list in sidebar
  const CourseList = React.memo(() => (
    <div className="space-y-3 mt-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">Your courses</h4>
      </div>
      <ScrollArea className="h-[180px]">
        <div className="space-y-1">
          {memoizedCourses.map((course) => (
            <button 
              key={course.id}
              onClick={() => {
                setActiveView("question-sets");
                // You may want to add logic here to filter by course
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left"
            >
              <div 
                className="h-3 w-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: course.color }} 
              />
              <span className="truncate">{course.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  ));
  
  // Render content based on activeView
  const renderContent = React.useCallback(() => {
    switch (activeView) {
      case 'history':
        return <PracticeHistory courses={memoizedCourses} />;
      case 'question-sets':
        return memoizedChildren;
      case 'courses':
        // You would implement a Courses component here
        return <div>Courses Content</div>;
      case 'settings':
        // You would implement a Settings component here
        return <div>Settings Content</div>;
      default:
        return memoizedChildren;
    }
  }, [activeView, memoizedChildren, memoizedCourses]);
  
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Top header - visible on all screen sizes */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center md:w-1/3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <ListChecks className="h-5 w-5" />
            </Button>
          </div>
          <h1 className="text-xl font-semibold text-center md:w-1/3 mx-auto">Your Practice Questions Environment</h1>
          <div className="md:w-1/3"></div>
        </div>
      </header>

      <div className="container flex-1 items-start pt-4 md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed top-14 z-50 h-[calc(100dvh-3.5rem)] w-full max-w-[240px] border-r bg-background p-4 transition-transform duration-300 md:static md:z-0 md:block md:translate-x-0 md:p-0 md:pr-4",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <Card className="h-full overflow-hidden">
            <ScrollArea className="h-full">
              <CardContent className="p-4 pt-6">
                <nav className="grid gap-2 mb-6">
                  {sidebarNavItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleNavItemClick(item.key)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left",
                        item.active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </button>
                  ))}
                </nav>
                
                <Separator className="my-4" />
                
                <CourseList />
              </CardContent>
            </ScrollArea>
            <CardFooter className="border-t bg-muted/40 p-4">
              <Button variant="outline" asChild className="w-full gap-2 h-9">
                <Link href="/dashboard">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </aside>
        
        {/* Main content */}
        <main className="flex w-full flex-col overflow-hidden">
          {/* Mobile tabs navigation */}
          <div className="md:hidden mb-6">
            <Tabs 
              value={activeView} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 w-full h-11">
                <TabsTrigger value="question-sets" className="flex flex-col gap-1 h-full py-1">
                  <ListChecks className="h-4 w-4" />
                  <span className="text-[10px]">Sets</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex flex-col gap-1 h-full py-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-[10px]">History</span>
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex flex-col gap-1 h-full py-1">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-[10px]">Courses</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex flex-col gap-1 h-full py-1">
                  <Settings className="h-4 w-4" />
                  <span className="text-[10px]">Settings</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Show breadcrumb on question detail pages */}
          {isQuestionDetail && (
            <div className="mb-6">
              <Button variant="outline" size="sm" onClick={() => setActiveView("question-sets")} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Question Sets
              </Button>
            </div>
          )}
          
          {/* Content area */}
          <div className="w-full transition-all duration-300 ease-in-out">
            <main className="p-4 md:p-6">
              {renderContent()}
            </main>
          </div>
        </main>
      </div>

      {/* Mobile quick action button */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

export default React.memo(PracticeQuestionsLayout);