'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

// --- SVG Icons ---
const Icons = {
  Overview: () => <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z" /></svg>,
  Paths: () => <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Progress: () => <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Settings: () => <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Menu: () => <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>,
  ChevronLeft: () => <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  LogOut: () => <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
}

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: <Icons.Overview /> },
  { name: 'Learning Paths', href: '/dashboard/paths', icon: <Icons.Paths /> },
  { name: 'Progress', href: '/dashboard/progress', icon: <Icons.Progress /> },
  { name: 'Settings', href: 'dashboard/settings', icon: <Icons.Settings /> },
]

interface DashboardShellProps {
  user: {
    displayName?: string | null
    email?: string | null
    avatarUrl?: string | null
  }
  children: React.ReactNode
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Fallback initial for avatar
  const initial = user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
  const displayName = user.displayName || user.email?.split('@')[0] || 'User'

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-[#6B7280]/30 selection:text-white font-sans overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside 
        className={`hidden md:flex flex-col border-r border-[#242424] bg-[#0A0A0A] transition-[width] duration-300 ease-in-out relative z-30 ${isSidebarCollapsed ? 'w-[72px]' : 'w-64'}`}
      >
        <div className="h-16 flex items-center px-4 border-b border-[#242424] justify-between">
          <div className={`overflow-hidden whitespace-nowrap transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
             <Logo size="sm" showText={true} />
          </div>
          {/* Logo fallback for collapsed state */}
          {isSidebarCollapsed && (
             <div className="w-full flex justify-center animate-in fade-in zoom-in duration-300">
               <Logo size="sm" showText={false} />
             </div>
          )}
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-[#242424] bg-[#111110] text-[#9A9692] hover:text-white hover:bg-[#1A1A1A] transition-colors focus:outline-none z-40 shadow-md"
          >
            {isSidebarCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link 
                key={item.href} 
                href={item.href}
                title={isSidebarCollapsed ? item.name : undefined}
                className={`group flex items-center relative rounded-lg px-3 py-2.5 transition-all duration-200 outline-none ${
                  isActive 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-[#9A9692] hover:bg-white/5 hover:text-white'
                }`}
              >
                {/* Active left indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                )}
                
                <div className={`${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`}>
                  {item.icon}
                </div>
                
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#050505]/80 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <aside className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-[#242424] transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-[#242424] justify-between">
          <Logo size="sm" showText={true} />
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#9A9692] hover:text-white outline-none">
            <Icons.Close />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center relative rounded-lg px-4 py-3 transition-all duration-200 outline-none ${
                  isActive 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-[#9A9692] hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
                <div className="mr-4">{item.icon}</div>
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* --- MAIN LAYOUT COLUMN --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* --- TOP HEADER --- */}
        <header className="h-16 flex items-center justify-between md:justify-end px-4 md:px-8 border-b border-[#242424] bg-[#050505]/80 backdrop-blur-md sticky top-0 z-20">
          
          {/* Mobile hamburger & logo */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#9A9692] hover:text-white outline-none">
              <Icons.Menu />
            </button>
            <Logo size="sm" showText={false} />
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-colors outline-none focus-visible:bg-white/5"
            >
              <span className="hidden sm:block text-sm font-medium text-[#9A9692]">{displayName}</span>
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-[#4B5563] to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold border border-[#6B7280]/30 shadow-sm">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : initial}
              </div>
            </button>

            {/* Click-outside overlay */}
            {isProfileDropdownOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
            )}

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#292725] bg-[#11100F] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 py-2">
                <div className="px-4 py-3 border-b border-[#242424]">
                  <p className="text-sm font-medium text-white truncate">{displayName}</p>
                  <p className="text-xs text-[#73706D] truncate mt-0.5">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link 
                    href="dashboard/settings"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#9A9692] hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Icons.Settings /> Settings
                  </Link>
                </div>
                <div className="border-t border-[#242424] py-1 mt-1">
                  <button
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#FCA5A5] hover:bg-red-950/30 transition-colors disabled:opacity-50 outline-none text-left"
                  >
                    <Icons.LogOut /> 
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>

      </div>
    </div>
  )
}