export type DSAConstraintPattern = 'Two Pointers' | 'Sliding Window' | 'Binary Search' | 'Dynamic Programming';

export interface ProblemExample {
  input: string;
  output: string;
  explanation: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface GeneratedProblemResult {
  title: string;
  problemStatement: string;
  constraints: string[];
  examples: ProblemExample[];
  patternReasoning: string;
  expectedApproach: string;
  testCases: TestCase[];
}

export interface GenerateProblemResponse {
  success: boolean;
  pattern: string;
  result: GeneratedProblemResult;
  validation: {
    schemaValid: boolean;
    judge0Verified: boolean;
  };
}

/**
 * Calls the backend API to generate a DSA problem for a specific pattern.
 * Prevents direct browser-side LLM calls and handles safety checks.
 */
export async function generateProblem(pattern: DSAConstraintPattern): Promise<GenerateProblemResponse> {
  const response = await fetch('/api/generate-problem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pattern }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Failed to generate problem (Status ${response.status}): ${errorBody || response.statusText}`);
  }

  const data: GenerateProblemResponse = await response.json();

  if (!data.success || !data.result) {
    throw new Error('Received an invalid or unsuccessful response structure from the backend.');
  }

  return data;
}