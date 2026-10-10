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

  const [savedName, setSavedName] = useState(initialName)
  const [name, setName] = useState(initialName)
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

    // RLS only allows updating your own row, so a 0-row result means it was blocked
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
    setSuccess('Profile updated.')
    setIsSaving(false)

    // Re-run server components so the sidebar/top bar pick up the new name
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Photo */}
      <section className="rounded-2xl border border-[#292725] bg-[#11100F] p-6">
        <h2 className="mb-4 text-lg font-semibold">Profile photo</h2>

        <div className="flex items-center gap-5">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              width={80}
              height={80}
              referrerPolicy="no-referrer"
              className="h-20 w-20 rounded-full border border-[#292725] object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full border border-[#292725] bg-[#1A1816] text-2xl font-semibold text-[#D0D0D0]"
            >
              {getInitials(initialName || displayName)}
            </div>
          )}

          <p className="text-sm leading-6 text-[#9A9692]">
            {avatarUrl
              ? 'Your photo was imported from your Google account when you signed up.'
              : 'You have no profile photo yet. Your initials are shown instead.'}
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="rounded-2xl border border-[#292725] bg-[#11100F] p-6">
        <h2 className="mb-5 text-lg font-semibold">Personal details</h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#A5A19D]" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={name}
              maxLength={MAX_NAME_LENGTH + 10}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
                if (success) setSuccess('')
              }}
              placeholder="Your full name"
              className="h-[52px] w-full rounded-xl border border-[#292929] bg-[#0D0D0C] px-4 text-[15px] text-white outline-none placeholder:text-[#73706D]/60 transition-all duration-200 hover:border-[#3A3A3A] focus:border-[#8B8F94] focus:ring-2 focus:ring-[#8B8F94]/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#A5A19D]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              readOnly
              className="h-[52px] w-full cursor-not-allowed rounded-xl border border-[#292929] bg-[#0D0D0C] px-4 text-[15px] text-[#77736F] outline-none"
            />
            <p className="text-xs text-[#73706D]">Your email can&apos;t be changed here.</p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-[#5A3434] bg-[#2A1717] px-3.5 py-3 text-sm leading-5 text-[#E7B8B8]"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg border border-[#27432F] bg-[#14231A] px-3.5 py-3 text-sm leading-5 text-[#9BE0B0]"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-[#090909] outline-none transition-all duration-200 hover:bg-[#F1F1F1] focus-visible:ring-2 focus-visible:ring-[#8B8F94] focus-visible:ring-offset-2 focus-visible:ring-offset-[#11100F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-90" d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save changes</span>
            )}
          </button>
        </form>
      </section>
    </div>
  )
}