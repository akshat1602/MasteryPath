'use client'

import React, { useState } from 'react'
import Link from 'next/link'

// Strict types for attempts & topic performance
export interface AttemptRecord {
  id: string
  topic: string
  pattern: string
  date: string
  score: number
  passed: boolean
  isTransfer: boolean
}

export interface TopicProgressMetric {
  topic: string
  pattern: string
  slug: string
  recallScore: number
  transferScore: number
  gap: number
  retentionScore: number
  status: 'optimal' | 'decaying' | 'pending'
}

export default function ProgressPage() {
  // Toggle to switch between the honest empty state and previewing the rich UI
  const [showSimulatedData, setShowSimulatedData] = useState(false)
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null)

  // Demo Attempts Data for previewing
  const demoAttempts: AttemptRecord[] = [
    { id: 'att-1', topic: 'Count Close Pairs', pattern: 'Two Pointers', date: 'Today, 2:40 PM', score: 100, passed: true, isTransfer: true },
    { id: 'att-2', topic: 'Two Sum Sorted', pattern: 'Two Pointers', date: 'Yesterday', score: 85, passed: true, isTransfer: false },
    { id: 'att-3', topic: 'Longest Subarray Target Sum', pattern: 'Sliding Window', date: '3 days ago', score: 58, passed: false, isTransfer: true },
    { id: 'att-4', topic: 'Second-Largest Element', pattern: 'Arrays', date: '5 days ago', score: 92, passed: true, isTransfer: false },
  ]

  // Demo Metrics
  const topicMetrics: TopicProgressMetric[] = [
    {
      topic: 'Two Pointers',
      pattern: 'Array / Two Pointers',
      slug: 'two-pointers',
      recallScore: 92,
      transferScore: 68,
      gap: 24,
      retentionScore: 42,
      status: 'decaying',
    },
    {
      topic: 'Sliding Window',
      pattern: 'Subarrays & Substrings',
      slug: 'sliding-window',
      recallScore: 84,
      transferScore: 58,
      gap: 26,
      retentionScore: 58,
      status: 'decaying',
    },
    {
      topic: 'Arrays Fundamentals',
      pattern: 'Order & Rotation',
      slug: 'two-pointers',
      recallScore: 88,
      transferScore: 78,
      gap: 10,
      retentionScore: 82,
      status: 'optimal',
    },
  ]

  // Trend history for the transfer wave chart (Recall vs Transfer over 6 sessions)
  const trendHistory = [
    { session: 'T1', recall: 70, transfer: 42 },
    { session: 'T2', recall: 78, transfer: 50 },
    { session: 'T3', recall: 82, transfer: 54 },
    { session: 'T4', recall: 86, transfer: 62 },
    { session: 'T5', recall: 90, transfer: 65 },
    { session: 'T6', recall: 88, transfer: 64 },
  ]

  const attempts = showSimulatedData ? demoAttempts : []
  const hasData = attempts.length > 0

  return (
    <div className="mx-auto max-w-[1280px] space-y-8 px-4 pt-8 pb-20 sm:px-6 lg:px-8 text-white">
      {/* --- Page Header with Mode Toggle --- */}
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Learning Progress &amp; Transfer Analytics
            </h1>
            <span className="rounded-full border border-purple-500/30 bg-purple-950/20 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
              Dual-Track Model
            </span>
          </div>
          <p className="mt-1 text-xs text-[#9A9692] sm:text-sm">
            Continuous evaluation of conceptual recall versus novel variation transfer accuracy.
          </p>
        </div>

        {/* Live Preview Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSimulatedData(!showSimulatedData)}
            className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3.5 text-xs font-medium transition-all ${
              showSimulatedData
                ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                : 'border-[#292725] bg-[#11100F] text-[#9A9692] hover:text-white hover:border-[#3D3A37]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${showSimulatedData ? 'bg-emerald-400 animate-pulse' : 'bg-[#73706D]'}`} />
            <span>{showSimulatedData ? 'Showing Simulated Data' : 'Preview Live Analytics'}</span>
          </button>
        </div>
      </header>

      {/* --- Top 4 Ambient Highlights Strip --- */}
      <section aria-label="Progress overview metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Concept Recall Score',
            value: showSimulatedData ? '88%' : '--',
            sub: 'Baseline on familiar seeds',
            gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
            border: 'hover:border-emerald-500/40',
            badge: 'Recall Track',
            color: 'text-emerald-400',
          },
          {
            title: 'Variation Transfer Score',
            value: showSimulatedData ? '64%' : '--',
            sub: 'Accuracy on novel problems',
            gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
            border: 'hover:border-purple-500/40',
            badge: 'Transfer Track',
            color: 'text-purple-400',
          },
          {
            title: 'Current Transfer Gap (Δ)',
            value: showSimulatedData ? '24%' : '--',
            sub: 'Recall − Transfer delta',
            gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
            border: 'hover:border-cyan-500/40',
            badge: 'Target <15%',
            color: 'text-cyan-400',
          },
          {
            title: 'Retention Health',
            value: showSimulatedData ? '61%' : '--',
            sub: 'Modified SM-2 decay metric',
            gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
            border: 'hover:border-amber-500/40',
            badge: '2 Due Audits',
            color: 'text-amber-400',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl border border-[#242220] bg-[#0E0D0C] p-5 transition-all duration-300 ${stat.border} hover:-translate-y-0.5 hover:shadow-xl`}
          >
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${stat.gradient} opacity-50 transition-opacity group-hover:opacity-100`} />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#9A9692]">{stat.title}</p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">{stat.value}</p>
              </div>
              <span className={`rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono ${stat.color}`}>
                {stat.badge}
              </span>
            </div>
            <p className="relative z-10 mt-3 text-[11px] text-[#73706D]">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* --- Main Content Layout --- */}
      {!hasData ? (
        /* Honest Zero-State with CTA */
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#292725] bg-[#0E0D0C] px-6 py-16 text-center sm:px-12 shadow-inner">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#292725] bg-[#141210] text-[#A78BFA] shadow-lg mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">No attempts recorded yet</h2>
            <p className="max-w-md text-sm leading-relaxed text-[#A8A39E] mb-6">
              You haven&apos;t solved problems or submitted checkpoints yet. Once you complete exercises in the workspace, your recall curves, novel transfer scores, and SM-2 retention ratings will display here automatically.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/paths"
                className="rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-[#090807] hover:bg-[#E5E5E5] transition-all hover:scale-[1.02] shadow-md"
              >
                Explore Skill Graph
              </Link>
              <Link
                href="/practice/two-pointers"
                className="rounded-xl border border-[#3A3835] bg-[#141210] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1C1A18] hover:border-[#4D4A46] transition-all"
              >
                Practice Two Pointers
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Rich Bento Grid with SVG Waveform & Topic Analysis */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Left 2 Columns: Waveform & Detailed Attempts */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* 1. Dual-Track SVG Curve Visualizer */}
            <section aria-label="Transfer Gap curve" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Dual-Track Transfer Waveform</h3>
                    <span className="rounded-full border border-purple-500/30 bg-purple-950/20 px-2 py-0.5 text-[10px] font-mono text-purple-300">
                      Δ 24% Gap
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#9A9692]">
                    Historical delta between familiar seed mastery and unseen problem variation transfer.
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-[#D0D0D0]">Recall (Seed)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#A78BFA]" />
                    <span className="text-[#D0D0D0]">Transfer (Novel)</span>
                  </div>
                </div>
              </div>

              {/* Vector Multi-Line SVG */}
              <div className="relative h-56 w-full pt-4">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="progRecallGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#34D399" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="progTransferGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0.25, 0.5, 0.75].map((r, idx) => (
                    <line key={idx} x1="0" y1={200 * r} x2="700" y2={200 * r} stroke="#1A1816" strokeDasharray="4 4" />
                  ))}

                  {/* Recall Curve Area & Line */}
                  <path d="M 0 60 Q 116 48, 233 40 T 466 28 T 700 24 L 700 200 L 0 200 Z" fill="url(#progRecallGrad)" />
                  <path d="M 0 60 Q 116 48, 233 40 T 466 28 T 700 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Transfer Curve Area & Line */}
                  <path d="M 0 116 Q 116 100, 233 92 T 466 80 T 700 72 L 700 200 L 0 200 Z" fill="url(#progTransferGrad)" />
                  <path d="M 0 116 Q 116 100, 233 92 T 466 80 T 700 72" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Interactive Nodes */}
                  {trendHistory.map((pt, idx) => {
                    const x = (idx / (trendHistory.length - 1)) * 680 + 10
                    const yRec = 200 - (pt.recall / 100) * 180
                    const yTra = 200 - (pt.transfer / 100) * 180
                    const isHovered = hoveredTrendIdx === idx

                    return (
                      <g key={idx} onMouseEnter={() => setHoveredTrendIdx(idx)} onMouseLeave={() => setHoveredTrendIdx(null)}>
                        {isHovered && <line x1={x} y1="0" x2={x} y2="200" stroke="#3D3A37" strokeWidth="1" strokeDasharray="3 3" />}
                        <circle cx={x} cy={yRec} r={isHovered ? 6 : 4} fill="#34D399" className="transition-all cursor-pointer" />
                        <circle cx={x} cy={yTra} r={isHovered ? 6 : 4} fill="#A78BFA" className="transition-all cursor-pointer" />
                      </g>
                    )
                  })}
                </svg>

                <div className="mt-3 flex justify-between text-[11px] font-mono text-[#73706D]">
                  {trendHistory.map((p, i) => (
                    <span key={i} className={hoveredTrendIdx === i ? 'text-white font-bold' : ''}>
                      {p.session}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Recent Attempts Log Table */}
            <section aria-label="Recent attempts" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Recent Evaluation Submissions</h3>
                <span className="text-[11px] font-mono text-[#73706D]">{attempts.length} Recorded Attempts</span>
              </div>

              <div className="divide-y divide-[#1F1D1B] rounded-xl border border-[#1E1C1A] bg-[#141210] overflow-hidden">
                {attempts.map((att) => (
                  <div key={att.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 transition-colors hover:bg-white/[0.02]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{att.topic}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase ${
                          att.isTransfer
                            ? 'border border-purple-500/30 bg-purple-950/30 text-purple-300'
                            : 'border border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                        }`}>
                          {att.isTransfer ? 'Novel Variation' : 'Seed Recall'}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#73706D]">{att.pattern} · {att.date}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        att.passed
                          ? 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                          : 'border border-red-500/30 bg-red-950/40 text-red-300'
                      }`}>
                        {att.passed ? '✓ Checkpoint Passed' : 'Correction Needed'}
                      </span>
                      <span className="text-sm font-mono font-bold text-white">{att.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Pattern Transfer Gap & Retention Status Cards */}
          <div className="space-y-6">
            
            {/* Per-Pattern Transfer Gap Breakdown */}
            <section aria-label="Topic breakdown" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Pattern Transfer Gaps</h3>
                <span className="text-[10px] font-mono text-[#73706D]">Module 5 Engine</span>
              </div>

              <div className="space-y-4">
                {topicMetrics.map((tm, idx) => (
                  <div key={idx} className="rounded-xl border border-[#1E1C1A] bg-[#141210] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{tm.topic}</h4>
                        <p className="text-[11px] text-[#73706D]">{tm.pattern}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase ${
                        tm.gap > 20
                          ? 'border border-amber-500/30 bg-amber-950/40 text-amber-300'
                          : 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                      }`}>
                        Δ {tm.gap}% Gap
                      </span>
                    </div>

                    {/* Progress Comparison */}
                    <div className="space-y-2 text-[11px]">
                      <div>
                        <div className="flex justify-between text-[#9A9692] mb-1">
                          <span>Recall Accuracy</span>
                          <span className="text-white font-mono">{tm.recallScore}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#201D1A] overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-400" style={{ width: `${tm.recallScore}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[#9A9692] mb-1">
                          <span>Transfer Accuracy</span>
                          <span className="text-white font-mono">{tm.transferScore}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#201D1A] overflow-hidden">
                          <div className="h-full rounded-full bg-[#A78BFA]" style={{ width: `${tm.transferScore}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1C1A18] flex items-center justify-between text-[11px]">
                      <span className="text-[#73706D]">Retention: <strong className="text-white font-mono">{tm.retentionScore}%</strong></span>
                      <Link href={`/practice/${tm.slug}`} className="text-[#A78BFA] hover:text-white font-medium transition-colors">
                        Practice →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Retention Decay Warning Alert */}
            <div className="rounded-2xl border border-[#3E2D1D] bg-gradient-to-r from-[#1C130B] to-[#120F0D] p-5 space-y-2 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Decay Mitigation</span>
              </div>
              <p className="text-xs text-[#C4BDB5] leading-relaxed">
                Concepts flagged with high transfer gaps are prioritized by the SM-2 scheduler for prompt resurfacing in your Weekly Fundamentals Audit[cite: 18, 20].
              </p>
              <div className="pt-2">
                <Link
                  href="/practice/two-pointers"
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-amber-400 px-3 text-xs font-semibold text-[#0E0D0C] hover:bg-amber-300 transition-colors"
                >
                  Start Two Pointers Audit
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- Bottom Explainer Cards --- */}
      <section aria-label="Metric explainers" className="rounded-2xl border border-[#292725] bg-[#11100F] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
            What is measured on this page
          </h3>
          <span className="text-[11px] text-[#73706D]">MasteryPath Research Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#242220] bg-[#141210] p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Recall Score</h4>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs text-[#A8A39E] leading-relaxed">
              Assesses retention of familiar seed problem patterns and standard structural approaches.
            </p>
          </div>

          <div className="rounded-xl border border-[#242220] bg-[#141210] p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Transfer Score &amp; Gap</h4>
              <span className="rounded bg-[#A78BFA]/10 px-1.5 py-0.5 text-[10px] font-mono text-[#A78BFA]">Δ Gap</span>
            </div>
            <p className="text-xs text-[#A8A39E] leading-relaxed">
              Evaluates code correctness on novel, AI-generated variations to detect and prevent rote memorization.
            </p>
          </div>

          <div className="rounded-xl border border-[#242220] bg-[#141210] p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">SM-2 Retention Decay</h4>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            </div>
            <p className="text-xs text-[#A8A39E] leading-relaxed">
              Monitored by the adaptive scheduler to trigger timely fundamentals audits before prerequisites fade[cite: 18, 20].
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}