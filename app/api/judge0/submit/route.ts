
import { NextResponse } from "next/server";

const JUDGE0_URL = "https://ce.judge0.com";
const ALLOWED_LANGUAGES = [100, 105, 91];
const MAX_TEST_CASES = 5;

type TestCase = {
  stdin: string;
  expected_output: string;
};

function normalizeOutput(value: string): string {
  return value.trim().replace(/\r\n/g, "\n");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { source_code, language_id } = body;

    if (
      typeof source_code !== "string" ||
      !source_code.trim() ||
      source_code.length > 50000
    ) {
      return NextResponse.json(
        { error: "Provide valid source_code (maximum 50,000 characters)." },
        { status: 400 }
      );
    }

    if (!ALLOWED_LANGUAGES.includes(language_id)) {
      return NextResponse.json(
        { error: "Unsupported language_id. Use 100 (Python), 105 (C++), or 91 (Java)." },
        { status: 400 }
      );
    }

    let testCases: TestCase[];

    if (body.test_cases !== undefined) {
      if (
        !Array.isArray(body.test_cases) ||
        body.test_cases.length === 0 ||
        body.test_cases.length > MAX_TEST_CASES
      ) {
        return NextResponse.json(
          { error: `Provide between 1 and ${MAX_TEST_CASES} test cases.` },
          { status: 400 }
        );
      }

      if (
        !body.test_cases.every(
          (test: unknown) =>
            typeof test === "object" &&
            test !== null &&
            "stdin" in test &&
            "expected_output" in test &&
            typeof test.stdin === "string" &&
            typeof test.expected_output === "string" &&
            test.stdin.length <= 10000 &&
            test.expected_output.length <= 10000
        )
      ) {
        return NextResponse.json(
          { error: "Each test case needs string fields: stdin and expected_output." },
          { status: 400 }
        );
      }

      testCases = body.test_cases;
    } else {
      const stdin = body.stdin ?? "";
      const expectedOutput = body.expected_output;

      if (
        typeof stdin !== "string" ||
        stdin.length > 10000 ||
        typeof expectedOutput !== "string"
      ) {
        return NextResponse.json(
          { error: "Provide stdin and expected_output strings, or a test_cases array." },
          { status: 400 }
        );
      }

      testCases = [{ stdin, expected_output: expectedOutput }];
    }

    const results = [];

    for (let index = 0; index < testCases.length; index++) {
      const test = testCases[index];

      let judgeResponse: Response;

      try {
        judgeResponse = await fetch(
          `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source_code,
              language_id,
              stdin: test.stdin,
            }),
            signal: AbortSignal.timeout(15000),
            cache: "no-store",
          }
        );
      } catch {
        return NextResponse.json(
          {
            error: "Judge0 could not be reached or timed out. No correctness verdict was produced.",
            verdict: "SERVICE_UNAVAILABLE",
            completedTests: results.length,
            results,
          },
          { status: 502 }
        );
      }

      if (!judgeResponse.ok) {
        const limited = judgeResponse.status === 429;

        return NextResponse.json(
          {
            error: limited
              ? "Judge0 rate limit reached. Please try again later."
              : "Judge0 execution service returned an error.",
            verdict: limited ? "RATE_LIMITED" : "SERVICE_ERROR",
            serviceStatus: judgeResponse.status,
            completedTests: results.length,
            results,
          },
          { status: 502 }
        );
      }

      const result = await judgeResponse.json();
      const statusId = result.status?.id;
      const status = result.status?.description ?? "Unknown";

      if (statusId !== 3) {
        results.push({
          testCase: index + 1,
          status,
          passed: false,
          stdout: result.stdout ?? null,
          stderr: result.stderr ?? null,
          compile_output: result.compile_output ?? null,
        });

        return NextResponse.json({
          verdict: "EXECUTION_FAILED",
          accepted: false,
          completedTests: results.length,
          totalTests: testCases.length,
          results,
        });
      }

      const actual = normalizeOutput(result.stdout ?? "");
      const expected = normalizeOutput(test.expected_output);
      const passed = actual === expected;

      results.push({
        testCase: index + 1,
        status: passed ? "Passed" : "Wrong Answer",
        passed,
        stdout: result.stdout ?? "",
        expected_output: test.expected_output,
        time: result.time ?? null,
        memory: result.memory ?? null,
      });
    }

    const passedCount = results.filter((result) => result.passed).length;

    return NextResponse.json({
      verdict: passedCount === testCases.length ? "ACCEPTED" : "WRONG_ANSWER",
      accepted: passedCount === testCases.length,
      passedTests: passedCount,
      totalTests: testCases.length,
      results,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request or unexpected server error." },
      { status: 400 }
    );
  }
}
