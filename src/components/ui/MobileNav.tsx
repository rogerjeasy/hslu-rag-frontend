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
  LucideMenu, 
  LucideBook, 
  LucideMessageSquare, 
  LucideLayoutDashboard, 
  LucideUser, 
  LucideGraduationCap,
  LucideLogOut,
  LucideSettings,
  LucideX
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
 
  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LucideLayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/courses",
      label: "Courses",
      icon: LucideBook,
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
      icon: LucideGraduationCap,
      active: pathname === "/practice",
    },
  ]
 
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden relative h-9 w-9 rounded-full">
          <LucideMenu className="h-5 w-5" />
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
              <LucideX className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="p-6">
          <div className="flex flex-col items-center gap-4 mb-6 pb-6 border-b">
            <Avatar className="h-16 w-16 border-2 border-muted">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">US</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-medium">Student Name</h3>
              <p className="text-sm text-muted-foreground">student@hslu.ch</p>
            </div>
          </div>
          
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
                <LucideUser className="mr-3 h-5 w-5 opacity-70" aria-hidden="true" />
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
              >
                <LucideSettings className="mr-3 h-5 w-5 opacity-70" aria-hidden="true" />
                Settings
              </Link>
              <button
                className="w-full flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-red-100 text-red-600 hover:text-red-700"
                aria-label="Log out from your account"
              >
                <LucideLogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}