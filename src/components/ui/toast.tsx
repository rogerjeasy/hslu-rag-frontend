// src/components/ui/toast.tsx
"use client"

import React, { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
  onClose: (id: string) => void
}

export function Toast({
  id,
  title,
  description,
  variant = "default",
  duration = 5000,
  onClose,
}: ToastProps) {
  // Auto dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full max-w-md items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
        variant === "destructive"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      )}
    >
      <div className="flex flex-col gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm text-muted-foreground">{description}</div>}
      </div>
      <button
        onClick={() => onClose(id)}
        className={cn(
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
          variant === "destructive" && "hover:bg-red-100"
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}