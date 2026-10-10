'use client'

import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Turn raw Supabase errors into friendly text
function friendlySignupError(message: string) {
  const m = message.toLowerCase()
  if (m.includes('already registered') || m.includes('already exists'))
    return 'An account with this email already exists. Try signing in instead.'
  if (m.includes('password') && (m.includes('weak') || m.includes('at least') || m.includes('short')))
    return 'Password is too weak. Use at least 8 characters with a letter and a number.'
  if (m.includes('rate limit') || m.includes('too many') || m.includes('security purposes'))
    return 'Too many attempts. Please wait a few minutes and try again.'
  if (m.includes('invalid') && m.includes('email'))
    return 'Please enter a valid email address.'
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

function CheckIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-3.5 w-3.5 transition-colors ${active ? 'text-green-400' : 'text-[#73706D]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
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
  'h-[52px] w-full rounded-xl border border-[#292929] bg-[#0D0D0C] pl-11 text-[15px] text-white outline-none placeholder:text-[#73706D]/60 transition-all duration-200 hover:border-[#3A3A3A] focus:border-white focus:ring-1 focus:ring-white'

const toggleClass =
  'absolute inset-y-0 right-0 flex items-center pr-4 text-[#77736F] outline-none transition-colors hover:text-white focus-visible:text-white'

export default function SignUpPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  // Animation State for Left Panel
  const [progress, setProgress] = useState(0)
  const [nodesReached, setNodesReached] = useState(0)

  // Gentle reveal animation for progress bar (0 to 68%)
  useEffect(() => {
    const progressTimer = setTimeout(() => {
      setProgress(68)
      setNodesReached(3) // 3 milestones reached based on 68%
    }, 400)
    return () => clearTimeout(progressTimer)
  }, [])

  // Live validation calculations
  const hasLength = password.length >= 8
  const hasLetterAndNumber = /[a-zA-Z]/.test(password) && /\d/.test(password)
  const passwordsMatch = password === confirmPassword && password.length > 0

  let strengthText = 'None'
  let strengthLevel = 0
  if (password.length > 0) {
    if (hasLength && hasLetterAndNumber) {
      strengthText = 'Strong'
      strengthLevel = 3
    } else if (hasLength || hasLetterAndNumber) {
      strengthText = 'Fair'
      strengthLevel = 2
    } else {
      strengthText = 'Weak'
      strengthLevel = 1
    }
  }

  const handleGoogleSignup = async () => {
    setError('')
    setIsGoogleLoading(true)

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (googleError) {
      setError('Could not start Google sign-up. Please try again.')
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError('Please enter your email address.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!hasLength || !hasLetterAndNumber) {
      setError('Password does not meet the requirements.')
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(friendlySignupError(signUpError.message))
      setIsLoading(false)
      return
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError('An account with this email already exists. Try signing in instead.')
      setIsLoading(false)
      return
    }

    if (data.session) {
      window.location.href = '/dashboard'
      return
    }

    setSubmittedEmail(trimmedEmail)
    setIsSuccess(true)
    setIsLoading(false)
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-white animate-in fade-in duration-1000">
      
      {/* Ambient Details: Faint grid lines, subtle radial gradient, floating dots */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
         <div className="absolute -left-32 top-[10%] h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[100px]" />
         <div className="absolute -right-32 bottom-[10%] h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[100px]" />
         
         <div className="absolute top-[25%] left-[12%] w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse"></div>
         <div className="absolute bottom-[20%] left-[35%] w-2 h-2 bg-white/10 rounded-full animate-pulse delay-700"></div>
         <div className="absolute top-[50%] right-[55%] w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen w-full">
        {/* Left Column: Branding & Animated Learning Path Preview */}
        <section className="hidden w-1/2 flex-col border-r border-[#242424] bg-[#050505]/60 px-16 pt-[12vh] backdrop-blur-md lg:flex">
          
          <div className="mb-14">
            <Logo />
          </div>

          <div className="max-w-xl mb-12">
            <h2 className="text-4xl font-bold leading-[1.12] tracking-[-0.03em] text-white xl:text-[44px]">
              Learn. Build. Master.
            </h2>
            <p className="mt-4 max-w-lg text-base font-medium leading-7 text-[#9A9692] xl:text-lg">
              Turn what you learn into skills you can actually use.
            </p>
          </div>

          {/* Animated Learning Path Card */}
          <div className="w-full max-w-[420px] rounded-2xl border border-[#242424] bg-[#0A0A0A] p-6 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[11px] font-bold text-white tracking-[0.1em] uppercase">Your Learning Journey</span>
              <span className="text-[11px] font-medium text-[#9A9692] bg-[#141414] px-3 py-1 rounded-full border border-[#242424]">Interactive preview</span>
            </div>
            
            {/* Connected Nodes Animation */}
            <div className="relative flex justify-between items-center mb-10 px-2 mt-4">
              {/* Static Background Path */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#242424] -translate-y-1/2 z-0"></div>
              
              {/* Traveling Pulse Path */}
              <div 
                className="absolute top-1/2 left-0 h-[2px] bg-white -translate-y-1/2 z-0 transition-all duration-[1500ms] ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 w-8 h-[2px] bg-white -translate-y-1/2 blur-[2px] shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]"></div>
              </div>
              
              {/* Nodes */}
              {[
                { label: 'Learn', subtitle: 'Concepts' },
                { label: 'Practice', subtitle: 'Projects' },
                { label: 'Build', subtitle: 'Skills' },
                { label: 'Master', subtitle: 'Career' }
              ].map((node, i) => {
                const isReached = nodesReached > i;
                return (
                  <div key={node.label} className="relative z-10 flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-700 ease-out delay-[${i * 300}ms] ${isReached ? 'bg-white border-white text-[#050505] shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-[#0A0A0A] border-[#242424] text-transparent'}`}>
                      {isReached ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#242424]"></div>
                      )}
                    </div>
                    <span className={`absolute -bottom-6 text-[11px] font-semibold whitespace-nowrap transition-colors duration-500 ${isReached ? 'text-white' : 'text-[#73706D]'}`}>{node.label}</span>
                    <span className={`absolute -bottom-10 text-[9px] font-medium whitespace-nowrap transition-colors duration-500 ${isReached ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>{node.subtitle}</span>
                  </div>
                )
              })}
            </div>

            {/* Tiny Progress Bar */}
            <div className="mt-14 flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-[#9A9692]">Progress preview</span>
              <span className="text-white tabular-nums">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-[1500ms] ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="mt-auto pb-10 text-[13px] text-[#73706D]">
            © 2026 MasteryPath Inc.
          </div>
        </section>

        {/* Right Column: Signup panel */}
        <section className="flex w-full items-center justify-center px-6 py-10 sm:px-8 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-[440px]">
            <div className="mb-9">
              <h1 className="text-[30px] font-bold tracking-[-0.025em] text-white sm:text-[32px]">
                Create an account
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-[#9A9692] sm:text-[15px]">
                Start your journey on MasteryPath today.
              </p>
            </div>

            {isSuccess ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-xl border border-[#292929] bg-[#111110] p-6 text-center shadow-xl">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A2E20] border border-[#27432F]">
                    <svg className="h-6 w-6 text-[#4ADE80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Verify your email</h3>
                  <p className="text-sm leading-6 text-[#9A9692]">
                    We sent a verification link to <strong className="text-white">{submittedEmail}</strong>. Click it to activate your account. Check your spam folder if you don't see it.
                  </p>
                  <Link href="/login" className="mt-6 inline-block w-full rounded-xl border border-[#292929] bg-[#1A1A1A] py-3 text-[15px] font-semibold text-white transition-colors hover:border-[#3A3A3A] hover:bg-[#242424]">
                    Return to login
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A5A19D]" htmlFor="email">Email</label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <svg className="h-5 w-5 text-[#77736F] transition-colors duration-200 group-focus-within:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
                        onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                        placeholder="your@email.com"
                        className={`${inputClass} pr-4`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A5A19D]" htmlFor="password">Password</label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">{lockIcon}</div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                        placeholder="Create a password"
                        className={`${inputClass} pr-12`}
                      />
                      <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className={toggleClass}>
                        <EyeIcon hidden={showPassword} />
                      </button>
                    </div>

                    {/* Live Validation & Strength */}
                    {password.length > 0 && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[13px] mb-1.5">
                          <span className="text-[#A5A19D]">Password strength</span>
                          <span className={`font-medium ${strengthLevel === 1 ? 'text-red-400' : strengthLevel === 2 ? 'text-yellow-400' : 'text-green-400'}`}>{strengthText}</span>
                        </div>
                        <div className="flex gap-1.5 h-1 mb-3">
                          <div className={`flex-1 rounded-full transition-colors ${strengthLevel >= 1 ? (strengthLevel === 1 ? 'bg-red-400' : strengthLevel === 2 ? 'bg-yellow-400' : 'bg-green-400') : 'bg-[#292929]'}`} />
                          <div className={`flex-1 rounded-full transition-colors ${strengthLevel >= 2 ? (strengthLevel === 2 ? 'bg-yellow-400' : 'bg-green-400') : 'bg-[#292929]'}`} />
                          <div className={`flex-1 rounded-full transition-colors ${strengthLevel >= 3 ? 'bg-green-400' : 'bg-[#292929]'}`} />
                        </div>
                        <ul className="space-y-1.5 text-[13px] font-medium">
                          <li className={`flex items-center gap-2 transition-colors ${hasLength ? 'text-green-400' : 'text-[#73706D]'}`}>
                             <CheckIcon active={hasLength} /> At least 8 characters
                          </li>
                          <li className={`flex items-center gap-2 transition-colors ${hasLetterAndNumber ? 'text-green-400' : 'text-[#73706D]'}`}>
                             <CheckIcon active={hasLetterAndNumber} /> Contains a letter and a number
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#A5A19D]" htmlFor="confirmPassword">Confirm password</label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">{lockIcon}</div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError(''); }}
                        placeholder="Re-enter your password"
                        className={`${inputClass} pr-12`}
                      />
                      <button type="button" aria-label={showConfirm ? 'Hide password' : 'Show password'} onClick={() => setShowConfirm(!showConfirm)} className={toggleClass}>
                        <EyeIcon hidden={showConfirm} />
                      </button>
                    </div>
                    {confirmPassword.length > 0 && (
                      <div className={`flex items-center gap-2 text-[13px] font-medium pt-1 transition-colors ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordsMatch ? (
                          <><CheckIcon active={true} /> Passwords match</>
                        ) : (
                          <><svg className="h-3.5 w-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> Passwords do not match</>
                        )}
                      </div>
                    )}
                  </div>

                  {error && (
                    <div role="alert" className="rounded-lg border border-[#5A3434] bg-[#2A1717] px-3.5 py-3 text-sm leading-5 text-[#E7B8B8] flex items-center gap-3">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {error}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || isGoogleLoading}
                      className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-white text-[15px] font-semibold tracking-wide text-[#090909] outline-none transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#F1F1F1] hover:shadow-[0_8px_25px_rgba(255,255,255,0.15)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      {isLoading ? (
                        <>
                          <Spinner />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign Up</span>
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </>
                      )}
                    </button>
                    <p className="mt-4 text-center text-xs text-[#73706D] font-medium">
                      By signing up, you agree to our <a href="#" className="underline decoration-[#3A3A3A] underline-offset-4 hover:text-white transition-colors">Terms of Service</a> and <a href="#" className="underline decoration-[#3A3A3A] underline-offset-4 hover:text-white transition-colors">Privacy Policy</a>.
                    </p>
                  </div>
                </form>

                <div className="my-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#292929]" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#73706D]">or</span>
                  <div className="h-px flex-1 bg-[#292929]" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading || isGoogleLoading}
                  className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-[#292929] bg-[#111110] text-[15px] font-medium text-white outline-none transition-all duration-200 hover:border-[#3D3D3D] hover:bg-[#181817] focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isGoogleLoading ? (
                    <>
                      <Spinner />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <p className="mt-8 text-center text-sm font-medium text-[#8C8985]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-white underline decoration-[#3A3A3A] underline-offset-4 transition-colors hover:text-[#C7C9CC] hover:decoration-[#777B80] focus-visible:text-white focus-visible:outline-none">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}