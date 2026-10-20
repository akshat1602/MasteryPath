'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type ProfileFormProps = {
  userId: string
  email: string
  initialName: string
  displayName: string
  avatarUrl: string | null
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  )
}

const MAX_NAME_LENGTH = 60

export default function ProfileForm({
  userId,
  email,
  initialName,
  displayName,
  avatarUrl,
}: ProfileFormProps) {
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  const [savedName, setSavedName] = useState(initialName || displayName || '')
  const [name, setName] = useState(initialName || displayName || '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const cleanName = name.replace(/\s+/g, ' ').trim()
  const hasChanges = cleanName !== savedName

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (cleanName.length < 2) {
      setError('Please enter your name (at least 2 characters).')
      return
    }

    if (cleanName.length > MAX_NAME_LENGTH) {
      setError(`Name must be ${MAX_NAME_LENGTH} characters or fewer.`)
      return
    }

    setIsSaving(true)

    // RLS only allows updating your own row in profiles table
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: cleanName })
      .eq('id', userId)
      .select('full_name')
      .maybeSingle()

    if (updateError || !data) {
      setError('Could not save your changes. Please try again.')
      setIsSaving(false)
      return
    }

    setSavedName(data.full_name ?? cleanName)
    setName(data.full_name ?? cleanName)
    setSuccess('Profile updated successfully.')
    setIsSaving(false)

    // Re-run server components so the sidebar and top navigation pick up the new name
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Photo / Identity Card (Compact & Aligned) */}
      <section className="rounded-2xl border border-[#292725] bg-[#11100F] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                width={56}
                height={56}
                referrerPolicy="no-referrer"
                className="h-14 w-14 shrink-0 rounded-full border border-[#292725] object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#292725] bg-[#1A1816] text-lg font-semibold text-[#D0D0D0] shadow-inner"
              >
                {getInitials(cleanName || initialName || displayName)}
              </div>
            )}

            <div>
              <h3 className="text-base font-semibold text-white">
                {cleanName || displayName || 'Learner'}
              </h3>
              <p className="text-xs text-[#9A9692]">{email}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] text-[#73706D]">Google OAuth Linked</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block rounded-md border border-[#292725] bg-[#141210] px-2.5 py-1 text-[11px] font-medium text-[#73706D]">
              Avatar managed via Google
            </span>
          </div>
        </div>
      </section>

      {/* Personal Details Form */}
      <section className="rounded-2xl border border-[#292725] bg-[#11100F] p-5 sm:p-6">
        <h2 className="mb-5 text-base font-semibold text-white">Personal details</h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-[#A5A19D]" htmlFor="fullName">
                Full name
              </label>
              <span className="text-[11px] font-mono text-[#73706D]">
                {name.length}/{MAX_NAME_LENGTH}
              </span>
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={name}
              maxLength={MAX_NAME_LENGTH + 5}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
                if (success) setSuccess('')
              }}
              placeholder="Your full name"
              className="h-11 w-full rounded-xl border border-[#292929] bg-[#0D0D0C] px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-[#73706D]/60 hover:border-[#3A3A3A] focus:border-[#A78BFA] focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
            />
            <p className="text-[11px] text-[#73706D]">
              Displayed in learning paths, submissions, and session bars.
            </p>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-medium uppercase tracking-wider text-[#A5A19D]" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              readOnly
              className="h-11 w-full cursor-not-allowed rounded-xl border border-[#242424] bg-[#0A0A0A] px-4 text-sm text-[#73706D] outline-none"
            />
            <p className="text-[11px] text-[#73706D]">
              Your email is managed by your Google provider account and cannot be modified directly here.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-[#5A3434] bg-[#2A1717] px-3.5 py-2.5 text-xs text-[#E7B8B8]"
            >
              <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-lg border border-[#27432F] bg-[#14231A] px-3.5 py-2.5 text-xs text-[#9BE0B0]"
            >
              <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving || !hasChanges}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-semibold text-[#090909] outline-none transition-all duration-200 hover:bg-[#E5E5E5] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#11100F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-90" d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span>Saving changes…</span>
                </>
              ) : (
                <span>Save changes</span>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}