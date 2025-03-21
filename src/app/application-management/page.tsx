// src/app/application-management/page.tsx
import { Metadata } from 'next'
import ApplicationManagementMainComponent from "@/components/application-management/ApplicationManagementMainComponent";

export const metadata: Metadata = {
    title: 'Application Management | HSLU Data Science Exam Preparation',
    description: 'Manage users, courses, FAQs, and files for the HSLU Data Science Exam Preparation Assistant',
    }

export default function ApplicationManagementPage() {
  return (
    <ApplicationManagementMainComponent />
  );
}