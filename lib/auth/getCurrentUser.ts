import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

// cache() means layout + page share ONE lookup per request
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // RLS only lets a user read their own profile row
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  // Email/password signups have no name, so fall back to the email prefix
  const displayName =
    profile?.full_name?.trim() || user.email?.split('@')[0] || 'there'

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: profile?.full_name?.trim() ?? '', // raw saved name (may be empty)
    displayName,
    firstName: displayName.split(/\s+/)[0],
    avatarUrl: profile?.avatar_url ?? null,
  }
})