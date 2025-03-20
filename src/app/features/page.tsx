import { Metadata } from 'next'
import { Features } from '@/components/homepage/features'

export const metadata: Metadata = {
  title: 'HSLU Data Science Exam Preparation Assistant',
  description: 'AI-powered exam preparation tool for HSLU MSc students in Applied Information and Data Science.',
}

export default function FeaturePage() {
  return (
    <main className="min-h-screen">
      <Features />
    </main>
  )
}