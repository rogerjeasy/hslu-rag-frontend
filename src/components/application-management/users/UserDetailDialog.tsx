// src/components/application-management/users/UserDetailDialog.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  GraduationCap,
  Book,
  Activity,
  AtSign,
  Key
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type UserRole = 'admin' | 'instructor' | 'student'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  enrolledCourses?: string[]
  status: 'active' | 'inactive' | 'pending'
  lastActive: string
}

// Sample activity log data
const USER_ACTIVITY = [
  { id: "1", timestamp: "2025-03-21T10:15:32Z", action: "Logged in", details: "IP: 192.168.1.1, Browser: Chrome" },
  { id: "2", timestamp: "2025-03-21T10:45:17Z", action: "Accessed Machine Learning course", details: "Viewed lecture 3 materials" },
  { id: "3", timestamp: "2025-03-21T11:30:05Z", action: "Completed quiz", details: "Machine Learning: Week 3 Quiz, Score: 85%" },
  { id: "4", timestamp: "2025-03-20T14:22:41Z", action: "Submitted assignment", details: "Data Visualization: Homework 2" },
  { id: "5", timestamp: "2025-03-20T16:15:28Z", action: "Changed password", details: "Via account settings" },
]

interface UserDetailDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
  const [activeTab, setActiveTab] = useState('profile')
  
  // Format date for readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'instructor':
        return 'bg-blue-100 text-blue-800'
      case 'student':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Get the role icon
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-5 w-5" />
      case 'instructor':
        return <GraduationCap className="h-5 w-5" />
      case 'student':
        return <User className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5" /> 
            {user.firstName} {user.lastName}
          </DialogTitle>
          <DialogDescription>
            View and manage user details, courses, and activity
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TabsContent value="profile" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                          <span className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </Badge>
                        <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Full Name</p>
                            <p>{user.firstName} {user.lastName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p>{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Last Active</p>
                            <p>{formatDate(user.lastActive)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Account Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <AtSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Username</p>
                            <p>{user.email.split('@')[0]}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Account Created</p>
                            <p>January 15, 2025</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Password Status</p>
                            <p>Last updated 30 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            )}
            
            {activeTab === "courses" && (
              <motion.div
                key="courses"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TabsContent value="courses" className="mt-0">
                  {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {user.role === 'instructor' ? 'Teaching Courses' : 'Enrolled Courses'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.enrolledCourses.map((course, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-3 p-4 border rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <Book className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-medium">{course}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.role === 'instructor' 
                                  ? 'Responsible for course materials and assessments'
                                  : 'Currently in progress'
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Book className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Courses Found</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        {user.role === 'student' 
                          ? 'This user is not enrolled in any courses yet.'
                          : user.role === 'instructor'
                            ? 'This instructor is not teaching any courses yet.'
                            : 'No course information available for this user.'
                        }
                      </p>
                    </div>
                  )}
                </TabsContent>
              </motion.div>
            )}
            
            {activeTab === "activity" && (
              <motion.div
                key="activity"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TabsContent value="activity" className="mt-0">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Recent Activity</h3>
                    <div className="space-y-4">
                      {USER_ACTIVITY.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-4 p-4 border rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <Activity className="h-5 w-5 text-primary mt-0.5" />
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(activity.timestamp)}
                              </p>
                            </div>
                            <p className="text-sm">{activity.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {user.role === "student" && (
            <Button variant="outline" className="sm:mr-auto">View Progress Report</Button>
          )}
          {user.status === "active" ? (
            <Button variant="destructive">Deactivate Account</Button>
          ) : (
            <Button variant="default">Activate Account</Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}