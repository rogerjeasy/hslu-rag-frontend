import { Metadata } from 'next'
import FeaturesPage from '@/components/features/Features'

export const metadata: Metadata = {
  title: "Features - HSLU Data Science Study Assistant",
  description: "Explore all features of the HSLU MSc students in Applied Information and Data Science Study AI-powered Assistant to boost your exam preparation.",
};

export default function FeaturePage() {
  return (
    <main className="min-h-screen">
      <FeaturesPage />
    </main>
  )
}