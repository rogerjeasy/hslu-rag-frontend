import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | HSLU Data Science Exam Preparation',
  description: 'Sign in to your HSLU Data Science Exam Preparation Assistant account',
}

export default function LoginPage() {
  return (
    <AuthLayout mode="login">
      <LoginForm />
    </AuthLayout>
  )
}