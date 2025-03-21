'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserRole } from '@/types/user.types'

interface UserRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (role: UserRole) => Promise<void>
  isUpdating: boolean
  userName?: string
  currentRole?: string[]
}

export function UserRoleDialog({
  open,
  onOpenChange,
  onConfirm,
  isUpdating,
  userName = "this user",
  currentRole = []
}: UserRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("")
  
  // Get primary role from array of roles
//   const primaryRole = currentRole.length > 0 ? currentRole[0] : undefined
  
  const handleSubmit = async () => {
    if (selectedRole) {
      await onConfirm(selectedRole as UserRole)
      setSelectedRole("")
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for {userName}. This will change their permissions within the system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current role</label>
            <div className="px-3 py-2 border rounded-md bg-muted/20">
              {currentRole.join(', ') || 'No role assigned'}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">New role</label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 flex-row-reverse sm:flex-row">
          <Button
            onClick={handleSubmit}
            disabled={!selectedRole || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Role"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}