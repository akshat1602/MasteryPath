'use client'

import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Turn raw Supabase errors into friendly text
function friendlyUpdateError(message: string) {
  const m = message.toLowerCase()
  if (m.includes('different from the old'))
    return 'Your new password must be different from your old one.'
  if (m.includes('session') || m.includes('not authenticated') || m.includes('jwt'))
    return 'Your reset link has expired. Please request a new one.'
  if (m.includes('password') && (m.includes('weak') || m.includes('at least') || m.includes('short')))
    return 'Password is too weak. Use at least 8 characters with a letter and a number.'
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please wait a few minutes and try again.'
  if (m.includes('fetch') || m.includes('network'))
    return 'Network error. Check your connection and try again.'
  return 'Something went wrong. Please try again.'
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.3A10.4 10.4 0 0 1 12 5c4.5 0 8.3 2.9 9.6 7a10.7 10.7 0 0 1-2.5 4.1" />
      <path d="M6.6 6.6A10.6 10.6 0 0 0 2.4 12c1.3 4.1 5.1 7 9.6 7 1.1 0 2.2-.2 3.2-.5" />
    </svg>
  ) : (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.4-7 9.5-7 9.5 7 9.5 7-3.4 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

const lockIcon = (
  <svg
    className="h-5 w-5 text-[#77736F] transition-colors duration-200 group-focus-within:text-[#B0B3B8]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <path d="M12 14v3" />
  </svg>
)

const inputClass =
  'h-[52px] w-full rounded-xl border border-[#292929] bg-[#0D0D0C] pl-11 pr-12 text-[15px] text-white outline-none placeholder:text-[#73706D]/60 transition-all duration-200 hover:border-[#3A3A3A] focus:border-[#8B8F94] focus:ring-2 focus:ring-[#8B8F94]/10'

const toggleClass =
  'absolute inset-y-0 right-0 flex items-center pr-4 text-[#77736F] outline-none transition-colors hover:text-[#D0D0D0] focus-visible:text-white'

export default function UpdatePasswordPage() {
  const [supabase] = useState(() => createClient())
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [sessionState, setSessionState] = useState<'checking' | 'ready' | 'missing'>('checking')

  // Make sure the user arrived through a valid recovery link (active session)
  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) setSessionState(user ? 'ready' : 'missing')
    })
    return () => {
      cancelled = true
    }
  }, [supabase])

  // After success, give the user a moment to read the message, then go to dashboard
  useEffect(() => {
    if (!isSuccess) return
    const timer = setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 2000)
    return () => clearTimeout(timer)
  }, [isSuccess, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Please enter a new password.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError('Password must include at least one letter and one number.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    // Securely update the user's password using their active recovery session
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      setError(friendlyUpdateError(updateError.message))
      setIsLoading(false)
      return
    }

    setIsSuccess(true)
    setIsLoading(false)
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

          <div className="max-w-xl">
            <h2 className="text-4xl font-bold leading-[1.12] tracking-[-0.03em] text-white xl:text-[44px]">
              Learn. Build. Master.
            </h2>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-[#9A9692] xl:text-lg">
              Your journey from learning to mastery, all in one place.
            </p>
          </div>

          <div className="mt-auto pb-10 text-[13px] text-[#73706D]">
            © 2026 MasteryPath Inc.
          </div>
        </section>

        {/* Right / Update Password panel */}
        <section className="flex w-full items-center justify-center px-6 py-10 sm:px-8 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-[480px]">
            <div className="mb-9">
              <h1 className="text-[30px] font-bold tracking-[-0.025em] text-white sm:text-[32px]">
                Set new password
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-[#9A9692] sm:text-[15px]">
                Please enter your new secure password below.
              </p>
            </div>

            {sessionState === 'checking' ? (
              <div className="flex items-center justify-center gap-3 rounded-xl border border-[#292929] bg-[#111110] p-6 text-sm text-[#9A9692]">
                <Spinner />
                <span>Verifying your link...</span>
              </div>
            ) : sessionState === 'missing' ? (
              <div className="rounded-xl border border-[#292929] bg-[#111110] p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2A1717]">
                  <svg className="h-6 w-6 text-[#E7B8B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v5m0 3.5h.01M10.3 3.9 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Link expired</h3>
                <p className="text-sm leading-6 text-[#9A9692]">
                  This reset link is invalid or has already been used. Request a new one to continue.
                </p>
                <Link
                  href="/forgot-password"
                  className="mt-6 inline-block w-full rounded-xl bg-[#292929] py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#3A3A3A]"
                >
                  Request a new link
                </Link>
              </div>
            ) : isSuccess ? (
              <div className="rounded-xl border border-[#292929] bg-[#111110] p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A2E20]">
                  <svg className="h-6 w-6 text-[#4ADE80]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Password updated</h3>
                <p className="text-sm leading-6 text-[#9A9692]">
                  Your password has been changed. Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* New password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A5A19D]" htmlFor="password">
                    New password
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      {lockIcon}
                    </div>

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (error) setError('')
                      }}
                      placeholder="Create a new password"
                      className={inputClass}
                    />

                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((value) => !value)}
                      className={toggleClass}
                    >
                      <EyeIcon hidden={showPassword} />
                    </button>
                  </div>

                  <p className="text-xs text-[#73706D]">
                    At least 8 characters, with a letter and a number.
                  </p>
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A5A19D]" htmlFor="confirmPassword">
                    Confirm new password
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      {lockIcon}
                    </div>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (error) setError('')
                      }}
                      placeholder="Re-enter your new password"
                      className={inputClass}
                    />

                    <button
                      type="button"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      onClick={() => setShowConfirm((value) => !value)}
                      className={toggleClass}
                    >
                      <EyeIcon hidden={showConfirm} />
                    </button>
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
                      <Spinner />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}