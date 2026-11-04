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

export const SUPPORTED_PATTERNS = ['Two Pointers', 'Sliding Window', 'Arrays']

export async function generateProblem(
  pattern: DSAPattern,
  options: GenerateOptions = {}
): Promise<GenerateProblemSuccess> {
  // Enforce Step 2: pattern is required; dynamically append optional fields only if they hold a concrete value
  const body: GenerateProblemRequest = { pattern }
  
  if (options.difficulty) body.difficulty = options.difficulty
  if (options.problemType) body.problemType = options.problemType
  if (options.previousProblemType) body.previousProblemType = options.previousProblemType

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

  if (!res.ok || !json || ('error' in json)) {
    const message = json && 'error' in json ? json.error : `Request failed (${res.status})`
    const details = json && 'details' in json ? json.details : undefined
    throw new ApiError(message, res.status, details)
  }

  return json
}