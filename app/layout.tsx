import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Travel Planner',
  description: 'Generate personalised day-wise travel itineraries using AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  )
}
