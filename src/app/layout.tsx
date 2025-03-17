import { ReactNode } from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/footer/footer';
import './globals.css';

export const metadata = {
  title: 'HSLU Data Science Exam Preparation',
  description: 'An AI-powered exam preparation tool for Data Science students',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}