import { ReactNode } from 'react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/footer/footer';
import './globals.css';
import AuthInitializer from '@/components/auth/AuthInitializer';
import { ToastProvider } from '@/components/ui/toast-provider';
import { Metadata, Viewport } from 'next';

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: 'HSLU Data Science Exam Preparation | AI-Powered Study Assistant',
  description: 'Advanced exam preparation tool for HSLU MSc Applied Information and Data Science students. Prepare smarter with AI-powered assistance tailored to your courses.',
  keywords: 'HSLU, data science, exam preparation, AI study assistant, MSc Applied Information, Data Science, Lucerne University',
  authors: [{ name: 'HSLU - Roger Jeasy Bavibidila' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hslu-exam-ai-assistant.vercel.app',
    title: 'HSLU Data Science Exam Preparation',
    description: 'AI-powered exam preparation assistant for HSLU Data Science students',
    siteName: 'HSLU Data Science Exam Preparation',
  },
};

// Separate viewport export as per Next.js recommendations
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <AuthInitializer>
            <Header />
            <main className="flex-grow w-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              {/* Professional background wrapper for all pages */}
              <div className="max-w-screen-2xl mx-auto w-full h-full px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </div>
            </main>
            <Footer />
          </AuthInitializer>
        </ToastProvider>
      </body>
    </html>
  );
}