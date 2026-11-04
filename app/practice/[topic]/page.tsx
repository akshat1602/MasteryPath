'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { generateProblem, ApiError } from '@/lib/services/problemService'
import type { Difficulty, GeneratedProblem, ProblemType } from '@/lib/ai/problem-types'
import { TOPICS, getTopicBySlug, getTestedTypes } from '@/lib/topics'
import RunVerifyPanel from '@/components/RunVerifyPanel'
import CopyButton from '@/components/CopyButton'

// Starting level from the project brief. Adapting it later is Anshika's logic, not the UI's.
const DEFAULT_DIFFICULTY: Difficulty = 'Medium'

// Rotate through tested types so the same one is not served twice in a row
function pickNextType(tested: ProblemType[], last: ProblemType | null): ProblemType | undefined {
  if (tested.length === 0) return undefined
  if (!last) return tested[0]
  const i = tested.indexOf(last)
  return tested[(i + 1) % tested.length]
}

export default function PracticeTopicPage() {
  const params = useParams<{ topic: string }>()
  const router = useRouter()
  const topic = getTopicBySlug(params.topic)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [problem, setProblem] = useState<GeneratedProblem | null>(null)
  const [referenceVerified, setReferenceVerified] = useState(false)
  const [problemId, setProblemId] = useState(0)
  const [currentType, setCurrentType] = useState<ProblemType | null>(null)
  
  // Track hints for the adaptive engine
  const [hintsUsed, setHintsUsed] = useState(0)

  const handleGenerate = async () => {
    if (!topic?.pattern) return
    setLoading(true)
    setError(null)
    setHintsUsed(0) // Reset hints on new problem
    
    try {
      const requestedType = pickNextType(getTestedTypes(topic), currentType)
      
      const res = await generateProblem(topic.pattern, {
        difficulty: DEFAULT_DIFFICULTY,
        problemType: requestedType,
        previousProblemType: currentType ?? undefined,
      })
      
      setProblem(res.result)
      setProblemId((n) => n + 1)
      setReferenceVerified(res.validation.referenceVerified)
      setCurrentType(res.problemType ?? requestedType ?? null)
    } catch (err) {
      if (err instanceof ApiError && err.details?.length) {
        setError(`${err.message} (${err.details.join(', ')})`)
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong while generating the problem.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTopicChange = (newSlug: string) => {
    router.push(`/practice/${newSlug}`)
  }

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-[#090807] text-white px-6 py-10">
      <div className="mx-auto max-w-4xl">{children}</div>
    </div>
  )

  const backLink = (
    <Link href="/dashboard/paths" className="whitespace-nowrap text-sm font-medium text-[#9A9692] hover:text-white transition-colors">
      ← Back to Learning Paths
    </Link>
  )

  if (!topic) {
    return shell(
      <div className="rounded-2xl border border-[#292725] bg-[#11100F] p-10 text-center space-y-4">
        <h1 className="text-xl font-bold">Topic not found</h1>
        {backLink}
      </div>,
    )
  }

  if (topic.status === 'pending' || !topic.pattern) {
    return shell(
      <>
        <div className="mb-8 border-b border-[#292725] pb-4 flex items-center justify-between">
          {backLink}
          <select
            aria-label="Switch topic"
            value={topic.slug}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="h-9 rounded-lg border border-[#292725] bg-[#11100F] px-3 text-xs text-white outline-none focus:border-white focus:ring-1 focus:ring-white"
          >
            {TOPICS.map((t) => (
              <option key={t.slug} value={t.slug} disabled={t.status === 'pending'}>
                {t.label} {t.status === 'pending' ? '· Coming soon' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-2xl border border-[#292725] bg-[#11100F] p-10 text-center space-y-4">
          <span className="rounded-full bg-[#1A1816] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 border border-amber-500/30">
            Pending Backend Validation
          </span>
          <h1 className="text-2xl font-bold">{topic.label}</h1>
          <p className="text-sm text-[#9A9692] max-w-md mx-auto leading-relaxed">
            Problem generation and reference validator pipeline for {topic.label} are currently under integration. This topic will unlock as soon as backend end-to-end verification completes.
          </p>

          {topic.problems.length > 0 && (
            <div className="pt-6 border-t border-[#292725] max-w-md mx-auto text-left">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#73706D] mb-3">Planned Problem Types</h3>
              <ul className="space-y-2 text-xs">
                {topic.problems.map((p) => (
                  <li key={p.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[#242220] bg-[#141210]">
                    <span className="text-[#D0D0D0]">{p.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono ${
                      p.status === 'tested' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-[#1F1F1F] text-[#73706D]'
                    }`}>
                      {p.status === 'tested' ? 'Tested' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </>,
    )
  }

  return shell(
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#292725] pb-4">
        {backLink}
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="topic-selector" className="sr-only">Switch Topic</label>
          <select
            id="topic-selector"
            value={topic.slug}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="h-9 rounded-lg border border-[#292725] bg-[#11100F] px-3 text-xs font-medium text-white outline-none focus:border-white focus:ring-1 focus:ring-white"
          >
            {TOPICS.map((t) => (
              <option key={t.slug} value={t.slug} disabled={t.status === 'pending'}>
                {t.label} {t.status === 'pending' ? '· Coming soon' : ''}
              </option>
            ))}
          </select>
          <span className="rounded-full bg-[#1A1816] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#A8A39E] border border-[#292725]">
            {topic.category}
          </span>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Problem Workspace</h1>
          <p className="text-sm text-[#9A9692] mt-1">Generated by the AI engine and verified against sandbox test cases.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="h-10 w-full whitespace-nowrap px-5 sm:w-auto rounded-lg bg-white text-[#090807] text-sm font-semibold hover:bg-[#E5E5E5] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#090807]"
        >
          {loading ? 'Generating… (up to a minute)' : problem ? 'Generate New Problem' : 'Generate Problem'}
        </button>
      </div>

      {topic.problems.length > 0 && (
        <div className="mb-8 rounded-xl border border-[#242220] bg-[#11100F] p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#73706D]">
              Topic Problem Variants & Validation Status
            </h3>
            <span className="text-[11px] text-[#A8A39E] font-mono">Module 3 Scope</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topic.problems.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-2 rounded-lg border bg-[#141210] px-3 py-1.5 text-xs ${
                  p.id === currentType ? 'border-[#D0D0D0] ring-1 ring-[#D0D0D0]' : 'border-[#292725]'
                }`}
              >
                <span className="text-[#D0D0D0] font-medium">{p.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase font-mono ${
                  p.status === 'tested'
                    ? 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                    : 'border border-amber-500/30 bg-amber-950/30 text-amber-300'
                }`}>
                  {p.status === 'tested' ? '✓ Tested' : 'Pending'}
                </span>
                {p.id === currentType && <span className="text-[10px] font-mono text-[#D0D0D0]">Current</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && !problem && (
        <div role="status" aria-live="polite" className="rounded-2xl border border-[#292725] bg-[#11100F] p-12 text-center space-y-4">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
          <p className="text-sm text-[#9A9692]">Generating and verifying your problem…</p>
        </div>
      )}

      {!loading && !problem && !error && (
        <div className="rounded-2xl border border-dashed border-[#292725] p-12 text-center text-sm text-[#9A9692]">
          Click <span className="text-white font-semibold">Generate Problem</span> to create a verified variation.
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-center space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-red-400">Generation failed</h3>
          <p className="text-sm text-[#9A9692] max-w-md mx-auto">{error}</p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Try again
          </button>
        </div>
      )}

      {problem && !loading && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-[#292725] bg-[#11100F] p-5 space-y-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-2xl font-bold">{problem.title}</h2>
              {referenceVerified && (
                <span className="shrink-0 rounded-full border border-emerald-500/40 bg-emerald-950/20 px-3 py-1 text-xs text-emerald-300">
                  Outputs checked
                </span>
              )}
            </div>
            <div className="text-sm leading-relaxed text-[#D0D0D0] whitespace-pre-wrap">{problem.problemStatement}</div>

            {problem.constraints.length > 0 && (
              <div className="pt-4 border-t border-[#292725]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9A9692] mb-3">Constraints</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-[#A5A19D] font-mono">
                  {problem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Examples</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-[#292725] bg-[#11100F] p-6 space-y-3 font-mono text-sm">
                <div className="text-xs uppercase tracking-wider text-[#73706D] font-sans font-semibold">Example {i + 1}</div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9A9692]">Input:</span>
                    <CopyButton text={ex.input} />
                  </div>
                  <pre className="mt-1 whitespace-pre-wrap text-white">{ex.input}</pre>
                </div>
                <div>
                  <span className="text-[#9A9692]">Output:</span> <span className="text-white">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="pt-2 border-t border-[#292725] text-xs text-[#9A9692] font-sans">
                    <span className="font-semibold text-white">Explanation:</span> {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <details 
            className="rounded-2xl border border-[#292725] bg-[#11100F] p-6"
            onToggle={(e) => {
              if (e.currentTarget.open) setHintsUsed(1)
            }}
          >
            <summary className="cursor-pointer text-sm font-semibold text-white hover:text-[#D0D0D0] transition-colors">
              Show hint (reveals the approach)
            </summary>
            <div className="mt-4 space-y-4 text-sm text-[#9A9692] leading-relaxed">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D0D0D0] mb-1">Pattern reasoning</h4>
                <p>{problem.patternReasoning}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4ADE80] mb-1">Expected approach</h4>
                <p>{problem.expectedApproach}</p>
              </div>
            </div>
          </details>

          <RunVerifyPanel 
            key={problemId} 
            testCases={problem.testCases} 
            hintsUsed={hintsUsed}
            currentDifficulty={DEFAULT_DIFFICULTY} 
          />
        </div>
      )}
    </>
  )
}