import type { GeneratedProblem } from '@/lib/ai/problem-types'
import type { Judge0Response } from '@/types/api'
import { ApiError } from './problemService'

export const LANGUAGES = [
  { label: 'Python 3', id: 100 },
  { label: 'C++ (GCC)', id: 105 },
  { label: 'Java 17', id: 91 },
] as const

export type LanguageId = (typeof LANGUAGES)[number]['id']

const MAX_TESTS = 5 // her endpoint rejects more than 5

export async function runAndVerify(
  sourceCode: string,
  languageId: LanguageId,
  testCases: GeneratedProblem['testCases'],
): Promise<Judge0Response> {
  if (!sourceCode.trim()) {
    throw new ApiError('Write some code before running.', 400)
  }

  let response: Response
  try {
    response = await fetch('/api/judge0/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        test_cases: testCases.slice(0, MAX_TESTS).map((t) => ({
          stdin: t.input,
          expected_output: t.expectedOutput,
        })),
      }),
      signal: AbortSignal.timeout(100_000), // up to 5 sequential runs x 15s
    })
  } catch {
    throw new ApiError('Could not reach the server or the run timed out.', 0)
  }

  const data = (await response.json().catch(() => null)) as Judge0Response | null

  // 502s still carry a verdict (RATE_LIMITED, SERVICE_ERROR...), so return the body
  if (data?.verdict) return data

  throw new ApiError(data?.error ?? `Run failed (status ${response.status}).`, response.status)
}