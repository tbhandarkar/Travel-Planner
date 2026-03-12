'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <span className="text-2xl">✈️</span>
          AI Travel Planner
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/trips"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                My Trips
              </Link>
              <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
