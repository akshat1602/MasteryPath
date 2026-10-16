import type { DSAPattern, GeneratedProblem } from '@/lib/ai/problem-types'
import type { GenerateProblemSuccess, ApiErrorResponse } from '@/types/api'

// Only the patterns Anshika's backend supports
export const SUPPORTED_PATTERNS: readonly DSAPattern[] = ['Two Pointers', 'Sliding Window']

export function isSupportedPattern(value: string): value is DSAPattern {
  return (SUPPORTED_PATTERNS as readonly string[]).includes(value)
}

// Aliases so existing imports keep compiling
export type DSAConstraintPattern = DSAPattern
export type GeneratedProblemResult = GeneratedProblem
export type GenerateProblemResponse = GenerateProblemSuccess

export class ApiError extends Error {
  status: number
  details?: string[]
  constructor(message: string, status: number, details?: string[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

/**
 * Calls the real backend to generate a problem. No fallback or fake data.
 */
export async function generateProblem(pattern: DSAPattern): Promise<GenerateProblemSuccess> {
  let response: Response
  try {
    response = await fetch('/api/generate-problem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pattern }),
      signal: AbortSignal.timeout(70_000), // her route allows up to 60s
    })
  } catch {
    throw new ApiError('Could not reach the server or the request timed out. Please try again.', 0)
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const err = (data ?? {}) as Partial<ApiErrorResponse>
    throw new ApiError(
      err.error ?? `Request failed (status ${response.status}).`,
      response.status,
      err.details,
    )
  }

  const success = data as Partial<GenerateProblemSuccess> | null
  if (!success?.success || !success.result) {
    throw new ApiError('The server returned an unexpected response.', response.status)
  }

  return success as GenerateProblemSuccess
}