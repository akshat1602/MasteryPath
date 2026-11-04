'use client'

import React, { useState } from 'react'

interface SubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  nodeId: string | null
  nodeData: any
}

// Loose typing to prevent breaking if Anshika tweaks field names
type ConceptualEvaluationResponse = {
  verdict: 'PASS' | 'FAIL' | 'PARTIAL' | string
  conceptual_score?: number
  conceptualScore?: number
  strengths?: string[]
  mistakes?: string[]
  missing_concepts?: string[]
  missingConcepts?: string[]
  feedback: string
  next_step?: string
  nextStep?: string
  [key: string]: any
}

export default function SubmissionModal({
  isOpen,
  onClose,
  nodeId,
  nodeData,
}: SubmissionModalProps) {
  const [rationale, setRationale] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [evaluationResult, setEvaluationResult] = useState<ConceptualEvaluationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [attempts, setAttempts] = useState<number>(0)

  if (!isOpen) return null

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rationale.trim()) {
      setError('Please explain your approach before submitting.')
      return
    }

    setSubmitting(true)
    setError(null)
    setEvaluationResult(null)

    const currentAttempt = attempts + 1
    setAttempts(currentAttempt)

    try {
      // Conceptual evaluator: separate from Judge0 / adaptive engine
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId,
          topic: nodeData?.label,
          explanation: rationale,
          attempts: currentAttempt,
        }),
      })

      if (!response.ok) {
        throw new Error(`Evaluation failed with status ${response.status}`)
      }

      const data = await response.json()
      setEvaluationResult(data)
    } catch (err: any) {
      setError(
        err.message || 'An error occurred while evaluating your conceptual understanding.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      setError(null)
      setEvaluationResult(null)
      setRationale('')
      setAttempts(0)
      onClose()
    }
  }

  // Normalised fields (supports both camelCase and snake_case)
  const verdict = evaluationResult?.verdict ?? ''
  const strengths = evaluationResult?.strengths ?? []
  const mistakes = evaluationResult?.mistakes ?? []
  const missingConcepts =
    evaluationResult?.missingConcepts ?? evaluationResult?.missing_concepts ?? []
  const nextStep = evaluationResult?.nextStep ?? evaluationResult?.next_step
  const score = evaluationResult?.conceptualScore ?? evaluationResult?.conceptual_score

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkpoint-title"
    >
      <div className="relative w-full max-w-5xl rounded-2xl border border-[#292725] bg-[#11100F] text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#292725] px-6 py-4 bg-[#090807]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A78BFA]">
              {nodeData?.category || 'Conceptual Checkpoint'}
            </span>
            <h2 id="checkpoint-title" className="text-lg font-bold text-white">
              {nodeData?.label || 'Topic Evaluation'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-[#9A9692] hover:bg-white/5 hover:text-white transition-colors disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {/* Split-Pane Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto">
          {/* Left Side: Context & Verdict Card */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#292725] space-y-4 bg-[#0D0C0B]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9A9692]">
                Conceptual Assessment
              </h3>
              {attempts > 0 && (
                <span className="text-[10px] font-mono text-[#73706D]">Attempt {attempts}</span>
              )}
            </div>

            {!evaluationResult ? (
              <div className="rounded-xl border border-[#292725] bg-[#11100F] p-4 text-sm text-[#D0D0D0] space-y-3 font-sans">
                <p className="font-semibold text-white">
                  Explain the core mechanism behind {nodeData?.label || 'this topic'}.
                </p>
                <p className="text-xs leading-relaxed text-[#9A9692]">
                  Your explanation will be evaluated by the AI engine to verify foundational comprehension rather than just checking code output. Do not paste code—explain the rationale.
                </p>
              </div>
            ) : (
              // The Dedicated Verdict Card
              <div
                className={`rounded-xl border p-5 text-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 ${
                  verdict === 'PASS'
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : verdict === 'PARTIAL'
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : verdict === 'FAIL'
                    ? 'border-red-500/40 bg-red-950/20'
                    : 'border-[#292725] bg-[#11100F]'
                }`}
                role="status"
              >
                <div className="flex items-center justify-between border-b border-[#292725] pb-3">
                  <div className="font-semibold text-white flex items-center gap-2">
                    {verdict === 'PASS' && <span className="text-emerald-400">✓ Concept Mastered</span>}
                    {verdict === 'PARTIAL' && <span className="text-amber-400">⚠ Partial Understanding</span>}
                    {verdict === 'FAIL' && <span className="text-red-400">✕ Conceptual Gap Detected</span>}
                    {!['PASS', 'PARTIAL', 'FAIL'].includes(verdict) && (
                      <span className="text-[#D0D0D0]">Evaluation complete</span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-[#A8A39E]">
                    {/* Scale unconfirmed: ask Anshika if it's 0-100 or 0-1 */}
                    Score: {score ?? '--'}/100
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-[#D0D0D0] leading-relaxed break-words">
                    {evaluationResult.feedback}
                  </p>

                  <div className="space-y-3 pt-2">
                    {strengths.length > 0 && (
                      <div>
                        <h4 className="text-[10px] uppercase tracking-wider text-emerald-400/80 mb-1">Strengths</h4>
                        <ul className="list-disc list-inside text-xs text-[#9A9692] space-y-1">
                          {strengths.map((s, i) => (
                            <li key={i} className="break-words">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {mistakes.length > 0 && (
                      <div>
                        <h4 className="text-[10px] uppercase tracking-wider text-amber-400/80 mb-1">Mistakes</h4>
                        <ul className="list-disc list-inside text-xs text-[#9A9692] space-y-1">
                          {mistakes.map((m, i) => (
                            <li key={i} className="break-words">{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {missingConcepts.length > 0 && (
                      <div>
                        <h4 className="text-[10px] uppercase tracking-wider text-red-400/80 mb-1">Missing Concepts</h4>
                        <ul className="list-disc list-inside text-xs text-[#9A9692] space-y-1">
                          {missingConcepts.map((m, i) => (
                            <li key={i} className="break-words">{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {nextStep && (
                    <div className="pt-3 border-t border-[#292725]/50 mt-2">
                      <p className="text-xs text-[#A8A39E] break-words">
                        <span className="font-semibold text-white">Next Step:</span> {nextStep}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Rationale Input & Submit */}
          <form
            onSubmit={handleSubmitEvaluation}
            className="p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2 flex-1 flex flex-col">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-[#9A9692]"
                htmlFor="rationale-input"
              >
                Explain your approach
              </label>
              <textarea
                id="rationale-input"
                rows={10}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                disabled={submitting}
                placeholder="In plain English, explain how this pattern works and why it is efficient..."
                className="flex-1 w-full rounded-xl border border-[#292725] bg-[#090807] p-4 font-mono text-sm text-white outline-none focus:border-[#A78BFA] transition-all resize-none placeholder:text-[#55524F] disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#292725]">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#9A9692] hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !rationale.trim()}
                className="h-10 px-6 rounded-xl bg-white text-[#090807] text-sm font-semibold hover:bg-[#E5E5E5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                {submitting && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {submitting ? 'Evaluating rationale...' : 'Submit Explanation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}