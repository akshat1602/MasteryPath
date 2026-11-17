// types/api.ts
// API contracts between the frontend and the AI/backend routes.
// CONFIRMED = verified against the real route code.

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
  // WARNING: hidden expected outputs must not reach the browser.
  // Backend should stop returning this for hidden tests.
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

/* ───────── Adaptive engine ───────── */
// Fed by code-execution results ONLY, never by the conceptual evaluator.
// NOTE: there is no HTTP route for this yet; the logic lives in lib/ai/adaptive-engine.ts.

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

/* ───────── POST /api/rag/answer (CONFIRMED from route) ───────── */
// Request is multipart/form-data: file (PDF) + question (string), so no JSON type.
// No page numbers: only totalPages is returned.

export type RagSource = {
  chunkIndex: number
  score: number
  text: string
}

export type RagMetadata = {
  provider: string
  model: string
  totalPages: number
  totalChunks: number
  retrievedChunks: number
}

export type RagAnswerResponse = {
  answer: string
  sources: RagSource[]
  // Missing on the "no readable text" and "no relevant chunks" replies
  metadata?: RagMetadata
}

/* ───────── POST /api/evaluate-answer (CONFIRMED from route) ───────── */
// Conceptual AI assessment only. Code correctness comes from Judge0.

export type EvaluationVerdict =
  | 'CORRECT'
  | 'PARTIALLY_CORRECT'
  | 'INCORRECT'
  | 'NEEDS_CLARIFICATION'

export type EvaluateAnswerRequest = {
  problemStatement: string
  expectedApproach: string
  studentAnswer: string
  studentCode?: string
  difficulty?: Difficulty
}

export type EvaluateAnswerResponse = {
  verdict: EvaluationVerdict
  conceptualScore: number // integer 0-100
  strengths: string[]
  mistakes: string[]
  missingConcepts: string[]
  feedback: string
  nextStep: string
  verificationStatus: 'AI_CONCEPTUAL_ASSESSMENT_ONLY'
  model: string
}