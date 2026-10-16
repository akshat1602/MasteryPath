import type { DSAPattern, ProblemType, GeneratedProblem } from '@/lib/ai/problem-types'

// ---------- /api/generate-problem ----------
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

// ---------- /api/judge0/submit ----------
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