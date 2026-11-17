import type { DSAPattern, Difficulty, ProblemType } from '@/lib/ai/problem-types'
import type {
  GenerateProblemRequest,
  GenerateProblemSuccess,
  ApiErrorResponse,
} from '@/types/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: string[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface GenerateOptions {
  difficulty?: Difficulty
  problemType?: ProblemType
  previousProblemType?: ProblemType
}

// Generation sometimes fails validation at random (about 1 call in 25).
// One quick retry hides that from students. Only server-side failures are retried.
const MAX_ATTEMPTS = 2
const RETRYABLE_STATUSES = new Set([502, 503, 504])

export async function generateProblem(
  pattern: DSAPattern,
  options: GenerateOptions = {}
): Promise<GenerateProblemSuccess> {
  // pattern is always sent; optional fields only when they have a real value
  const body: GenerateProblemRequest = { pattern }
  if (options.difficulty) body.difficulty = options.difficulty
  if (options.problemType) body.problemType = options.problemType
  if (options.previousProblemType) {
    body.previousProblemType = options.previousProblemType
  }

  let lastError: ApiError | null = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let res: Response
    try {
      res = await fetch('/api/generate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
      throw new ApiError('Network error. Check your connection and try again.')
    }

    const json = (await res.json().catch(() => null)) as
      | GenerateProblemSuccess
      | ApiErrorResponse
      | null

    if (res.ok && json && !('error' in json)) {
      return json
    }

    const message =
      json && 'error' in json ? json.error : `Request failed (${res.status})`
    const details = json && 'details' in json ? json.details : undefined
    lastError = new ApiError(message, res.status, details)

    if (!RETRYABLE_STATUSES.has(res.status)) break
  }

  throw lastError ?? new ApiError('Request failed')
}