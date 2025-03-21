// src/app/application-management/page.tsx
"use client";

import { useState } from 'react'
import { AppManagementLayout } from '@/components/application-management/AppManagementLayout'
import { UserManagement } from '@/components/application-management/UserManagement'
import { FaqManagement } from '@/components/application-management/FaqManagement'
import { FileManagement } from '@/components/application-management/FileManagement'
import { CourseManagement } from '@/components/application-management/CourseManagement'
import { DashboardOverview } from '@/components/application-management/DashboardOverview'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// export const metadata: Metadata = {
//     title: 'Application Management | HSLU Data Science Exam Preparation',
//     description: 'Manage users, courses, FAQs, and files for the HSLU Data Science Exam Preparation Assistant',
// }

export type AdminView = 'dashboard' | 'users' | 'courses' | 'faq' | 'files'

export default function ApplicationManagementPage() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')
  const { user, isAuthenticated, hasChecked } = useUserStore()
  const router = useRouter()
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (hasChecked && (!isAuthenticated || !user?.role?.includes('admin'))) {
      router.push('/dashboard')
    }
  }, [hasChecked, isAuthenticated, user, router])

  // Show loading state while checking authentication
  if (!hasChecked || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Render appropriate view based on selection
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />
      case 'users':
        return <UserManagement />
      case 'courses':
        return <CourseManagement />
      case 'faq':
        return <FaqManagement />
      case 'files':
        return <FileManagement />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <AppManagementLayout 
      currentView={currentView} 
      setCurrentView={setCurrentView}
    >
      {renderView()}
    </AppManagementLayout>
  )
}