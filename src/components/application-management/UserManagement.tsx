'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { UserCircle, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { useUserContext } from './users/UserContext'
import { User, UserRole } from '@/types/user.types'
import { UserTable } from './users/UserTable'
import { UserRoleDialog } from './users/UserRoleDialog'
import { UserSearchFilter } from './users/UserSearchFilter'
import { useToast } from "@/components/ui/toast-provider"
import { UserSkeleton } from './users/UserSkeleton'
import { UserProvider } from './users/UserContext'

// Main component that uses the UserProvider
function UserManagementContent() {
  const [userToUpdateRole, setUserToUpdateRole] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { 
    setSearchTerm, 
    filteredUsers, 
    isLoading,
    refreshUsers,
    updateUserRole,
    error
  } = useUserContext()
  
  const { toast } = useToast()

  // Ensure users are loaded when component mounts
  useEffect(() => {
    refreshUsers()
  }, [refreshUsers])

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const handleChangeRole = useCallback((user: User) => {
    setUserToUpdateRole(user)
  }, [])

  const handleRoleUpdate = useCallback(async (role: UserRole) => {
    if (!userToUpdateRole) return
    
    try {
      setIsSubmitting(true)
      
      await updateUserRole(userToUpdateRole.uid, role)
      
      setUserToUpdateRole(null)
      
      toast({
        title: "Role updated",
        description: `User role has been updated successfully.`,
      })
    } catch (error) {
      console.error('Role update error:', error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "There was an error updating the user role.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [userToUpdateRole, updateUserRole, toast])

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [setSearchTerm])

  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="rounded-full bg-red-100 p-6 mb-4">
        <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold tracking-tight mb-2">Something went wrong</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {error || "We couldn't load user data. Please try again later."}
      </p>
      <Button onClick={() => refreshUsers()}>
        Try Again
      </Button>
    </div>
  )

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div variants={cardVariants}>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage user accounts and permissions for the RAG system.
        </p>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center">
                  <UserCircle className="h-5 w-5 mr-2" />
                  System Users
                </CardTitle>
                <CardDescription>
                  Manage user accounts and assign roles
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onChange={handleSearchChange}
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:w-auto w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>
            
            {showFilters && (
              <UserSearchFilter />
            )}
            
            {isLoading ? (
              <UserSkeleton />
            ) : error ? (
              <ErrorState />
            ) : (
              <UserTable 
                onChangeRole={handleChangeRole}
              />
            )}
          </CardContent>
          
          {!isLoading && !error && filteredUsers.length > 0 && (
            <CardFooter className="flex flex-col sm:flex-row justify-between border-t p-4 text-sm text-muted-foreground">
              <div>Showing users with access to the RAG system</div>
              <div>Total: {filteredUsers.length} users</div>
            </CardFooter>
          )}
        </Card>
      </motion.div>

      <UserRoleDialog 
        open={!!userToUpdateRole} 
        onOpenChange={(open) => !open && setUserToUpdateRole(null)}
        onConfirm={handleRoleUpdate}
        isUpdating={isSubmitting}
        userName={userToUpdateRole ? `${userToUpdateRole.firstName} ${userToUpdateRole.lastName}` : undefined}
        currentRole={userToUpdateRole?.role}
      />
    </motion.div>
  )
}

// Main exported component that wraps with UserProvider
export function UserManagement() {
  return (
    <UserProvider>
      <UserManagementContent />
    </UserProvider>
  )
}