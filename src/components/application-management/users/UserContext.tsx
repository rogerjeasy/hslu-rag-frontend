'use client'

import React, { ReactNode, useEffect } from 'react'
import { useUserManagementStore } from '@/store/userManagementStore'

type UserProviderProps = {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const fetchUsers = useUserManagementStore(state => state.fetchUsers)
  const isLoading = useUserManagementStore(state => state.isLoading)
  const users = useUserManagementStore(state => state.users)
 
  // Fetch users on component mount
  useEffect(() => {
    // Only fetch if we don't already have users and aren't currently loading
    if (users.length === 0 && !isLoading) {
      fetchUsers()
    }
  }, [fetchUsers, users.length, isLoading])

  return <>{children}</>
}

// Custom hook for convenience and backward compatibility
export const useUserContext = () => {
  const {
    filteredUsers,
    users,
    selectedUser,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    applyFilters,
    resetFilters,
    fetchUsers: refreshUsers,
    getUserById,
    updateUserRole,
    selectUser
  } = useUserManagementStore()

  return {
    filteredUsers,
    users,
    selectedUser,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    applyFilters,
    resetFilters,
    refreshUsers,
    getUserById,
    updateUserRole,
    selectUser
  }
}