'use client'

import React, { useState } from 'react'

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string | null;
  nodeData: any;
}

export default function SubmissionModal({ isOpen, onClose, nodeId, nodeData }: SubmissionModalProps) {
  const [codeSolution, setCodeSolution] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submissionResult, setSubmissionResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmitCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSubmissionResult(null)

    try {
      const response = await fetch('/api/checkpoints/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId,
          topic: nodeData?.label,
          solution: codeSolution,
        }),
      })

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`)
      }

      const data = await response.json()
      setSubmissionResult(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred while evaluating your submission.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl border border-[#292725] bg-[#11100F] text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#292725] px-6 py-4 bg-[#090807]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A78BFA]">
              {nodeData?.category || 'Active Checkpoint'}
            </span>
            <h2 className="text-lg font-bold text-white">{nodeData?.label || 'Topic Evaluation'}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#9A9692] hover:bg-white/5 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Split-Pane Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto">
          
          {/* Left Side: Generated Problem & Instructions */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#292725] space-y-4 bg-[#0D0C0B]">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9A9692]">Generated Problem Context</h3>
            <div className="rounded-xl border border-[#292725] bg-[#11100F] p-4 text-sm text-[#D0D0D0] space-y-3 font-sans">
              <p className="font-semibold text-white">Solve the core challenge associated with {nodeData?.label}.</p>
              <p className="text-xs leading-relaxed text-[#9A9692]">
                Apply the verified pattern approach. Ensure your code handles edge cases, respects runtime constraints, and meets expected output criteria before submitting for validation.
              </p>
            </div>

            {submissionResult && (
              <div className={`rounded-xl p-4 border text-sm space-y-2 animate-in fade-in ${
                submissionResult.success ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' : 'border-red-500/40 bg-red-950/20 text-red-300'
              }`}>
                <div className="font-semibold flex items-center gap-2">
                  <span>{submissionResult.success ? '✓ Evaluation Passed' : '✕ Correction Needed'}</span>
                </div>
                <p className="text-xs font-sans text-[#D0D0D0] leading-relaxed">
                  {submissionResult.feedback || submissionResult.message || 'Submission evaluated successfully.'}
                </p>
              </div>
            )}
          </div>

          {/* Right Side: Code Editor & Submit Action */}
          <form onSubmit={handleSubmitCheckpoint} className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2 flex-1 flex flex-col">
              <label className="text-sm font-medium text-[#9A9692]" htmlFor="code-input">
                Your Code Solution
              </label>
              <textarea
                id="code-input"
                rows={10}
                value={codeSolution}
                onChange={(e) => setCodeSolution(e.target.value)}
                placeholder="Write your implementation here..."
                className="flex-1 w-full rounded-xl border border-[#292725] bg-[#090807] p-4 font-mono text-sm text-white outline-none focus:border-[#A78BFA] transition-all resize-none placeholder:text-[#55524F]"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#292725]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#9A9692] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-10 px-6 rounded-xl bg-white text-[#090807] text-sm font-semibold hover:bg-[#E5E5E5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                {submitting && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {submitting ? 'Running Judge0 Verification...' : 'Submit Solution'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}