import type { GeneratedProblem } from '@/lib/ai/problem-types'
import type { Judge0Response } from '@/types/api'
import { ApiError } from './problemService'

export const LANGUAGES = [
  { label: 'Python 3', id: 100 },
  { label: 'C++ (GCC)', id: 105 },
  { label: 'Java 17', id: 91 },
] as const

export type LanguageId = (typeof LANGUAGES)[number]['id']

// Step 4: Hidden Test Case Stopgap
// We restrict the payload to only public sample cases (first 2) to prevent exposing 
// hidden expected outputs to the client network tab.
const PUBLIC_TESTS = 2 

export async function runAndVerify(
  sourceCode: string,
  languageId: LanguageId,
  testCases: GeneratedProblem['testCases'],
): Promise<Judge0Response> {
  if (!sourceCode.trim()) {
    throw new ApiError('Write some code before running.', 400)
  }

  // Strip hidden test cases from the client payload completely
  const publicCases = testCases.slice(0, PUBLIC_TESTS)

  let response: Response
  try {
    response = await fetch('/api/judge0/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        test_cases: publicCases.map((t) => ({
          stdin: t.input,
          expected_output: t.expectedOutput,
        })),
      }),
      signal: AbortSignal.timeout(100_000), // up to 2 sequential runs
    })
  } catch {
    throw new ApiError('Could not reach the server or the run timed out.', 0)
  }

  const data = (await response.json().catch(() => null)) as Judge0Response | null

  if (data?.verdict) {
    // Sanitize the returned results to ensure no backend debugging fields leak expected outputs
   if (data.results) {
      data.results = data.results.map((r) => ({
        testCase: r.testCase,
        status: r.status,
        passed: r.passed,
        time: r.time,
        compile_output: r.compile_output,
        stderr: r.stderr,
      })) as any // <-- Add the type override here
    }
    
    return data
  }

  throw new ApiError(data?.error ?? `Run failed (status ${response.status}).`, response.status)
}