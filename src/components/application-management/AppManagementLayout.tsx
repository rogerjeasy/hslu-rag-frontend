// src/components/application-management/AppManagementLayout.tsx
'use client'

import { ReactNode, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, 
  Users, 
  FileText, 
  HelpCircle, 
  FolderOpen,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AdminView } from './ApplicationManagementMainComponent'
import { useUserStore } from '@/store/userStore'
import { motion } from 'framer-motion'

interface AppManagementLayoutProps {
  children: ReactNode
  currentView: AdminView
  setCurrentView: (view: AdminView) => void
}

interface SidebarItem {
  id: AdminView
  label: string
  icon: React.ElementType
  description: string
}

export function AppManagementLayout({ 
  children, 
  currentView, 
  setCurrentView 
}: AppManagementLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = useUserStore(state => state.user)
  
  // Close mobile sidebar when view changes
  useEffect(() => {
    setMobileOpen(false)
  }, [currentView])
  
  // Close sidebar automatically on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview of application statistics'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage user accounts and roles'
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: FileText,
      description: 'Manage course content and materials'
    },
    {
      id: 'faq',
      label: 'FAQ Management',
      icon: HelpCircle,
      description: 'Manage frequently asked questions'
    },
    {
      id: 'files',
      label: 'File Management',
      icon: FolderOpen,
      description: 'Upload and manage course files'
    }
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="shadow-md"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Desktop sidebar toggle */}
      <div className="fixed bottom-4 left-4 z-50 hidden lg:block">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="shadow-md"
        >
          <ChevronRight className={cn(
            "h-5 w-5 transition-transform",
            sidebarOpen ? "rotate-180" : "rotate-0"
          )} />
        </Button>
      </div>
      
      {/* Sidebar - Desktop (controlled by sidebarOpen) and Mobile (controlled by mobileOpen) */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex-col border-r bg-card/60 backdrop-blur-sm",
          "w-64 shrink-0 overflow-y-auto no-scrollbar",
          "lg:relative lg:block",
          mobileOpen ? "flex" : "hidden lg:flex",
          !sidebarOpen && "lg:w-20"
        )}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar header with title */}
        <div className="flex h-16 items-center px-4 border-b">
          <div className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 bg-primary rounded-md",
              "transition-all duration-300"
            )}>
              <span className="text-primary-foreground font-bold text-sm">AM</span>
            </div>
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="ml-3 font-bold text-lg text-primary"
              >
                Admin Panel
              </motion.span>
            )}
          </div>
        </div>
        
        {/* Administrator info */}
        <div className={cn(
          "flex items-center px-4 py-3", 
          !sidebarOpen && "justify-center"
        )}>
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          
          {sidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Administrator
              </p>
            </div>
          )}
        </div>
        
        <Separator className="my-2" />
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4">
          <div className="space-y-1">
            <TooltipProvider>
              {sidebarItems.map((item) => (
                <Tooltip key={item.id} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={currentView === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        !sidebarOpen && "justify-center px-2",
                        currentView === item.id && "bg-primary/10 text-primary"
                      )}
                      onClick={() => setCurrentView(item.id)}
                    >
                      <item.icon className={cn(
                        "h-5 w-5",
                        !sidebarOpen && "mr-0"
                      )} />
                      {sidebarOpen && (
                        <span className="ml-3">{item.label}</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </nav>
      </motion.aside>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-y-auto p-6 lg:p-8",
        "transition-all duration-300",
        mobileOpen && "blur-sm lg:blur-none",
        sidebarOpen ? "lg:ml-0" : "lg:ml-0" // Changed from "lg:ml-64" and "lg:ml-20" to remove the gap
      )}>
        {children}
      </main>
    </div>
  )
}