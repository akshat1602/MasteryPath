'use client'

import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Turn raw Supabase errors into friendly text
function friendlyResetError(message: string) {
  const m = message.toLowerCase()
  if (m.includes('email rate limit'))
    return 'Email limit reached. Please try again in about an hour.'
  if (m.includes('seconds') || m.includes('security') || m.includes('rate limit') || m.includes('too many'))
    return 'Please wait a minute before requesting another email.'
  if (m.includes('fetch') || m.includes('network'))
    return 'Network error. Check your connection and try again.'
  return 'Something went wrong. Please try again.'
}

export default function ForgotPasswordPage() {
  const [supabase] = useState(() => createClient())

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Success & Resend State
  const [isSuccess, setIsSuccess] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // Handle the countdown timer for the resend button
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleRequestReset = async (isResend = false) => {
    setError('')
    
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    if (isResend) {
      setIsResending(true)
    } else {
      setIsLoading(true)
    }

    // Trigger Supabase to send a password reset email
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })

    if (resetError) {
      setError(friendlyResetError(resetError.message))
    } else {
      setIsSuccess(true)
      setCooldown(60) // Start the 60-second cooldown on success
    }
    
    setIsLoading(false)
    setIsResending(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleRequestReset(false)
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#090909] text-white">
      {/* Subtle neutral-grey ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
      >
        <div className="absolute -left-32 top-[20%] h-[420px] w-[420px] rounded-full bg-[#9CA3AF]/[0.045] blur-[120px]" />
        <div className="absolute -right-32 bottom-[8%] h-[420px] w-[420px] rounded-full bg-[#6B7280]/[0.035] blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen w-full">
        {/* Left / Brand panel */}
        <section className="hidden w-1/2 flex-col border-r border-[#242424] bg-[#090909]/80 px-16 pt-[12vh] backdrop-blur-sm lg:flex">
          <div className="mb-14">
            <Logo />
          </div>

          <div className="max-w-xl mb-12">
            <h2 className="text-4xl font-bold leading-[1.12] tracking-[-0.03em] text-white xl:text-[44px]">
              Account Recovery
            </h2>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-[#9A9692] xl:text-lg">
              Securely regain access to your MasteryPath workspace.
            </p>
          </div>

          {/* Animated Lock/Key Illustration */}
          <div className="w-full max-w-[420px] h-[280px] rounded-2xl border border-[#242424] bg-[#0D0D0C] p-6 shadow-2xl relative overflow-hidden group flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_60%)]"></div>
            
            <div className="relative flex flex-col items-center justify-center animate-[bounce_4s_ease-in-out_infinite]">
              {/* Lock Body */}
              <div className="relative z-10 w-24 h-20 bg-[#151515] border border-[#3A3A3A] rounded-2xl shadow-xl flex items-center justify-center">
                {/* Glowing Keyhole */}
                <div className="w-3 h-5 bg-[#9CA3AF]/20 rounded-full shadow-[0_0_15px_rgba(156,163,175,0.3)] relative">
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#9CA3AF]/20 rounded-full blur-[2px]"></div>
                </div>
              </div>
              {/* Lock Shackle */}
              <div className="absolute -top-12 w-14 h-16 border-[6px] border-[#3A3A3A] rounded-t-3xl border-b-0 z-0"></div>
              
              {/* Floating ambient particles around the lock */}
              <div className="absolute -left-10 top-0 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-75"></div>
              <div className="absolute -right-8 -bottom-4 w-2 h-2 bg-white/10 rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-10 right-12 w-1 h-1 bg-white/30 rounded-full animate-ping delay-700"></div>
            </div>
          </div>

          <div className="mt-auto pb-10 text-[13px] text-[#73706D]">
            © 2026 MasteryPath Inc.
          </div>
        </section>

        {/* Right / Password Recovery panel */}
        <section className="flex w-full items-center justify-center px-6 py-10 sm:px-8 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-[480px]">
            <div className="mb-9">
              <h1 className="text-[30px] font-bold tracking-[-0.025em] text-white sm:text-[32px]">
                Reset password
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-[#9A9692] sm:text-[15px]">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            {isSuccess ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-xl border border-[#292929] bg-[#111110] p-8 text-center shadow-xl">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A2E20] border border-[#27432F]">
                    <svg className="h-6 w-6 text-[#4ADE80]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-bold tracking-tight text-white">Check your inbox</h3>
                  <p className="mb-8 text-sm leading-relaxed text-[#9A9692]">
                    If an account exists for that email, you'll receive instructions to reset your password.
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => handleRequestReset(true)}
                      disabled={isResending || cooldown > 0}
                      className="flex h-[52px] w-full items-center justify-center rounded-xl border border-[#292929] bg-[#1A1A1A] text-[15px] font-medium text-white outline-none transition-all duration-200 hover:border-[#3A3A3A] hover:bg-[#242424] focus-visible:ring-2 focus-visible:ring-[#8B8F94]/50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isResending ? 'Sending...' : cooldown > 0 ? `Resend email (${cooldown}s)` : 'Resend email'}
                    </button>
                    
                    <Link
                      href="/login"
                      className="flex h-[52px] w-full items-center justify-center rounded-xl bg-transparent text-[15px] font-medium text-[#9A9692] outline-none transition-all duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8B8F94]/50"
                    >
                      ← Back to login
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A5A19D]" htmlFor="email">
                    Email
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <svg
                        className="h-5 w-5 text-[#77736F] transition-colors duration-200 group-focus-within:text-[#B0B3B8]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M3 8.5 10.9 13.7a2 2 0 0 0 2.2 0L21 8.5" />
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                      </svg>
                    </div>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError('')
                      }}
                      placeholder="your@email.com"
                      className="h-[52px] w-full rounded-xl border border-[#292929] bg-[#0D0D0C] pl-11 pr-4 text-[15px] text-white outline-none placeholder:text-[#73706D]/60 transition-all duration-200 hover:border-[#3A3A3A] focus:border-[#8B8F94] focus:ring-2 focus:ring-[#8B8F94]/10"
                    />
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-[#5A3434] bg-[#2A1717] px-3.5 py-3 text-sm leading-5 text-[#E7B8B8]"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-white text-[15px] font-semibold tracking-wide text-[#090909] outline-none transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#F1F1F1] hover:shadow-[0_10px_28px_rgba(156,163,175,0.12)] focus-visible:ring-2 focus-visible:ring-[#8B8F94] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-90" d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <span>Sending link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send reset link</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-[#8C8985] transition-colors hover:text-white"
                  >
                    ← Back to login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}