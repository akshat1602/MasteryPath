'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export interface AttemptRecord {
  id: string
  topic: string
  pattern: string
  submittedAt: string
  score: number
  passed: boolean
  isTransferVariation: boolean
}

export interface TopicProgressSummary {
  topic: string
  pattern: string
  totalAttempts: number
  recallAccuracy: number
  transferAccuracy: number
  transferGap: number
  retentionHealth: number
}

export default function ProgressPage() {
  const [attempts] = useState<AttemptRecord[]>([])

  const hasData = attempts.length > 0

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Your Learning Progress
        </h1>
        <p className="text-sm text-[#A8A39E]">
          Real-time tracking of recall accuracy, novel variation transfer, and retention decay.
        </p>
      </div>

      {!hasData ? (
        <div className="space-y-6">
          {/* Main Empty State Container */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#292725] bg-[#0E0D0C] px-6 py-14 text-center sm:px-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#292725] bg-[#141210] text-[#A78BFA] shadow-inner mb-4">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-white mb-2">No attempts recorded yet</h2>
            <p className="max-w-md text-sm leading-relaxed text-[#A8A39E] mb-6">
              You haven&apos;t completed any checkpoints or problem variations yet. Once you solve problems or submit checkpoint explanations, your recall and transfer metrics will appear here.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/paths"
                className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-[#090807] hover:bg-[#E5E5E5] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
              >
                Explore Skill Graph
              </Link>
              <Link
                href="/practice/two-pointers"
                className="rounded-lg border border-[#3A3835] bg-[#141210] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1C1A18] hover:border-[#4D4A46] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
              >
                Practice Two Pointers
              </Link>
            </div>
          </div>

          {/* Metric Explainers Card */}
          <div className="rounded-2xl border border-[#292725] bg-[#11100F] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
                What will be measured here
              </h3>
              <span className="text-[11px] text-[#73706D]">Dual-Track Scoring Model</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recall */}
              <div className="flex flex-col justify-between rounded-xl border border-[#242220] bg-[#141210] p-4.5 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Recall Score</h4>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-xs text-[#A8A39E] leading-relaxed">
                    Measures accuracy on familiar seed concepts and fundamental problem structures.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#73706D]">Baseline mastery metric</div>
              </div>

              {/* Transfer Gap */}
              <div className="flex flex-col justify-between rounded-xl border border-[#242220] bg-[#141210] p-4.5 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Transfer Score & Gap</h4>
                    <span className="rounded bg-[#A78BFA]/10 px-1.5 py-0.5 text-[10px] font-mono text-[#A78BFA]">
                      Δ Gap
                    </span>
                  </div>
                  <p className="text-xs text-[#A8A39E] leading-relaxed">
                    Evaluates performance on unseen, AI-generated variations to ensure deep understanding rather than rote memorization.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#73706D]">Transfer Gap = Recall − Transfer</div>
              </div>

              {/* Retention Decay */}
              <div className="flex flex-col justify-between rounded-xl border border-[#242220] bg-[#141210] p-4.5 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Retention Decay</h4>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  </div>
                  <p className="text-xs text-[#A8A39E] leading-relaxed">
                    Monitored by the modified SM-2 scheduler to alert you when concepts require review before fading.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#73706D]">Spaced-repetition scheduling</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}