// src/app/about/page.tsx
import AboutHero from '@/components/about/AboutHero';
import AboutCreator from '@/components/about/AboutCreator';
import AboutTechnology from '@/components/about/AboutTechnology';
import AboutMission from '@/components/about/AboutMission';
import { Faq } from '@/components/homepage/faq'
import AboutContactCTA from '@/components/about/AboutContactCTA';
import { Features } from '@/components/homepage/features'

export const metadata = {
  title: 'About - HSLU Data Science Exam Preparation Assistant',
  description: 'Learn about our AI-powered exam preparation tool for HSLU MSc students in Applied Information and Data Science.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <AboutHero />
      <AboutCreator />
      <Features />
      <AboutTechnology />
      <AboutMission />
      <Faq />
      <AboutContactCTA />
    </div>
  );
}