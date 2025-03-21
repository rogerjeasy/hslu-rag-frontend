// src/components/application-management/UserManagement.tsx
'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Mail, 
  User, 
  ShieldCheck,
  GraduationCap
} from "lucide-react"
import { UserDetailDialog } from "./users/UserDetailDialog"
import { AddUserDialog } from "./users/AddUserDialog"
import { motion } from "framer-motion"

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

// Sample user data
const USERS_DATA: User[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hslu.ch",
    role: "admin",
    status: "active",
    lastActive: "2025-03-20T15:32:00Z"
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Schmidt",
    email: "m.schmidt@hslu.ch",
    role: "instructor",
    enrolledCourses: ["Machine Learning", "Data Visualization"],
    status: "active",
    lastActive: "2025-03-19T09:15:00Z"
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Weber",
    email: "emma.weber@hslu.ch",
    role: "student",
    enrolledCourses: ["Statistical Methods", "Database Systems", "Big Data"],
    status: "active",
    lastActive: "2025-03-21T11:20:00Z"
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Müller",
    email: "d.mueller@hslu.ch",
    role: "student",
    enrolledCourses: ["Statistical Methods", "Machine Learning"],
    status: "inactive",
    lastActive: "2025-03-15T14:45:00Z"
  },
  {
    id: "5",
    firstName: "Lisa",
    lastName: "Hoffmann",
    email: "lisa.hoffmann@hslu.ch",
    role: "instructor",
    enrolledCourses: ["Statistical Methods", "Data Mining"],
    status: "active",
    lastActive: "2025-03-21T08:30:00Z"
  },
  {
    id: "6",
    firstName: "Thomas",
    lastName: "Becker",
    email: "t.becker@hslu.ch",
    role: "student",
    enrolledCourses: ["Database Systems", "Big Data"],
    status: "pending",
    lastActive: "2025-03-18T16:10:00Z"
  },
  {
    id: "7",
    firstName: "Anna",
    lastName: "Klein",
    email: "anna.klein@hslu.ch",
    role: "student",
    enrolledCourses: ["Machine Learning", "Data Visualization", "Statistical Methods"],
    status: "active",
    lastActive: "2025-03-20T13:25:00Z"
  },
  {
    id: "8",
    firstName: "Markus",
    lastName: "Wagner",
    email: "m.wagner@hslu.ch",
    role: "instructor",
    enrolledCourses: ["Database Systems", "Big Data"],
    status: "active",
    lastActive: "2025-03-19T15:50:00Z"
  },
  {
    id: "9",
    firstName: "Julia",
    lastName: "Schneider",
    email: "j.schneider@hslu.ch",
    role: "student",
    enrolledCourses: ["Data Visualization", "Statistical Methods"],
    status: "active",
    lastActive: "2025-03-21T10:15:00Z"
  },
  {
    id: "10",
    firstName: "Peter",
    lastName: "Zimmermann",
    email: "p.zimmermann@hslu.ch",
    role: "admin",
    status: "active",
    lastActive: "2025-03-20T16:45:00Z"
  },
  {
    id: "11",
    firstName: "Nicole",
    lastName: "Fischer",
    email: "n.fischer@hslu.ch",
    role: "student",
    enrolledCourses: ["Machine Learning", "Big Data"],
    status: "inactive",
    lastActive: "2025-03-17T11:30:00Z"
  },
  {
    id: "12",
    firstName: "Andreas",
    lastName: "Wolf",
    email: "a.wolf@hslu.ch",
    role: "student",
    enrolledCourses: ["Database Systems", "Statistical Methods"],
    status: "active",
    lastActive: "2025-03-21T09:40:00Z"
  }
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(1)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailDialogOpen, setIsUserDetailDialogOpen] = useState<boolean>(false)
  
  const itemsPerPage = 5
  
  // Filter users based on search term and filters
  const filteredUsers = USERS_DATA.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })
  
  // Paginate users
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  
  // Handle role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      case 'instructor':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'student':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }
  
  // Handle status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }
  
  // Get the role icon
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 mr-1" />
      case 'instructor':
        return <GraduationCap className="h-4 w-4 mr-1" />
      case 'student':
        return <User className="h-4 w-4 mr-1" />
      default:
        return <User className="h-4 w-4 mr-1" />
    }
  }

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
  
  // Handle pagination click
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
    }
  }
  
  // Open user detail modal
  const handleUserDetail = (user: User) => {
    setSelectedUser(user)
    setIsUserDetailDialogOpen(true)
  }

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
          Manage user accounts, roles, and access permissions.
        </p>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage all user accounts in the system
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddUserDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleUserDetail(user)}
                      >
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                            <span className="flex items-center">
                              {getRoleIcon(user.role)}
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(user.lastActive)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                handleUserDetail(user)
                              }}>
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit user</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                              >
                                Deactivate account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(page - 1)
                        }}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(pageNum)
                          }}
                          isActive={pageNum === page}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(page + 1)
                        }}
                        className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* User Detail Dialog */}
      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          open={isUserDetailDialogOpen}
          onOpenChange={setIsUserDetailDialogOpen}
        />
      )}

      {/* Add User Dialog */}
      <AddUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
      />
    </motion.div>
  )
}