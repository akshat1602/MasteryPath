'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? '')
      } else {
        // Redirect to login if they aren't authenticated
        router.push('/login')
      }
    }
    getUser()
  }, [router, supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-earth-smoky p-8 flex flex-col items-center">
      {/* Top Navigation Bar */}
      <nav className="w-full max-w-6xl flex justify-between items-center mb-12 py-4 border-b border-earth-olive/30">
        <div className="text-2xl font-bold text-earth-floral">
          Project<span className="text-earth-olive">Name</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <span className="text-earth-bone/80 text-sm">
            {userEmail ? userEmail : 'Loading...'}
          </span>
          <button 
            onClick={handleSignOut}
            className="px-6 py-2 rounded-full border border-earth-olive/50 text-earth-bone hover:bg-earth-olive hover:text-earth-smoky transition-all text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-[#1A1612] p-8 rounded-2xl border border-earth-olive/20 shadow-xl">
          <h2 className="text-2xl font-semibold text-earth-floral mb-4">Welcome to your Dashboard</h2>
          <p className="text-earth-bone/70 leading-relaxed">
            This is the foundational scaffold for your final year project. 
            The authentication flow is complete, and you can now start building 
            out the core features of your application on top of this secure layer.
          </p>
        </div>
        
        <div className="col-span-1 bg-[#1A1612] p-8 rounded-2xl border border-earth-olive/20 shadow-xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-earth-olive/20 text-earth-olive flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-earth-floral mb-2">Quick Action</h3>
          <p className="text-earth-bone/60 text-sm">Add your project widgets here.</p>
        </div>
      </div>
    </main>
  )
}