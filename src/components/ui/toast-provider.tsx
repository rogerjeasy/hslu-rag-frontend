// src/components/ui/toast-provider.tsx
"use client"

import React, { createContext, useContext, useState } from "react"
import { Toast } from "./toast"
import { AnimatePresence, motion } from "framer-motion"

// Types for the toast
export type ToastType = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

// Context type
type ToastContextType = {
  toast: (props: Omit<ToastType, "id">) => void
  dismiss: (id: string) => void
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Toast provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([])

  // Add a new toast
  const toast = (props: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { ...props, id }])
  }

  // Remove a toast by id
  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      
      <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-col gap-2 max-h-screen overflow-hidden">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
            >
              <Toast
                id={toast.id}
                title={toast.title}
                description={toast.description}
                variant={toast.variant}
                onClose={dismiss}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}