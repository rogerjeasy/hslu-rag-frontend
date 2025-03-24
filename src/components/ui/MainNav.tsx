'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { motion } from "framer-motion"
import React from "react"
import { useUserStore } from "@/store/userStore" // Import Zustand store

const features = [
  {
    title: "AI Study Assistant",
    href: "/chat",
    description: "Get instant, accurate answers to your questions based on official HSLU course materials.",
    icon: "💬",
    highlight: true,
  },
  {
    title: "Study Guide Generator",
    href: "/study-guides",
    description: "Create personalized exam preparation summaries and structured study plans.",
    icon: "📚",
  },
  {
    title: "Practice Assessment",
    href: "/practice-questions",
    description: "Test your knowledge with course-specific practice questions and detailed explanations.",
    icon: "✓",
  },
  {
    title: "Knowledge Analytics",
    href: "/knowledge-gaps",
    description: "Identify your knowledge gaps with AI-powered learning analytics and targeted recommendations.",
    icon: "📊",
  },
  {
    title: "Concept Explorer",
    href: "/materials",
    description: "Master complex data science concepts through interactive explanations and practical examples.",
    icon: "🧠",
  },
  {
    title: "Collaborative Learning",
    href: "/groups",
    description: "Form study groups, share resources, and learn collaboratively with your classmates.",
    icon: "👥",
  },
]

export function MainNav() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState<string | null>(null)
  
  // Get authentication state and user from Zustand store
  const isAuthenticated = useUserStore(state => state.isAuthenticated)
  const user = useUserStore(state => state.user)
  
  // Check if user has admin role
  const isAdmin = user?.role?.includes("admin") || false

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        {/* Public navigation items - only visible when not authenticated */}
        {!isAuthenticated && (
          <>
            <NavigationMenuItem>
              <Link href="/" passHref legacyBehavior>
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent transition-all duration-200 hover:bg-accent/50",
                    pathname === "/" && "bg-accent/40 text-accent-foreground font-medium"
                  )}
                >
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Home
                  </motion.div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/about-us" passHref legacyBehavior>
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent transition-all duration-200 hover:bg-accent/50",
                    pathname === "/about-us" && "bg-accent/40 text-accent-foreground font-medium"
                  )}
                >
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    About Us
                  </motion.div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}

        {/* Features - visible to all */}
        <NavigationMenuItem>
          <Link href="/features" passHref legacyBehavior>
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent transition-all duration-200 hover:bg-accent/50",
                pathname === "/features" && "bg-accent/40 text-accent-foreground font-medium"
              )}
            >
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Features
              </motion.div>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
       
        {/* Items only visible to authenticated users */}
        {isAuthenticated && (
          <>
            <NavigationMenuItem>
              <Link href="/dashboard" passHref legacyBehavior>
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent transition-all duration-200 hover:bg-accent/50",
                    pathname === "/dashboard" && "bg-accent/40 text-accent-foreground font-medium"
                  )}
                >
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Dashboard
                  </motion.div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
           
            <NavigationMenuItem 
              onMouseEnter={() => setActiveItem("courses")} 
              onMouseLeave={() => setActiveItem(null)}
            >
              <NavigationMenuTrigger 
                className={cn(
                  "bg-transparent transition-all duration-200 hover:bg-accent/50",
                  pathname.includes("/courses") && "bg-accent/40 text-accent-foreground font-medium",
                  activeItem === "courses" && "bg-accent/30"
                )}
              >
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  AI Learning Hub
                </motion.div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <motion.ul 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
                >
                  {features.map((feature) => (
                    <ListItem
                      key={feature.title}
                      title={feature.title}
                      href={feature.href}
                      icon={feature.icon}
                      className={feature.highlight ? "bg-primary/5 border-primary/20" : ""}
                    >
                      {feature.description}
                    </ListItem>
                  ))}
                </motion.ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Admin-only navigation item */}
            {isAdmin && (
              <NavigationMenuItem>
                <Link href="/application-management/dashboard" passHref legacyBehavior>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent transition-all duration-200 hover:bg-accent/50",
                      pathname === "/application-management/dashboard" && "bg-accent/40 text-accent-foreground font-medium"
                    )}
                  >
                    <motion.div 
                      className="flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Application Management
                    </motion.div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: string }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <span className="text-sm font-medium leading-none">{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </motion.li>
  )
})
ListItem.displayName = "ListItem"