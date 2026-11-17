'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { getTopicBySlug } from '@/lib/topics'

interface SubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  nodeId: string | null
  nodeData: any
}

// The graph node opens this panel. Conceptual evaluation now happens on the practice page,
// next to the generated problem ("Explain your approach"), because the evaluator needs a
// specific problem statement and expected approach.
export default function SubmissionModal({ isOpen, onClose, nodeData }: SubmissionModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const slug: string | undefined = typeof nodeData?.slug === 'string' ? nodeData.slug : undefined
  const topic = slug ? getTopicBySlug(slug) : undefined
  const isReady = topic?.status === 'ready'
  const availableVariants = topic?.problems.filter((p) => p.status === 'available') ?? []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkpoint-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#292725] bg-[#11100F] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#292725] bg-[#090807] px-6 py-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A78BFA]">
              {nodeData?.category || 'Topic'}
            </span>
            <h2 id="checkpoint-title" className="text-lg font-bold text-white">
              {nodeData?.label || 'Topic'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-[#9A9692] transition-colors hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 overflow-y-auto p-6">
          {nodeData?.description && (
            <p className="text-sm leading-relaxed text-[#D0D0D0]">{String(nodeData.description)}</p>
          )}

          {typeof nodeData?.estimatedMinutes === 'number' && (
            <p className="text-xs text-[#9A9692]">Estimated time: {nodeData.estimatedMinutes} min</p>
          )}

          {isReady ? (
            <>
              {availableVariants.length > 0 && (
                <div>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#73706D]">
                    Problem types available
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#D0D0D0]">
                    {availableVariants.map((p) => (
                      <li key={p.id} className="rounded-lg border border-[#242220] bg-[#141210] px-3 py-2">
                        {p.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-xl border border-[#292725] bg-[#141210] p-4 text-xs leading-relaxed text-[#9A9692]">
                Practise this topic to generate a verified problem, run your code, and explain your approach for an
                AI conceptual check.
              </div>

              <Link
                href={`/practice/${topic!.slug}`}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-[#090807] transition-all hover:bg-[#E5E5E5]"
              >
                Practice this topic →
              </Link>
            </>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-200">
              This topic isn&apos;t available for practice yet. It will unlock once its problem generation is ready.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}