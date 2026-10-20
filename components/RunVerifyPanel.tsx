'use client'

import React, { useState } from 'react'
import type { GeneratedProblem } from '@/lib/ai/problem-types'
import type { Judge0Response, Judge0TestResult } from '@/types/api'
import { LANGUAGES, runAndVerify, type LanguageId } from '@/lib/services/judgeService'
import { STARTERS } from '@/lib/starterCode'

type Props = {
  testCases: GeneratedProblem['testCases']
}

// Turn Judge0's raw failure into a clear label, only from what the backend actually gave us
function describeFailure(r?: Judge0TestResult): { label: string; detail: string | null } {
  const status = r?.status ?? ''
  const compile = r?.compile_output?.trim()
  const stderr = r?.stderr?.trim()

  if (compile || /compilation/i.test(status)) {
    return { label: 'Compilation error', detail: compile || null }
  }
  if (/time limit/i.test(status)) {
    return { label: 'Time limit exceeded', detail: 'Your solution took too long. Try a more efficient approach.' }
  }
  if (/runtime|nzec|signal/i.test(status) || stderr) {
    return { label: 'Runtime error', detail: stderr || null }
  }
  return { label: status || 'Execution failed', detail: stderr || null }
}

export default function RunVerifyPanel({ testCases }: Props) {
  const [languageId, setLanguageId] = useState<LanguageId>(LANGUAGES[0].id)
  const [code, setCode] = useState<string>(STARTERS[LANGUAGES[0].id])
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<Judge0Response | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRun = async () => {
    setError(null)
    setResult(null)

    if (!code.trim() || code === STARTERS[languageId]) {
      setError('Write some code before running.')
      return
    }

    setRunning(true)
    try {
      const res = await runAndVerify(code, languageId, testCases)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while running your code.')
    } finally {
      setRunning(false)
    }
  }

  const renderResult = () => {
    if (!result) return null
    const results = result.results ?? []
    const total = result.totalTests ?? results.length

    // Only claim success when the backend says so
    if (result.verdict === 'ACCEPTED' && result.accepted === true) {
      return (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 text-sm text-emerald-300">
          <p className="font-semibold">✓ All {total} tests passed</p>
          <p className="mt-1 text-xs text-[#9A9692]">Checked against {total} generated test cases.</p>
        </div>
      )
    }

    if (result.verdict === 'WRONG_ANSWER') {
      return (
        <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 text-sm text-red-300 space-y-3">
          <p className="font-semibold">
            ✕ Wrong answer: {result.passedTests ?? 0}/{total} tests passed
          </p>
          <ul className="space-y-1 text-xs font-mono text-[#D0D0D0]">
            {results.map((r) => (
              <li key={r.testCase} className="flex items-center justify-between gap-3">
                <span>Test {r.testCase}</span>
                <span className={r.passed ? 'text-emerald-300' : 'text-red-300'}>
                  {r.passed ? 'Passed' : 'Wrong answer'}
                  {r.time ? ` · ${r.time}s` : ''}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#9A9692]">Expected outputs for hidden tests are not shown.</p>
        </div>
      )
    }

    if (result.verdict === 'EXECUTION_FAILED') {
      const failed = results[results.length - 1]
      const { label, detail } = describeFailure(failed)
      return (
        <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 text-sm text-red-300 space-y-2">
          <p className="font-semibold">
            ✕ {label}
            {failed ? ` (test ${failed.testCase})` : ''}
          </p>
          {detail && (
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#090807] p-3 text-xs text-[#D0D0D0] font-mono">
              {detail}
            </pre>
          )}
          <p className="text-xs text-[#9A9692]">Execution stopped at the first failing test.</p>
        </div>
      )
    }

    // RATE_LIMITED, SERVICE_UNAVAILABLE, SERVICE_ERROR: no correctness verdict exists
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 text-sm text-amber-300 space-y-1">
        <p className="font-semibold">No verdict was produced</p>
        <p className="text-xs text-[#D0D0D0]">
          {result.error ?? 'The execution service had a problem.'} This does not mean your code is wrong. Please try again.
        </p>
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-[#292725] bg-[#11100F] p-4 space-y-4 sm:p-6" aria-labelledby="solve-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="solve-heading" className="whitespace-nowrap text-lg font-semibold">
          Your Solution
        </h3>
        <div className="flex items-center gap-2">
          <label htmlFor="language" className="text-xs text-[#9A9692]">
            Language
          </label>
          <select
            id="language"
            value={languageId}
            onChange={(e) => {
              const next = Number(e.target.value) as LanguageId
              if (!code.trim() || code === STARTERS[languageId]) setCode(STARTERS[next])
              setLanguageId(next)
            }}
            disabled={running}
            className="h-9 rounded-lg border border-[#292725] bg-[#090807] px-3 text-sm text-white outline-none focus:border-[#A78BFA] focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="code" className="text-sm text-[#9A9692]">
          Read input from standard input, exactly as shown in the examples, and print the answer.
        </label>
        <textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={running}
          rows={14}
          spellCheck={false}
          placeholder="Write your code here..."
          className="w-full resize-y rounded-xl border border-[#292725] bg-[#090807] p-4 font-mono text-sm text-white outline-none focus:border-[#A78BFA] focus-visible:ring-2 focus-visible:ring-[#A78BFA] placeholder:text-[#55524F]"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-xs text-[#8F8B87]">Runs up to {Math.min(testCases.length, 5)} tests. This can take a little while.</p>
        <button
          onClick={handleRun}
          disabled={running}
          className="h-10 w-full whitespace-nowrap px-5 sm:w-auto rounded-lg bg-white text-[#090807] text-sm font-semibold hover:bg-[#E5E5E5] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#11100F]"
        >
          {running ? 'Running tests…' : 'Run & Verify'}
        </button>
      </div>

      <div aria-live="polite" className="space-y-3">
        {error && <p className="text-sm text-red-400">{error}</p>}
        {renderResult()}
      </div>
    </section>
  )
}