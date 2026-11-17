
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Pages that need a signed-in user (logged-out visitors are sent to /login)
const PROTECTED_PAGE_PREFIXES = ['/dashboard', '/practice']

// AI / execution routes that cost money. Logged-out calls get a 401.
// (/api/topics and /api/checkpoints are left to their owners.)
const PROTECTED_API_PREFIXES = [
  '/api/generate-problem',
  '/api/judge0',
  '/api/evaluate-answer',
  '/api/rag',
  '/api/adaptive-engine',
]

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p))
  const isProtectedApi = PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))

  // Copy any refreshed session cookies onto a response we build ourselves
  const withSessionCookies = (response: NextResponse) => {
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie))
    return response
  }

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    return withSessionCookies(NextResponse.redirect(url))
  }

  if (!user && isProtectedApi) {
    return withSessionCookies(
      NextResponse.json({ error: 'Please sign in to use this feature.' }, { status: 401 })
    )
  }
  if (!user && isProtectedPage) return redirectTo('/login')
  if (user && isAuthRoute) return redirectTo('/dashboard')

  return supabaseResponse
}


// Optimize the middleware to ignore static files, images, and internal build checks
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes (unless explicitly bypassed during build)
    '/(api|trpc)(.*)',
  ],
}