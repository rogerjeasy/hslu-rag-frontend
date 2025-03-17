'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { JSX } from "react"

interface ModalRegistrationSuccessfulProps {
  isOpen: boolean
  onClose: () => void
}

export function ModalRegistrationSuccessful({
  isOpen,
  onClose
}: ModalRegistrationSuccessfulProps): JSX.Element {
  const router = useRouter()

  const handleLoginClick = () => {
    onClose()
    router.push('/login')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            Registration Successful!
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          </motion.div>
          
          <DialogDescription className="text-center text-gray-700 mb-6">
            Your account has been created successfully. You can now log in to access the HSLU Data Science Exam Preparation Assistant.
          </DialogDescription>
          
          <Button 
            onClick={handleLoginClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Login Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}