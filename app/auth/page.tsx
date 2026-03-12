import AuthForm from '@/components/AuthForm'

export const metadata = { title: 'Sign in — AI Travel Planner' }

export default function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <AuthForm />
    </div>
  )
}
