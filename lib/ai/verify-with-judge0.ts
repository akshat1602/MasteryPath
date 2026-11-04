
import {
  REFERENCE_LANGUAGE_ID,
  REFERENCE_SOLUTIONS,
} from "./reference-solutions";
import type { GeneratedProblem, ProblemType } from "./problem-types";

type Judge0TestCase = {
  stdin: string;
  expected_output: string;
};

type Judge0Response = {
  verdict?: string;
  accepted?: boolean;
  error?: string;
  results?: Array<{
    passed?: boolean;
    status?: string;
  }>;
};

export async function verifyReferenceWithJudge0(
  problem: GeneratedProblem,
  problemType: ProblemType,
): Promise<boolean> {
  // Only problem types with trusted reference solutions can be verified.
  const referenceSolution = REFERENCE_SOLUTIONS[problemType as keyof typeof REFERENCE_SOLUTIONS];

  if (!referenceSolution) {
    return false;
  }

  const testCases: Judge0TestCase[] = problem.testCases.map((test) => ({
    stdin: test.input,
    expected_output: test.expectedOutput,
  }));

  if (testCases.length === 0 || testCases.length > 5) {
    return false;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/judge0/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: referenceSolution,
          language_id: REFERENCE_LANGUAGE_ID,
          test_cases: testCases,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(90000),
      },
    );

        if (!response.ok) {
      console.error(
        "[Judge0 endpoint error]",
        response.status,
        await response.text(),
      );
      return false;
    }

    const result = (await response.json()) as Judge0Response;

    return (
      result.verdict === "ACCEPTED" &&
      result.accepted === true &&
      result.results?.length === testCases.length &&
      result.results.every((test) => test.passed === true)
    );
    } catch (error) {
    console.error(
      "[Judge0 verification error]",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
