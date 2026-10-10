import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Only allow internal paths (blocks open-redirect tricks like ?next=//evil.com)
function safeNext(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/dashboard'
  return next
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  const isRecovery = next.startsWith('/update-password')
  const failure = isRecovery ? 'link_expired' : 'auth_failed'
  const toLogin = (reason: string) =>
    NextResponse.redirect(new URL(`/login?error=${reason}`, origin))

  // Supabase/Google reported a problem (expired link, cancelled consent...)
  if (searchParams.get('error')) {
    const expired = searchParams.get('error_code') === 'otp_expired'
    return toLogin(expired ? 'link_expired' : failure)
  }

  if (!code) return toLogin(failure)

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Safe to ignore: middleware refreshes the session
          }
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) return toLogin(failure)

  return NextResponse.redirect(new URL(next, origin))
}