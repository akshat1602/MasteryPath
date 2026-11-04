

import type {
  DSAPattern,
  ProblemType,
  GeneratedProblem,
  Difficulty,
  GenerateProblemRequest,
} from '@/lib/ai/problem-types'

// Single source of truth lives in problem-types.ts; re-exported for convenience.
export type { Difficulty, GenerateProblemRequest }

/* ───────── /api/generate-problem ───────── */

export type GenerateProblemSuccess = {
  success: true
  pattern: DSAPattern
  problemType: ProblemType
  result: GeneratedProblem
  validation: {
    schemaValid: boolean
    referenceVerified: boolean
    judge0Verified: boolean
  }
}

export type ApiErrorResponse = {
  error: string
  details?: string[]
  supportedProblemTypes?: ProblemType[]
}

export type GenerateProblemResponse = GenerateProblemSuccess | ApiErrorResponse

/* ───────── /api/judge0/submit ───────── */

export type Judge0Verdict =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'EXECUTION_FAILED'
  | 'SERVICE_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'SERVICE_ERROR'

export type Judge0TestResult = {
  testCase: number
  status: string
  passed: boolean
  stdout: string | null
  // WARNING: hidden expected outputs must not reach the browser (Step 4).
  expected_output?: string
  stderr?: string | null
  compile_output?: string | null
  time?: string | null
  memory?: number | null
}

export type Judge0Response = {
  verdict?: Judge0Verdict
  accepted?: boolean
  passedTests?: number
  completedTests?: number
  totalTests?: number
  results?: Judge0TestResult[]
  error?: string
  serviceStatus?: number
}

/* ───────── Adaptive engine (CONFIRMED) ───────── */
// Fed by code-execution results ONLY, never by the conceptual evaluator.

export type AdaptiveVerdict = Judge0Verdict

export type AdaptiveInput = {
  currentDifficulty: Difficulty
  verdict: AdaptiveVerdict
  accepted: boolean
  attempts: number
  hintsUsed: number
}

export type AdaptiveAction = 'increase' | 'maintain' | 'retry' | 'retry_later'

export type AdaptiveOutput = {
  nextDifficulty: Difficulty
  action: AdaptiveAction
  updateLearningPerformance: boolean
  reason: string
}

/* ───────── POST /api/rag/answer (PARTIALLY CONFIRMED) ───────── */
// Request is multipart/form-data: file (PDF) + question (string), so no JSON type.

// UNCONFIRMED: exact fields (page numbers especially)
export type RagSource = Record<string, unknown>

// UNCONFIRMED: provider/model info
export type RagMetadata = Record<string, unknown>

export type RagAnswerResponse = {
  answer: string
  sources: RagSource[]
  metadata: RagMetadata
}

/* ───────── POST /api/evaluate-answer (UNCONFIRMED field names) ───────── */

export type EvaluateAnswerResponse = {
  verdict?: string
  conceptualScore?: number
  strengths?: string[]
  mistakes?: string[]
  missingConcepts?: string[]
  feedback?: string
  nextStep?: string
}