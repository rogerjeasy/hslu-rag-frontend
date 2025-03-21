'use client'

import React from 'react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useUserContext } from './UserContext'

export function UserSearchFilter() {
  const { 
    selectedRole, 
    setSelectedRole, 
    resetFilters 
  } = useUserContext()

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-md bg-muted/10">
      <div className="flex-1 space-y-1">
        <label className="text-sm font-medium">Role</label>
        <Select
          value={selectedRole || undefined}
          onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="instructor">Instructor</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          className="w-full sm:w-auto"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  )
}