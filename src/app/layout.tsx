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
      <body>
        <ToastProvider>
          <AuthInitializer>
            <Header />
              {children}
            <Footer />
          </AuthInitializer>
        </ToastProvider>
      </body>
    </html>
  );
}