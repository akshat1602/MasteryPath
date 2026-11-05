'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getMasterySummary, type MasterySummary } from '@/lib/services/progressService'

// --- Helper Animated Counter ---
function AnimatedNumber({ value, suffix = '', duration = 900 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(easeProgress * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{display.toString().padStart(2, '0')}{suffix}</span>
}

function DemoTag() {
  return (
    <span className="rounded-full border border-amber-500/30 bg-amber-950/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
      Demo Data
    </span>
  )
}

// Chart helpers: lines now pass through the real data points
const chartX = (idx: number, count: number) => (idx / Math.max(count - 1, 1)) * 680 + 10
const chartY = (value: number) => 200 - (value / 100) * 180

function buildLine(values: number[]) {
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${chartX(i, values.length)} ${chartY(v)}`)
    .join(' ')
}

function buildArea(values: number[]) {
  if (values.length === 0) return ''
  return `${buildLine(values)} L ${chartX(values.length - 1, values.length)} 200 L ${chartX(0, values.length)} 200 Z`
}

// --- Page: loads data, then renders the view ---
export default function DashboardPage() {
  const [summary, setSummary] = useState<MasterySummary | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getMasterySummary()
      .then((data) => {
        if (!cancelled) setSummary(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Could not load your progress.')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#070706] px-4 pt-16 text-white">
        <div role="alert" className="mx-auto max-w-md rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-center text-sm text-red-300">
          {loadError}
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-[#070706] text-white">
        <div role="status" aria-live="polite" className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mb-8 h-8 w-64 animate-pulse rounded bg-[#1C1A18]" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-[#0E0D0C]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <DashboardView summary={summary} />
}

function DashboardView({ summary }: { summary: MasterySummary }) {
  const [chartHoverIndex, setChartHoverIndex] = useState<number | null>(null)

  const { stats: s, distribution, performanceTrend, retentionQueue, weeklyActivity, roadmap } = summary

  const stats = [
    {
      title: 'Active Learning Paths',
      value: s.activePaths,
      suffix: '',
      change: `${s.activePathsInPractice} in active practice`,
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Patterns Mastered',
      value: s.patternsMastered,
      suffix: '',
      change: `+${s.masteredThisMonth} this month`,
      gradient: 'from-violet-500/20 via-violet-500/5 to-transparent',
      border: 'hover:border-violet-500/40',
      iconBg: 'bg-violet-950/40 text-violet-400 border-violet-500/30',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: 'Transfer Gap Delta',
      value: s.transferGapPct,
      suffix: '%',
      change: `Target: <${s.transferGapTargetPct}% delta`,
      gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Audit Streak',
      value: s.auditStreakDays,
      suffix: 'd',
      change: 'Retention protected',
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
    },
  ]

  // Donut geometry computed from real counts
  const circumference = 2 * Math.PI * 38
  const donutTotal = Math.max(distribution.total, 1)
  const masteredLen = (distribution.mastered / donutTotal) * circumference
  const decayingLen = (distribution.decaying / donutTotal) * circumference
  const lockedLen = (distribution.locked / donutTotal) * circumference

  const recallValues = performanceTrend.map((p) => p.recall)
  const transferValues = performanceTrend.map((p) => p.transfer)

  const roadmapPct = Math.round((roadmap.lessonsCompleted / Math.max(roadmap.lessonsTotal, 1)) * 100)

  return (
    <div className="min-h-screen bg-[#070706] text-white selection:bg-[#A78BFA]/30 pb-20">
      <div className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 lg:px-8">

        {/* --- Top Welcome & Quick Action Bar --- */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome back, Alfee!
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Sprint
              </span>
            </div>
            <p className="mt-1 text-xs text-[#9A9692] sm:text-sm">
              Ready to turn rote algorithms into durable, transferable problem-solving skills?
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/practice/two-pointers"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-semibold text-[#090807] transition-all hover:bg-[#E5E5E5] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Practice Workspace</span>
            </Link>

            <Link
              href="/dashboard/paths"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#292725] bg-[#11100F] px-4 text-xs font-semibold text-white transition-all hover:bg-[#1A1816] hover:border-[#3D3A37]"
            >
              <span>Skill Graph</span>
              <svg className="h-3.5 w-3.5 text-[#9A9692]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </header>

        {summary.isDemo && (
          <div role="note" className="mb-6 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-[13px] text-amber-200">
            <span className="font-semibold">Demo data.</span> The stats, charts, retention queue, resume card and activity bars on this page are sample values, not your real progress. Real tracking will be connected once the progress database is agreed.
          </div>
        )}

        {/* --- Top 4 Highlight Cards --- */}
        <section aria-label="Quick metrics" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-[#242220] bg-[#0E0D0C] p-5 transition-all duration-300 ${item.border} hover:-translate-y-0.5 hover:shadow-xl`}
            >
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${item.gradient} opacity-50 transition-opacity group-hover:opacity-100`} />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[#9A9692]">{item.title}</p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                    <AnimatedNumber value={item.value} suffix={item.suffix} />
                  </p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.iconBg}`}>
                  {item.icon}
                </div>
              </div>

              <div className="relative z-10 mt-4 flex items-center gap-2 text-[11px] text-[#73706D]">
                <span className="font-medium text-[#A5A19D]">{item.change}</span>
              </div>
            </div>
          ))}
        </section>

        {/* --- Bento Grid Main Workspace (2 : 1 Split) --- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ================= LEFT 2 COLUMNS ================= */}
          <div className="space-y-6 lg:col-span-2">

            {/* 1. Weekly Fundamentals Audit Banner */}
            <section aria-label="Weekly audit" className="relative overflow-hidden rounded-2xl border border-[#3E2D1D] bg-gradient-to-r from-[#1C130B] via-[#140F0B] to-[#0E0D0C] p-6 shadow-xl">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Weekly Fundamentals Audit Due
                    </span>
                    <span className="rounded-full border border-amber-500/30 bg-amber-950/40 px-2 py-0.5 text-[10px] text-amber-200">
                      Streak Protected
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white sm:text-xl">
                    Prerequisite Check: Two Pointers & In-Place Swaps
                  </h2>
                  <p className="max-w-xl text-xs leading-relaxed text-[#C4BDB5]">
                    Streaks are maintained by passing retention audits, not passive logins. Take this 2-minute check to ensure foundation stability before progressing into Tree and Graph structures.
                  </p>
                </div>

                <div className="shrink-0">
                  <Link
                    href="/practice/two-pointers"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-semibold text-[#0E0D0C] transition-all hover:bg-[#E5E5E5] hover:scale-[1.02] shadow-lg"
                  >
                    <span>Start Audit</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>

            {/* 2. Transfer Gap & Recall Trend Chart */}
            <section aria-label="Transfer Gap curve" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Transfer Gap vs. Recall Trend</h3>
                    {summary.isDemo && <DemoTag />}
                  </div>
                  <p className="mt-0.5 text-xs text-[#9A9692]">
                    Comparing familiar seed accuracy against novel variation transfer across recent sessions.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[#D0D0D0]">Recall (Seed)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#A78BFA]"></span>
                    <span className="text-[#D0D0D0]">Transfer (Novel)</span>
                  </div>
                </div>
              </div>

              <div className="relative h-56 w-full pt-4">
                {performanceTrend.length < 2 ? (
                  <div className="flex h-full items-center justify-center text-sm text-[#73706D]">
                    Complete a few sessions to see your trend.
                  </div>
                ) : (
                  <>
                    <svg className="h-full w-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="recallGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34D399" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#34D399" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="transferGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
                        <line
                          key={idx}
                          x1="0"
                          y1={200 * ratio}
                          x2="700"
                          y2={200 * ratio}
                          stroke="#1A1816"
                          strokeDasharray="4 4"
                        />
                      ))}

                      {/* Recall */}
                      <path d={buildArea(recallValues)} fill="url(#recallGradient)" />
                      <path d={buildLine(recallValues)} fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Transfer */}
                      <path d={buildArea(transferValues)} fill="url(#transferGradient)" />
                      <path d={buildLine(transferValues)} fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Interactive Points */}
                      {performanceTrend.map((pt, idx) => {
                        const x = chartX(idx, performanceTrend.length)
                        const isHovered = chartHoverIndex === idx

                        return (
                          <g key={idx} onMouseEnter={() => setChartHoverIndex(idx)} onMouseLeave={() => setChartHoverIndex(null)}>
                            {isHovered && (
                              <line x1={x} y1="0" x2={x} y2="200" stroke="#3D3A37" strokeWidth="1" strokeDasharray="3 3" />
                            )}
                            <circle cx={x} cy={chartY(pt.recall)} r={isHovered ? 6 : 4} fill="#34D399" className="transition-all" />
                            <circle cx={x} cy={chartY(pt.transfer)} r={isHovered ? 6 : 4} fill="#A78BFA" className="transition-all" />
                          </g>
                        )
                      })}
                    </svg>

                    <div className="mt-3 flex justify-between text-[11px] font-mono text-[#73706D]">
                      {performanceTrend.map((p, i) => (
                        <span key={i} className={chartHoverIndex === i ? 'text-white font-bold' : ''}>
                          {p.session}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-[#242220] bg-[#141210] p-3.5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5 text-xs text-[#D0D0D0]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#A78BFA]/20 text-[#A78BFA]">
                    Δ
                  </span>
                  <span>
                    Current Transfer Gap is <strong className="text-white">{s.transferGapPct}%</strong>. Practice novel variants to bring this delta under {s.transferGapTargetPct}%.
                  </span>
                </div>
                <Link
                  href="/practice/two-pointers"
                  className="shrink-0 text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors"
                >
                  Generate Variation →
                </Link>
              </div>
            </section>

            {/* 3. Active Roadmap */}
            <section aria-label="Resume path" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Active Roadmap</h3>
                  <p className="text-xs text-[#9A9692]">{roadmap.title}</p>
                </div>
                <Link href="/dashboard/paths" className="text-xs font-semibold text-[#9A9692] hover:text-white transition-colors">
                  View Skill Graph →
                </Link>
              </div>

              <div className="group rounded-xl border border-[#242220] bg-[#141210] p-5 transition-all hover:border-[#3D3A37]">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#2A2724] bg-[#1A1816] text-[#A78BFA]">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors">
                        Next Challenge: {roadmap.nextChallenge}
                      </h4>
                      <p className="text-xs text-[#9A9692]">
                        Lesson {roadmap.lessonsCompleted} of {roadmap.lessonsTotal} completed · Target: Solve without extra array allocation
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/practice/${roadmap.nextSlug}`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-[#090807] transition-all hover:bg-[#E5E5E5]"
                  >
                    <span>Resume Practice</span>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-mono text-[#73706D] mb-1.5">
                    <span>Path Progress</span>
                    <span className="text-white">{roadmapPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#201D1A] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#A78BFA] to-white"
                      style={{ width: `${roadmapPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="space-y-6">

            {/* 1. Mastery Distribution Donut */}
            <section aria-label="Topic distribution" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight text-white">Mastery Distribution</h3>
                {summary.isDemo && <DemoTag />}
              </div>

              <div className="flex items-center justify-center py-2">
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#1A1816" strokeWidth="12" fill="none" />
                    {/* Mastered */}
                    <circle
                      cx="50" cy="50" r="38" stroke="#34D399" strokeWidth="12" fill="none"
                      strokeDasharray={`${masteredLen} ${circumference}`}
                      strokeDashoffset={0}
                    />
                    {/* Decaying */}
                    <circle
                      cx="50" cy="50" r="38" stroke="#F59E0B" strokeWidth="12" fill="none"
                      strokeDasharray={`${decayingLen} ${circumference}`}
                      strokeDashoffset={-masteredLen}
                    />
                    {/* Unvisited / Locked */}
                    <circle
                      cx="50" cy="50" r="38" stroke="#6B7280" strokeWidth="12" fill="none"
                      strokeDasharray={`${lockedLen} ${circumference}`}
                      strokeDashoffset={-(masteredLen + decayingLen)}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-white">{distribution.total}</span>
                    <p className="text-[10px] uppercase font-semibold text-[#73706D]">Total Topics</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-[#1C1A18] pt-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9A9692]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Mastered (Retention &gt;75%)
                  </span>
                  <span className="font-mono text-white">{distribution.mastered}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9A9692]">
                    <span className="h-2 w-2 rounded-full bg-amber-400"></span> Decaying (Audit Due)
                  </span>
                  <span className="font-mono text-white">{distribution.decaying}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9A9692]">
                    <span className="h-2 w-2 rounded-full bg-[#6B7280]"></span> Unvisited / Locked
                  </span>
                  <span className="font-mono text-white">{distribution.locked}</span>
                </div>
              </div>
            </section>

            {/* 2. Retention Review Queue (SM-2) */}
            <section aria-label="Retention queue" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                  <h3 className="text-sm font-bold tracking-tight text-white">Retention Queue</h3>
                </div>
                <span className="text-[10px] font-mono text-[#73706D]">
                  {summary.isDemo ? 'SM-2 · Sample' : 'SM-2'}
                </span>
              </div>
              <p className="mb-4 text-xs text-[#9A9692]">
                Scheduled review to halt knowledge decay before it compromises tree prerequisites.
              </p>

              {retentionQueue.length === 0 ? (
                <p className="rounded-xl border border-[#1E1C1A] bg-[#141210] p-4 text-xs text-[#9A9692]">
                  Nothing due for review right now.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {retentionQueue.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-[#1E1C1A] bg-[#141210] p-3 transition-colors hover:border-[#3D3A37]"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{item.pattern}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                              item.level === 'high'
                                ? 'border border-red-500/30 bg-red-950/40 text-red-300'
                                : item.level === 'medium'
                                ? 'border border-amber-500/30 bg-amber-950/40 text-amber-300'
                                : 'border border-[#333] bg-[#1A1816] text-[#9A9692]'
                            }`}
                          >
                            {item.urgency}
                          </span>
                          <span className="text-[10px] font-mono text-[#73706D]">{item.retentionScore}% health</span>
                        </div>
                      </div>

                      {item.slug ? (
                        <Link
                          href={`/practice/${item.slug}`}
                          className="inline-flex h-7 items-center justify-center rounded-lg border border-[#333] bg-[#1E1C1A] px-2.5 text-[11px] font-medium text-white transition-colors hover:bg-white hover:text-black"
                        >
                          Review
                        </Link>
                      ) : (
                        <span className="text-[10px] font-mono uppercase text-[#73706D]">Soon</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 3. 7-Day Consistency */}
            <section aria-label="Activity consistency" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">7-Day Consistency</h3>
                  <p className="text-xs text-[#9A9692]">Active verification &amp; checks</p>
                </div>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  {summary.consistencyMetPct}% Met
                </span>
              </div>

              <div className="flex h-24 items-end justify-between gap-2 pt-2">
                {weeklyActivity.map((d, i) => (
                  <div key={i} className="group relative flex h-full w-full flex-col justify-end">
                    <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-[#201D1A] px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap border border-[#333]">
                      {d.val}%
                    </div>
                    <div
                      className={`w-full rounded-md transition-all duration-700 ${
                        i === weeklyActivity.length - 1
                          ? 'bg-gradient-to-t from-emerald-500 to-emerald-300'
                          : 'bg-[#1F1D1B] group-hover:bg-[#3D3A37]'
                      }`}
                      style={{ height: `${d.val}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between text-[10px] font-mono uppercase text-[#73706D]">
                {weeklyActivity.map((d, i) => (
                  <span key={i}>{d.day}</span>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}