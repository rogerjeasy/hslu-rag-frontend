import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account | HSLU Data Science Exam Preparation',
  description: 'Create your account for the HSLU Data Science Exam Preparation Assistant',
}

export default function RegisterPage() {
  return (
    <AuthLayout mode="register">
      <RegisterForm />
    </AuthLayout>
  )
}