'use client'
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { UserRole } from '@/types/user.types'

interface UserRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (roles: UserRole[]) => Promise<void>
  isUpdating: boolean
  userName?: string
  currentRole?: string[]
}

const availableRoles: UserRole[] = ['admin', 'instructor', 'student'];

export function UserRoleDialog({
  open,
  onOpenChange,
  onConfirm,
  isUpdating,
  userName = "this user",
  currentRole = []
}: UserRoleDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  
  useEffect(() => {
    if (open) {
      const validRoles = currentRole.filter((role): role is UserRole => 
        availableRoles.includes(role as UserRole)
      );
      setSelectedRoles(validRoles);
    }
  }, [open, currentRole]);

  const handleToggleRole = (role: UserRole) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedRoles.length > 0) {
      await onConfirm(selectedRoles);
    }
  };

  // Determine if there have been changes compared to current roles
  const validCurrentRoles = currentRole.filter((role): role is UserRole => 
    availableRoles.includes(role as UserRole)
  );
  
  const hasChanges = 
    selectedRoles.length !== validCurrentRoles.length || 
    selectedRoles.some(role => !validCurrentRoles.includes(role)) ||
    validCurrentRoles.some(role => !selectedRoles.includes(role));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage User Roles</DialogTitle>
          <DialogDescription>
            Update roles for {userName}. Users can have multiple roles with different permissions.
          </DialogDescription>
        </DialogHeader>
       
        <div className="space-y-4 my-4">
          <div className="space-y-4">
            <div className="text-sm font-medium mb-2">Select roles</div>
            {availableRoles.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => handleToggleRole(role)}
                />
                <Label 
                  htmlFor={`role-${role}`}
                  className="capitalize cursor-pointer"
                >
                  {role}
                </Label>
              </div>
            ))}
            {selectedRoles.length === 0 && (
              <p className="text-sm text-red-500 mt-1">At least one role must be selected</p>
            )}
          </div>
        </div>
       
        <DialogFooter className="flex gap-2 flex-row-reverse sm:flex-row">
          <Button
            onClick={handleSubmit}
            disabled={selectedRoles.length === 0 || isUpdating || !hasChanges}
          >
            {isUpdating ? "Updating..." : "Update Roles"}
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