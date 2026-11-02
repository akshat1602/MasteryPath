import type { DSAPattern } from '@/lib/ai/problem-types'
import type { GenerateProblemSuccess } from '@/types/api'

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface GenerateOptions {
  difficulty?: string
  problemType?: string
  previousProblemType?: string
}

export const SUPPORTED_PATTERNS = ['Two Pointers', 'Sliding Window', 'Arrays']

export async function generateProblem(
  pattern: DSAPattern,
  options?: GenerateOptions
): Promise<GenerateProblemSuccess> {
  const res = await fetch('/api/generate-problem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pattern, ...options }),
  })
  
  if (!res.ok) {
    throw new ApiError('Failed to generate problem', res.status)
  }
  
  return res.json()
}