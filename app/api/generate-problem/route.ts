
import { findLongestSubarrayLength } from "@/lib/ai/verify-two-pointers";
import { countClosePairs } from "@/lib/ai/verify-close-pairs";
import { validateGeneratedProblem } from "@/lib/ai/validate-problem";
import { buildProblemPrompt } from "@/lib/ai/build-prompt";
import type {
  GenerateProblemRequest,
  GeneratedProblem,
  ProblemType,
} from "@/lib/ai/problem-types";
const SUPPORTED_PROBLEM_TYPES: Record<
  GenerateProblemRequest["pattern"],
  ProblemType[]
> = {
  "Sliding Window": ["longest-subarray-target-sum"],
  "Two Pointers": ["count-close-pairs"],
};

const DEFAULT_PROBLEM_TYPE: Record<
  GenerateProblemRequest["pattern"],
  ProblemType
> = {
  "Sliding Window": "longest-subarray-target-sum",
  "Two Pointers": "count-close-pairs",
};

function isGeneratedProblem(value: unknown): value is GeneratedProblem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const problem = value as Record<string, unknown>;

  return (
    typeof problem.title === "string" &&
    problem.title.trim().length > 0 &&
    typeof problem.problemStatement === "string" &&
    problem.problemStatement.trim().length > 0 &&
    Array.isArray(problem.constraints) &&
    problem.constraints.length > 0 &&
    problem.constraints.every((item) => typeof item === "string") &&
    Array.isArray(problem.examples) &&
    problem.examples.length >= 2 &&
    problem.examples.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "input" in item &&
        typeof item.input === "string" &&
        "output" in item &&
        typeof item.output === "string" &&
        "explanation" in item &&
        typeof item.explanation === "string",
    ) &&
    typeof problem.patternReasoning === "string" &&
    typeof problem.expectedApproach === "string" &&
    Array.isArray(problem.testCases) &&
    problem.testCases.length >= 3 &&
    problem.testCases.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "input" in item &&
        typeof item.input === "string" &&
        "expectedOutput" in item &&
        typeof item.expectedOutput === "string",
    )
  );
}

function parseInput(input: string): number[] | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const tokens = trimmed.split(/\s+/);
  const values = tokens.map(Number);

  if (
    values.some(
      (value, index) =>
        tokens[index] === "" ||
        !Number.isSafeInteger(value),
    )
  ) {
    return null;
  }

  return values;
}

function verifyAndCorrectOutputs(
  problem: GeneratedProblem,
  pattern: GenerateProblemRequest["pattern"],
): boolean {
  function calculateOutput(input: string): number | null {
    const values = parseInput(input);

    if (!values || values.length < 3) {
      return null;
    }

    const [n, parameter, ...numbers] = values;

    if (
      !Number.isInteger(n) ||
      n < 1 ||
      !Number.isInteger(parameter) ||
      numbers.length !== n ||
      numbers.some((number) => !Number.isInteger(number))
    ) {
      return null;
    }

    if (pattern === "Sliding Window") {
      if (parameter < 0 || numbers.some((number) => number <= 0)) {
        return null;
      }

      return findLongestSubarrayLength(numbers, parameter);
    }

    if (parameter < 0) {
  return null;
}

    return countClosePairs(numbers, parameter);
  }

  for (const example of problem.examples) {
    const expected = calculateOutput(example.input);

    if (expected === null) {
      return false;
    }

    example.output = String(expected);
    example.explanation =
      pattern === "Sliding Window"
        ? expected === 0
          ? "No contiguous subarray sums to the target, so the answer is 0."
          : `The longest contiguous subarray summing to the target has length ${expected}.`
        : `There are ${expected} pairs whose absolute difference is at most K.`;
  }

  for (const testCase of problem.testCases) {
    const expected = calculateOutput(testCase.input);

    if (expected === null) {
      return false;
    }

    testCase.expectedOutput = String(expected);
  }

  return true;
}


export async function GET() {
  return Response.json({
    message: "MasteryPath problem-generation API is running.",
    provider: "Groq",
    supportedPatterns: ["Sliding Window", "Two Pointers"],
  });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured." },
        { status: 500 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null) {
      return Response.json(
        { error: "Request body must be a JSON object." },
        { status: 400 },
      );
    }

    const input = body as Record<string, unknown>;

    if (
      input.pattern !== "Two Pointers" &&
      input.pattern !== "Sliding Window"
    ) {
      return Response.json(
        {
          error:
            'Supported patterns are "Sliding Window" and "Two Pointers".',
        },
        { status: 400 },
      );
    }

    const pattern = input.pattern;

const requestedProblemType = input.problemType;

if (
  requestedProblemType !== undefined &&
  (typeof requestedProblemType !== "string" ||
    !SUPPORTED_PROBLEM_TYPES[pattern].includes(
      requestedProblemType as ProblemType,
    ))
) {
  return Response.json(
    {
      error:
        "Unsupported problem type for the selected pattern.",
      supportedProblemTypes: SUPPORTED_PROBLEM_TYPES[pattern],
    },
    { status: 400 },
  );
}

const problemRequest: GenerateProblemRequest = {
  pattern,
  problemType:
    requestedProblemType === undefined
      ? DEFAULT_PROBLEM_TYPE[pattern]
      : (requestedProblemType as ProblemType),
};

const prompt = buildProblemPrompt(problemRequest);

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                "You are MasteryPath's DSA problem generator. Return only a valid JSON object matching the requested schema. Do not include Markdown fences or text outside the JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_completion_tokens: 6000,
          reasoning_effort: "low",
          temperature: 0.2,
        }),
        signal: AbortSignal.timeout(60000),
        cache: "no-store",
      },
    );

    if (!groqResponse.ok) {
      const providerError = await groqResponse.text();

      console.error(
        "Groq request failed:",
        groqResponse.status,
        providerError.slice(0, 500),
      );

      return Response.json(
        {
          error:
            "The AI provider could not complete the request. Please try again.",
        },
        { status: 502 },
      );
    }

    const result = await groqResponse.json();
    const choice = result.choices?.[0];
    const generatedText = choice?.message?.content;

    if (
      typeof generatedText !== "string" ||
      generatedText.trim().length === 0
    ) {
      return Response.json(
        {
          error:
            "The AI did not return a usable problem. Please try again.",
        },
        { status: 502 },
      );
    }

    let parsedProblem: unknown;

    try {
      parsedProblem = JSON.parse(generatedText);
    } catch {
      return Response.json(
        {
          error:
            "The AI returned invalid JSON. Please try again.",
        },
        { status: 502 },
      );
    }

    if (!isGeneratedProblem(parsedProblem)) {
      return Response.json(
        {
          error:
            "The generated problem did not match the required format.",
        },
        { status: 502 },
      );
    }

    const problem = parsedProblem;

    // Recalculate outputs using the trusted algorithm for the selected template.
    const outputsCalculated = verifyAndCorrectOutputs(
      problem,
      problemRequest.pattern,
    );

    if (!outputsCalculated) {
  console.error(
    "Verification failed for pattern:",
    problemRequest.pattern,
    "problem type:",
    problemRequest.problemType,
    "examples:",
    JSON.stringify(problem.examples, null, 2),
    "test cases:",
    JSON.stringify(problem.testCases, null, 2),
  );

  return Response.json(
    {
      error:
        "The generated problem contains invalid input data for its selected pattern.",
    },
    { status: 502 },
  );
}

    const strategy =
  problemRequest.problemType === "longest-subarray-target-sum"
    ? "longest-subarray-target-sum"
    : "count-close-pairs";
    const validation = validateGeneratedProblem(problem, strategy);

    if (!validation.valid) {
      console.error(
        "Generated problem validation failed:",
        validation.errors,
      );

      return Response.json(
        {
          error: "The generated problem failed validation.",
          details: validation.errors,
        },
        { status: 502 },
      );
    }

    return Response.json({
  success: true,
  pattern: problemRequest.pattern,
  problemType: problemRequest.problemType,
  result: problem,
  validation: {
    schemaValid: validation.valid,
    referenceVerified: outputsCalculated && validation.valid,
    judge0Verified: false,
  },
});
  } catch (error) {
    console.error(
      "Problem-generation request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return Response.json(
      {
        error:
          "Unable to generate a problem right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
