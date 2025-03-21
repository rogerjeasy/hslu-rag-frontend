'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from "@/components/ui/sheet"
import { 
  Menu, 
  User, 
  LogOut,
  Settings,
  X,
  LucideLayoutDashboard,
  LucideMessageSquare,
  LucideStar,
  LucideHome,
  LucideHelpCircle,
  LucideBookOpen,
  LucideSchool
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useUserStore, useLogout } from "@/store/userStore" // Import Zustand store and useLogout hook

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  
  // Get user state from Zustand store
  const user = useUserStore(state => state.user)
  const isAuthenticated = useUserStore(state => state.isAuthenticated)
  
  // Use the useLogout hook instead of directly accessing logout
  const handleLogout = useLogout()
  
  // Check if user has admin role
  const isAdmin = user?.role?.includes("admin") || false
  
  // Function to handle logout and close mobile menu
  const onLogout = async () => {
    await handleLogout()
    setOpen(false) // Close the mobile menu after logout
  }
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "US"
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : ""
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : ""
    return firstInitial + lastInitial || "US"
  }
  
  // Routes accessible to all users (public)
  const publicRoutes = [
    {
      href: "/",
      label: "Home",
      icon: LucideHome,
      active: pathname === "/",
    },
    {
      href: "/features",
      label: "Features",
      icon: LucideStar,
      active: pathname === "/features",
    },
    {
      href: "/about-us",
      label: "About Us",
      icon: LucideHelpCircle,
      active: pathname === "/about-us",
    },
  ]
  
  // Routes accessible only to authenticated users
  const authenticatedRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LucideLayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/courses",
      label: "Courses",
      icon: LucideBookOpen,
      active: pathname.includes("/courses"),
    },
    {
      href: "/chat",
      label: "Chat Assistant",
      icon: LucideMessageSquare,
      active: pathname === "/chat",
    },
    {
      href: "/practice",
      label: "Practice Questions",
      icon: LucideSchool,
      active: pathname === "/practice",
    },
  ]
  
  // Admin-only routes
  const adminRoutes = isAdmin ? [
    {
      href: "/application-management",
      label: "Application Management",
      icon: Settings,
      active: pathname === "/application-management",
    }
  ] : []
  
  // Active routes based on authentication status and admin role
  const routes = isAuthenticated 
    ? [...publicRoutes, ...authenticatedRoutes, ...adminRoutes]
    : publicRoutes
 
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden relative h-9 w-9 rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 border-r-muted">
        <SheetHeader className="border-b p-4 text-left">
          {/* Adding SheetTitle for accessibility */}
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
                <span className="text-primary-foreground font-bold text-sm">HS</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">HSLU Data Science</span>
            </Link>
            <SheetClose className="rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="p-6">
          {isAuthenticated && user ? (
            // User profile section - only shown when logged in
            <div className="flex flex-col items-center gap-4 mb-6 pb-6 border-b">
              <Avatar className="h-16 w-16 border-2 border-muted">
                <AvatarImage src={user.profilePicture || "/placeholder-avatar.jpg"} alt={user.firstName || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.program && (
                  <p className="text-xs text-muted-foreground mt-1">Program: {user.program}</p>
                )}
                {isAdmin && (
                  <p className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full mt-2 inline-block">Admin</p>
                )}
              </div>
            </div>
          ) : (
            // Login/Register buttons - shown when not logged in
            <div className="flex flex-col gap-3 mb-6 pb-6 border-b">
              <Link 
                href="/login" 
                onClick={() => setOpen(false)}
                className="w-full"
              >
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link 
                href="/register" 
                onClick={() => setOpen(false)}
                className="w-full"
              >
                <Button variant="default" className="w-full">Register</Button>
              </Link>
            </div>
          )}
          
          <nav aria-label="Main Navigation" className="flex flex-col space-y-1">
            <AnimatePresence>
              {routes.map((route, index) => (
                <motion.div
                  key={route.href}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.15 }}
                >
                  <Link
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                      route.active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    aria-current={route.active ? "page" : undefined}
                  >
                    <route.icon className={cn(
                      "mr-3 h-5 w-5",
                      route.active ? "text-primary" : "text-foreground opacity-70"
                    )} aria-hidden="true" />
                    {route.label}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>
          
          {/* Only show account settings section when logged in */}
          {isAuthenticated && (
            <div className="mt-6 pt-6 border-t">
              <VisuallyHidden>
                <h2>Account Settings</h2>
              </VisuallyHidden>
              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="mr-3 h-5 w-5 opacity-70" aria-hidden="true" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  <Settings className="mr-3 h-5 w-5 opacity-70" aria-hidden="true" />
                  Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-red-100 text-red-600 hover:text-red-700"
                  aria-label="Log out from your account"
                >
                  <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}