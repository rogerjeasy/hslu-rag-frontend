// app/page.tsx
import { HeroSection } from "@/components/homepage/herosection"
import { Features } from '@/components/homepage/features'
import { HowItWorks } from '@/components/homepage/how-it-works'
import { Testimonials } from '@/components/homepage/testimonials/Testimonials'
import { CoursePreview } from '@/components/homepage/courseprevious'
import { Faq } from '@/components/homepage/faq'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      {/* Uncomment these components as you develop them */}
      <Features />
      <HowItWorks />
      <Testimonials />
      <CoursePreview />
      <Faq />
    </main>
  )
}