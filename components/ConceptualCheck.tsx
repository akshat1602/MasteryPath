'use client'

import React, { useState } from 'react'
import type { Difficulty } from '@/lib/ai/problem-types'
import type { EvaluateAnswerRequest, EvaluateAnswerResponse, EvaluationVerdict } from '@/types/api'

type Props = {
  problemStatement: string
  expectedApproach: string
  difficulty: Difficulty
}

const VERDICT_UI: Record<EvaluationVerdict, { label: string; box: string; text: string }> = {
  CORRECT: {
    label: '✓ Sound approach',
    box: 'border-emerald-500/40 bg-emerald-950/20',
    text: 'text-emerald-400',
  },
  PARTIALLY_CORRECT: {
    label: '⚠ Partly there',
    box: 'border-amber-500/40 bg-amber-950/20',
    text: 'text-amber-400',
  },
  INCORRECT: {
    label: '✕ Needs rework',
    box: 'border-red-500/40 bg-red-950/20',
    text: 'text-red-400',
  },
  NEEDS_CLARIFICATION: {
    label: '? Needs more detail',
    box: 'border-[#292725] bg-[#141210]',
    text: 'text-[#D0D0D0]',
  },
}

export default function ConceptualCheck({ problemStatement, expectedApproach, difficulty }: Props) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<EvaluateAnswerResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) {
      setError('Please explain your approach before submitting.')
      return
    }

    setSubmitting(true)
    setError(null)
    setResult(null)

    try {
      const payload: EvaluateAnswerRequest = {
        problemStatement,
        expectedApproach,
        studentAnswer: answer.trim(),
        difficulty,
      }

      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json().catch(() => null)

      if (!res.ok || !json || 'error' in json) {
        setError(json?.error ?? `Evaluation failed (${res.status}). Please try again.`)
        return
      }

      setResult(json as EvaluateAnswerResponse)
    } catch {
      setError('Network error. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const ui = result ? VERDICT_UI[result.verdict] ?? VERDICT_UI.NEEDS_CLARIFICATION : null

  return (
    <section className="rounded-2xl border border-[#292725] bg-[#11100F] p-4 space-y-4 sm:p-6" aria-labelledby="concept-heading">
      <div>
        <h3 id="concept-heading" className="text-lg font-semibold">
          Explain your approach
        </h3>
        <p className="mt-1 text-xs text-[#9A9692]">
          Describe in plain English how you would solve it and why it works. This is checked for understanding.
          Your code is checked separately by Run &amp; Verify.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitting}
          rows={6}
          maxLength={4000}
          placeholder="In plain English, explain your approach, its time and space cost, and any edge cases..."
          className="w-full resize-y rounded-xl border border-[#292725] bg-[#090807] p-4 text-sm text-white outline-none focus:border-[#A78BFA] placeholder:text-[#55524F] disabled:opacity-50"
        />
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting || !answer.trim()}
            className="h-10 rounded-lg bg-white px-5 text-sm font-semibold text-[#090807] transition-all hover:bg-[#E5E5E5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Evaluating…' : 'Submit explanation'}
          </button>
        </div>
      </form>

      <div aria-live="polite" className="space-y-3">
        {error && (
          <p role="alert" className="rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}

        {result && ui && (
          <div className={`space-y-4 rounded-xl border p-5 text-sm ${ui.box}`}>
            <div className="flex items-center justify-between border-b border-[#292725] pb-3">
              <span className={`font-semibold ${ui.text}`}>{ui.label}</span>
              <span className="text-xs font-mono text-[#A8A39E]">Score: {result.conceptualScore}/100</span>
            </div>

            <p className="break-words leading-relaxed text-[#D0D0D0]">{result.feedback}</p>

            {result.strengths.length > 0 && (
              <div>
                <h4 className="mb-1 text-[10px] uppercase tracking-wider text-emerald-400/80">Strengths</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-[#9A9692]">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="break-words">{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.mistakes.length > 0 && (
              <div>
                <h4 className="mb-1 text-[10px] uppercase tracking-wider text-amber-400/80">Mistakes</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-[#9A9692]">
                  {result.mistakes.map((m, i) => (
                    <li key={i} className="break-words">{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.missingConcepts.length > 0 && (
              <div>
                <h4 className="mb-1 text-[10px] uppercase tracking-wider text-red-400/80">Missing concepts</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-[#9A9692]">
                  {result.missingConcepts.map((m, i) => (
                    <li key={i} className="break-words">{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.nextStep && (
              <p className="break-words border-t border-[#292725]/50 pt-3 text-xs text-[#A8A39E]">
                <span className="font-semibold text-white">Next step:</span> {result.nextStep}
              </p>
            )}

            <p className="text-[10px] text-[#73706D]">
              AI conceptual assessment only. It does not run or verify your code.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}