import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Application Management | HSLU Data Science Exam Preparation',
  description: 'Manage users, courses, FAQs, and files for the HSLU Data Science Exam Preparation Assistant',
}

export default function ApplicationManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}