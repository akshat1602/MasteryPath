"use client";

import { useState } from "react";

type Example = {
  input: string;
  output: string;
  explanation: string;
};

type TestCase = {
  input: string;
  expectedOutput: string;
};

type GeneratedProblem = {
  title: string;
  problemStatement: string;
  constraints: string[];
  examples: Example[];
  patternReasoning: string;
  expectedApproach: string;
  testCases: TestCase[];
};

type Verification = {
  schemaValid: boolean;
  referenceVerified: boolean;
  judge0Verified: boolean;
};

type JudgeCaseResult = {
  testCase: number;
  status: string;
  passed: boolean;
  stdout?: string | null;
  expected_output?: string;
  stderr?: string | null;
  compile_output?: string | null;
};

type JudgeSubmissionResult = {
  verdict?: string;
  accepted?: boolean;
  passedTests?: number;
  totalTests?: number;
  error?: string;
  results?: JudgeCaseResult[];
};

type Pattern = "Sliding Window" | "Two Pointers";

export default function Home() {
  const [pattern, setPattern] = useState<Pattern>("Two Pointers");
  const [problem, setProblem] = useState<GeneratedProblem | null>(null);
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sourceCode, setSourceCode] = useState("");
  const [languageId, setLanguageId] = useState<number>(100);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionResult, setSubmissionResult] =
    useState<JudgeSubmissionResult | null>(null);

  async function generateProblem() {
    setLoading(true);
    setError("");
    setProblem(null);
    setVerification(null);
    setSourceCode("");
    setSubmissionError("");
    setSubmissionResult(null);

    try {
      const response = await fetch("/api/generate-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.details?.join(" ") ||
            data.error ||
            "Could not generate a problem. Please try again.",
        );
      }

      setProblem(data.result);
      setVerification(data.validation ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitCode() {
    if (!problem) {
      setSubmissionError("Generate a problem first.");
      return;
    }

    if (!sourceCode.trim()) {
      setSubmissionError("Please write your solution first.");
      return;
    }

    if (problem.testCases.length === 0 || problem.testCases.length > 5) {
      setSubmissionError(
        "This problem must have between 1 and 5 test cases to run.",
      );
      return;
    }

    setSubmissionLoading(true);
    setSubmissionError("");
    setSubmissionResult(null);

    try {
      const response = await fetch("/api/judge0/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: languageId,
          test_cases: problem.testCases.map((test) => ({
            stdin: test.input,
            expected_output: test.expectedOutput,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Code submission failed. Please try again.",
        );
      }

      setSubmissionResult(data);
    } catch (err) {
      setSubmissionError(
        err instanceof Error
          ? err.message
          : "Something went wrong while running your code.",
      );
    } finally {
      setSubmissionLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            AI-powered DSA practice
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Mastery<span className="text-cyan-400">Path</span>
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Build real problem-solving understanding through generated
            problems, trusted reference checks, and clear explanations.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <label
            htmlFor="pattern"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Choose a DSA pattern
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              id="pattern"
              value={pattern}
              onChange={(event) =>
                setPattern(event.target.value as Pattern)
              }
              className="min-h-12 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 text-slate-100 outline-none focus:border-cyan-400"
            >
              <option value="Sliding Window">Sliding Window</option>
              <option value="Two Pointers">Two Pointers</option>
            </select>

            <button
              onClick={generateProblem}
              disabled={loading}
              className="min-h-12 rounded-lg bg-cyan-400 px-6 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Problem"}
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Currently supported: Sliding Window and Two Pointers, each with a
            defined problem template.
          </p>
        </section>

        {loading && (
          <p className="mt-6 animate-pulse text-cyan-300">
            Generating your problem with AI...
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-800 bg-red-950/50 p-4 text-red-200"
          >
            <p className="font-semibold">Generation failed</p>
            <p className="mt-1 text-sm">{error}</p>
            <button
              onClick={generateProblem}
              className="mt-3 rounded-lg border border-red-700 px-4 py-2 text-sm hover:bg-red-900"
            >
              Try again
            </button>
          </div>
        )}

        {problem && (
          <article className="mt-8 space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {pattern}
                </span>

                {verification?.referenceVerified && (
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Reference checked
                  </span>
                )}

                {verification && !verification.referenceVerified && (
                  <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                    Reference check incomplete
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold">{problem.title}</h2>
              <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
                {problem.problemStatement}
              </p>

              <h3 className="mt-6 font-semibold">Constraints</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">Examples</h3>
              <div className="mt-4 space-y-5">
                {problem.examples.map((example, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-slate-950 p-4"
                  >
                    <h4 className="font-semibold text-cyan-300">
                      Example {index + 1}
                    </h4>
                    <p className="mt-3 text-sm text-slate-400">Input</p>
                    <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 text-sm">
                      {example.input}
                    </pre>
                    <p className="mt-3 text-sm text-slate-400">Output</p>
                    <pre className="mt-1 overflow-x-auto rounded-lg bg-black/40 p-3 text-sm">
                      {example.output}
                    </pre>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {example.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">Understand the pattern</h3>
              <h4 className="mt-4 font-semibold text-cyan-300">
                Why this pattern?
              </h4>
              <p className="mt-2 leading-7 text-slate-300">
                {problem.patternReasoning}
              </p>

              <h4 className="mt-5 font-semibold text-cyan-300">
                Expected approach
              </h4>
              <p className="mt-2 leading-7 text-slate-300">
                {problem.expectedApproach}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">Write and test your solution</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Write a solution that reads input from standard input and prints
                the answer in the expected format. Your code will be executed
                against the generated test cases.
              </p>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-slate-300">
                  Programming language
                </span>
                <select
                  value={languageId}
                  onChange={(event) => setLanguageId(Number(event.target.value))}
                  className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 outline-none focus:border-cyan-400 sm:max-w-xs"
                >
                  <option value={100}>Python 3</option>
                  <option value={105}>C++</option>
                  <option value={91}>Java</option>
                </select>
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-slate-300">
                  Your code
                </span>
                <textarea
                  value={sourceCode}
                  onChange={(event) => setSourceCode(event.target.value)}
                  placeholder="Write your solution here..."
                  spellCheck={false}
                  rows={14}
                  className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400"
                />
              </label>

              <button
                onClick={submitCode}
                disabled={submissionLoading || loading}
                className="mt-4 min-h-11 rounded-lg bg-cyan-400 px-5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submissionLoading ? "Running tests..." : "Run & Verify"}
              </button>

              {submissionError && (
                <p role="alert" className="mt-4 text-sm text-red-300">
                  {submissionError}
                </p>
              )}

              {submissionResult && (
                <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4">
                  <h4
                    className={`font-semibold ${
                      submissionResult.accepted
                        ? "text-emerald-300"
                        : "text-amber-300"
                    }`}
                  >
                    Verdict: {submissionResult.verdict ?? "Unknown"}
                  </h4>

                  {submissionResult.passedTests !== undefined &&
                    submissionResult.totalTests !== undefined && (
                      <p className="mt-2 text-sm text-slate-300">
                        Tests passed: {submissionResult.passedTests} /{" "}
                        {submissionResult.totalTests}
                      </p>
                    )}

                  {submissionResult.error && (
                    <p className="mt-2 text-sm text-red-300">
                      {submissionResult.error}
                    </p>
                  )}

                  {submissionResult.results?.map((result) => (
                    <div
                      key={result.testCase}
                      className="mt-4 border-t border-slate-800 pt-3"
                    >
                      <p
                        className={
                          result.passed
                            ? "text-emerald-300"
                            : "text-amber-300"
                        }
                      >
                        Test {result.testCase}: {result.status}
                      </p>

                      {result.stdout != null && (
                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-slate-300">
                          Output: {result.stdout}
                        </pre>
                      )}

                      {result.expected_output != null && (
                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-slate-400">
                          Expected: {result.expected_output}
                        </pre>
                      )}

                      {result.stderr && (
                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-red-300">
                          {result.stderr}
                        </pre>
                      )}

                      {result.compile_output && (
                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-red-300">
                          {result.compile_output}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">Verification status</h3>

              <p className="mt-3 text-sm text-slate-300">
                Schema validation:{" "}
                <span
                  className={
                    verification?.schemaValid
                      ? "text-emerald-300"
                      : "text-amber-300"
                  }
                >
                  {verification?.schemaValid ? "Passed" : "Not confirmed"}
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Trusted reference check:{" "}
                <span
                  className={
                    verification?.referenceVerified
                      ? "text-emerald-300"
                      : "text-amber-300"
                  }
                >
                  {verification?.referenceVerified ? "Passed" : "Not confirmed"}
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Judge0 execution:{" "}
                <span
                  className={
                    submissionResult?.accepted
                      ? "text-emerald-300"
                      : "text-amber-300"
                  }
                >
                  {submissionResult
                    ? submissionResult.accepted
                      ? "Passed student tests"
                      : `Not accepted (${submissionResult.verdict ?? "unknown"})`
                    : "Awaiting student submission"}
                </span>
              </p>

              <p className="mt-3 text-sm text-slate-400">
                {problem.testCases.length} test cases are available to the
                backend.
              </p>
            </section>
          </article>
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
          MasteryPath · Final Year Project
        </footer>
      </div>
    </main>
  );
}
