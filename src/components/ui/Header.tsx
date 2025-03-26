'use client'

import { useState, useEffect } from "react"
import './animations.css' // Import custom animations
import Link from "next/link"
import { MainNav } from "@/components/ui/MainNav"
import { MobileNav } from "@/components/ui/MobileNav"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { LucideLogOut, LucideSettings, LucideUser } from "lucide-react"
import { useUserStore, useLogout } from "@/store/userStore" // Import Zustand store and useLogout hook

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  
  // Get user state from Zustand store using individual selectors
  const user = useUserStore(state => state.user)
  const isAuthenticated = useUserStore(state => state.isAuthenticated)
  
  // Use the new useLogout hook that handles both logout and navigation
  const handleLogout = useLogout()
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "US"
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : ""
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : ""
    return firstInitial + lastInitial || "US"
  }

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-200 ${
        scrolled 
          ? "bg-indigo-900/95 supports-[backdrop-filter]:bg-indigo-900/90 text-white shadow-md" 
          : "bg-gradient-to-r from-indigo-700 to-blue-600 text-white supports-[backdrop-filter]:bg-opacity-90"
      }`}
    >
      {/* Added px-4 or px-6 to ensure spacing from edges */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex h-16 items-center justify-between">
        <div className="flex items-center gap-x-4">
          {/* Mobile Nav - With fixed orange color */}
          <div className="relative z-20 sm:hidden text-orange-500">
            <MobileNav />
          </div>
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
                <span className="text-primary-foreground font-bold text-sm">HS</span>
              </div>
            </motion.div>
            <motion.span 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="hidden sm:inline-block font-bold text-xl relative"
            >
              <span className="animate-text-gradient bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-cyan-400 to-pink-500 bg-clip-text text-transparent bg-300% font-bold">
                HSLU Data Science
              </span>
            </motion.span>
          </Link>
        </div>
        
        <MainNav />
        
        <div className="flex items-center justify-end gap-x-4">
          {isAuthenticated && user ? (
            // User is logged in - show avatar with dropdown
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full overflow-hidden border border-muted">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profilePicture || "/placeholder-avatar.jpg"} alt={user.firstName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4 border-b">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      {user.program && (
                        <p className="text-xs text-muted-foreground">
                          Program: {user.program}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <div className="p-2">
                    <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
                      <Link href="/profile" className="flex items-center gap-2 w-full">
                        <LucideUser className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
                      <Link href="/settings" className="flex items-center gap-2 w-full">
                        <LucideSettings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500"
                      onClick={handleLogout}
                    >
                      <LucideLogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ) : (
            // User is not logged in - show login and register buttons with mobile-specific styling
            <div className="flex items-center gap-x-3">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}