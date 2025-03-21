'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  UserCircle, 
  UserCog, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal,
  Mail,
  Info,
  Calendar 
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useUserContext } from './UserContext'
import { User } from '@/types/user.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserTableProps {
  onChangeRole: (user: User) => void
}

export function UserTable({ onChangeRole }: UserTableProps) {
  const { filteredUsers, searchTerm, selectedRole } = useUserContext()
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<keyof User>('accountCreatedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Check if we're filtering
  const isFiltering = !!searchTerm || !!selectedRole

  // Toggle user details expansion
  const toggleExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId)
  }
  
  // Handle sorting
  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }
  
  // Sort users based on current sort criteria
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valueA = a[sortColumn]
    const valueB = b[sortColumn]
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA)
    }
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' 
        ? valueA - valueB 
        : valueB - valueA
    }
    
    return 0
  })
  
  // Render role badge with appropriate color
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500 hover:bg-red-600">Admin</Badge>
      case 'instructor':
        return <Badge variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-100">Instructor</Badge>
      case 'student':
        return <Badge variant="secondary" className="bg-gray-200 text-gray-600 hover:bg-gray-300">Student</Badge>
      default:
        return <Badge>{role}</Badge>
    }
  }
  
  // Format date to relative time
  const formatDate = (dateString: string) => {
    try {
      // Make sure we have a valid date string
      if (!dateString) {
        return 'Unknown date';
      }
      
      // Parse the date string and check if it's valid
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error with date';
    }
  }
  
  // Render sort indicator
  const renderSortIndicator = (column: keyof User) => {
    if (sortColumn !== column) return null
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4" /> 
      : <ChevronDown className="ml-1 h-4 w-4" />
  }

  // Empty State Component
  const EmptyState = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl opacity-50"></div>
        <div className="relative bg-background border border-border/30 shadow-sm rounded-full p-6 mb-6">
          {isFiltering ? (
            <svg
              className="h-12 w-12 text-muted-foreground mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          ) : (
            <UserCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          )}
        </div>
      </div>

      <h3 className="text-xl font-medium tracking-tight mb-2">
        {isFiltering ? "No matching users found" : "No users available"}
      </h3>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {isFiltering
          ? "Try adjusting your filters or search criteria to find what you're looking for."
          : "No users have been registered in the system yet."}
      </p>
      
      {isFiltering && (
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset All Filters
        </Button>
      )}

      {/* Decorative elements */}
      <div className="hidden md:block absolute -z-10">
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/3 transform -translate-x-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
      </div>
    </motion.div>
  )

  // If no users, show empty state
  if (sortedUsers.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[250px] cursor-pointer"
              onClick={() => handleSort('username')}
            >
              <div className="flex items-center">
                User
                {renderSortIndicator('username')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center">
                Email
                {renderSortIndicator('email')}
              </div>
            </TableHead>
            <TableHead 
              className="hidden md:table-cell cursor-pointer"
              onClick={() => handleSort('role')}
            >
              <div className="flex items-center">
                Role
                {renderSortIndicator('role')}
              </div>
            </TableHead>
            <TableHead 
              className="hidden lg:table-cell cursor-pointer"
              onClick={() => handleSort('accountCreatedAt')}
            >
              <div className="flex items-center">
                Joined
                {renderSortIndicator('accountCreatedAt')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user, index) => [
            <motion.tr
              key={`row-${user.uid}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0"
                    onClick={() => toggleExpand(user.uid)}
                  >
                    {expandedUser === user.uid ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @{user.username}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate max-w-[200px]">{user.email}</span>
                </div>
                <div className="md:hidden text-xs text-muted-foreground mt-1">
                  {user.role.map((role, roleIndex) => (
                    <span key={`mobile-role-${user.uid}-${roleIndex}`} className="mr-1">
                      {renderRoleBadge(role)}
                    </span>
                  ))}
                </div>
              </TableCell>
              
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {user.role.map((role, roleIndex) => (
                    <span key={`desktop-role-${user.uid}-${roleIndex}`}>
                      {renderRoleBadge(role)}
                    </span>
                  ))}
                </div>
              </TableCell>
              
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {formatDate(user.accountCreatedAt)}
                </div>
              </TableCell>
              
              <TableCell className="text-right">
                <TooltipProvider>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onChangeRole(user)}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Info className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipProvider>
              </TableCell>
            </motion.tr>,
            
            expandedUser === user.uid && (
              <motion.tr 
                key={`expanded-${user.uid}`}
                className="bg-muted/50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TableCell colSpan={5} className="p-4">
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <div>
                      <h4 className="text-sm font-medium">Bio</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.bio || "No bio provided"}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Program</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.program || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Graduation Year</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.graduationYear || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Languages</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.languages?.length 
                            ? user.languages.join(', ') 
                            : "None specified"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Interests</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.interests?.length ? (
                          user.interests.map((interest, interestIndex) => (
                            <Badge 
                              key={`interest-${user.uid}-${interestIndex}`} 
                              variant="outline" 
                              className="bg-background"
                            >
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No interests specified</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => onChangeRole(user)}>
                        <UserCog className="h-4 w-4 mr-1" />
                        Change Role
                      </Button>
                    </div>
                  </motion.div>
                </TableCell>
              </motion.tr>
            )
          ].filter(Boolean))}
        </TableBody>
      </Table>
    </div>
  )
}