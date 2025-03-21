import { ReactNode } from 'react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/footer/footer';
import './globals.css';
import AuthInitializer from '@/components/auth/AuthInitializer';
import { ToastProvider } from '@/components/ui/toast-provider';

export const metadata = {
  title: 'HSLU Data Science Exam Preparation',
  description: 'An AI-powered exam preparation tool for Data Science students',
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