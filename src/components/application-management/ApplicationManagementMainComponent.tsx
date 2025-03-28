"use client";

import { useState, useEffect } from 'react'
import { AppManagementLayout } from '@/components/application-management/AppManagementLayout'
import { UserManagement } from '@/components/application-management/UserManagement'
import { FaqManagement } from '@/components/application-management/FaqManagement'
import { FileManagement } from '@/components/application-management/FileManagement'
import { CourseManagement } from '@/components/application-management/CourseManagement'
import { DashboardOverview } from '@/components/application-management/DashboardOverview'
import { useUserStore } from '@/store/userStore'
import { useRouter, usePathname } from 'next/navigation'
import StatisticsAdminPanel from './StatisticsAdminPanel';
import MaterialsMainComponent from '../materials/MaterialsMainComponent';

export type AdminView = 'dashboard' | 'users' | 'courses' | 'faq' | 'files' | 'statistics' | 'materials'

export default function ApplicationManagementPage() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')
  const { user, isAuthenticated, hasChecked } = useUserStore()
  const router = useRouter()
  const pathname = usePathname()
  
  // Parse the current path to set the initial view
  useEffect(() => {
    if (pathname) {
      // Extract the section from the URL path
      const section = pathname.split('/').pop() as AdminView | undefined
      
      // If it's a valid section, set it as the current view
      if (section && ['dashboard', 'users', 'courses', 'faq', 'files', 'statistics', 'materials'].includes(section)) {
        setCurrentView(section)
      }
    }
  }, [pathname])
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (hasChecked && (!isAuthenticated || !user?.role?.includes('admin'))) {
      router.push('/dashboard')
    }
  }, [hasChecked, isAuthenticated, user, router])
  
  // Update URL when view changes
  useEffect(() => {
    if (currentView) {
      // Update the URL without forcing a page reload
      router.push(`/application-management/${currentView}`, { scroll: false })
    }
  }, [currentView, router])
  
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
      case 'statistics':
        return <StatisticsAdminPanel />
      case 'materials':
        return <MaterialsMainComponent />
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