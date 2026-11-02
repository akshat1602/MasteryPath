'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

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

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [chartHoverIndex, setChartHoverIndex] = useState<number | null>(null)

  // Simulation of initial render
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Research Mock Metrics
  const stats = [
    {
      title: 'Active Learning Paths',
      value: 3,
      suffix: '',
      change: '2 in active practice',
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
      value: 8,
      suffix: '',
      change: '+2 this month',
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
      value: 24,
      suffix: '%',
      change: 'Target: <15% delta',
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
      value: 5,
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

  // Dual-Track Transfer Comparison Plot Data (7 sessions)
  const performanceTrend = [
    { session: 'S1', recall: 70, transfer: 45 },
    { session: 'S2', recall: 75, transfer: 50 },
    { session: 'S3', recall: 80, transfer: 54 },
    { session: 'S4', recall: 82, transfer: 60 },
    { session: 'S5', recall: 85, transfer: 58 },
    { session: 'S6', recall: 90, transfer: 65 },
    { session: 'S7', recall: 88, transfer: 64 },
  ]

  // Retention Scheduler Items (SM-2)
  const retentionQueue = [
    {
      pattern: 'Two Pointers (Opposing)',
      slug: 'two-pointers',
      urgency: 'Overdue (2d)',
      level: 'high',
      retentionScore: 42,
    },
    {
      pattern: 'Sliding Window (Fixed)',
      slug: 'sliding-window',
      urgency: 'Due today',
      level: 'medium',
      retentionScore: 58,
    },
    {
      pattern: 'Prefix Sum Lookups',
      slug: 'two-pointers',
      urgency: 'In 2 days',
      level: 'low',
      retentionScore: 71,
    },
  ]

  // 7-day Activity Strip
  const weeklyActivity = [
    { day: 'Mon', val: 55, active: true },
    { day: 'Tue', val: 80, active: true },
    { day: 'Wed', val: 40, active: true },
    { day: 'Thu', val: 95, active: true },
    { day: 'Fri', val: 65, active: true },
    { day: 'Sat', val: 100, active: true },
    { day: 'Sun', val: 75, active: true },
  ]

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

        {/* --- Top 4 Vibrant Highlight Cards --- */}
        <section aria-label="Quick metrics" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-[#242220] bg-[#0E0D0C] p-5 transition-all duration-300 ${item.border} hover:-translate-y-0.5 hover:shadow-xl`}
            >
              {/* Subtle top ambient glow gradient */}
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${item.gradient} opacity-50 transition-opacity group-hover:opacity-100`} />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[#9A9692]">{item.title}</p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                    {isLoading ? (
                      <span className="inline-block h-8 w-14 animate-pulse rounded bg-[#1C1A18]" />
                    ) : (
                      <AnimatedNumber value={item.value} suffix={item.suffix} />
                    )}
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

            {/* 2. Interactive Transfer Gap & Recall Trend Chart */}
            <section aria-label="Transfer Gap curve" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Transfer Gap vs. Recall Trend</h3>
                    <DemoTag />
                  </div>
                  <p className="mt-0.5 text-xs text-[#9A9692]">
                    Comparing familiar seed accuracy against novel variation transfer across recent sessions.
                  </p>
                </div>

                {/* Legend Indicators */}
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

              {/* Vector SVG Multi-Line Chart */}
              <div className="relative h-56 w-full pt-4">
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

                  {/* Horizontal grid guide lines */}
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

                  {/* Recall Curve Area & Line */}
                  <path
                    d="M 0 60 Q 116 50, 233 40 T 466 30 T 700 24 L 700 200 L 0 200 Z"
                    fill="url(#recallGradient)"
                  />
                  <path
                    d="M 0 60 Q 116 50, 233 40 T 466 30 T 700 24"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Transfer Curve Area & Line */}
                  <path
                    d="M 0 110 Q 116 100, 233 92 T 466 84 T 700 72 L 700 200 L 0 200 Z"
                    fill="url(#transferGradient)"
                  />
                  <path
                    d="M 0 110 Q 116 100, 233 92 T 466 84 T 700 72"
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Interactive Points */}
                  {performanceTrend.map((pt, idx) => {
                    const x = (idx / (performanceTrend.length - 1)) * 680 + 10
                    const yRecall = 200 - (pt.recall / 100) * 180
                    const yTransfer = 200 - (pt.transfer / 100) * 180
                    const isHovered = chartHoverIndex === idx

                    return (
                      <g key={idx} onMouseEnter={() => setChartHoverIndex(idx)} onMouseLeave={() => setChartHoverIndex(null)}>
                        {/* Hover bar */}
                        {isHovered && (
                          <line x1={x} y1="0" x2={x} y2="200" stroke="#3D3A37" strokeWidth="1" strokeDasharray="3 3" />
                        )}

                        <circle cx={x} cy={yRecall} r={isHovered ? 6 : 4} fill="#34D399" className="transition-all" />
                        <circle cx={x} cy={yTransfer} r={isHovered ? 6 : 4} fill="#A78BFA" className="transition-all" />
                      </g>
                    )
                  })}
                </svg>

                {/* X-axis labels */}
                <div className="mt-3 flex justify-between text-[11px] font-mono text-[#73706D]">
                  {performanceTrend.map((p, i) => (
                    <span key={i} className={chartHoverIndex === i ? 'text-white font-bold' : ''}>
                      {p.session}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Insight Callout */}
              <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-[#242220] bg-[#141210] p-3.5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5 text-xs text-[#D0D0D0]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#A78BFA]/20 text-[#A78BFA]">
                    Δ
                  </span>
                  <span>
                    Current Transfer Gap is <strong className="text-white">24%</strong>. Practice novel variants to bring this delta under 15%.
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

            {/* 3. Pick Up Where You Left Off Card */}
            <section aria-label="Resume path" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Active Roadmap</h3>
                  <p className="text-xs text-[#9A9692]">Data Structures & Algorithms Core</p>
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
                        Next Challenge: Two Pointers (Opposite Direction)
                      </h4>
                      <p className="text-xs text-[#9A9692]">Lesson 12 of 20 completed · Target: Solve without extra array allocation</p>
                    </div>
                  </div>

                  <Link
                    href="/practice/two-pointers"
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-[#090807] transition-all hover:bg-[#E5E5E5]"
                  >
                    <span>Resume Practice</span>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-mono text-[#73706D] mb-1.5">
                    <span>Path Progress</span>
                    <span className="text-white">60%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#201D1A] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#A78BFA] to-white w-[60%]" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================= RIGHT COLUMN (Intelligence Hub) ================= */}
          <div className="space-y-6">
            
            {/* 1. Mastery Distribution Donut Card */}
            <section aria-label="Topic distribution" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight text-white">Mastery Distribution</h3>
                <DemoTag />
              </div>

              {/* Donut Chart Visual */}
              <div className="flex items-center justify-center py-2">
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#1A1816" strokeWidth="12" fill="none" />
                    {/* Mastered: 50% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#34D399"
                      strokeWidth="12"
                      strokeDasharray="119.38 238.76"
                      strokeDashoffset="0"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Decaying: 25% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#F59E0B"
                      strokeWidth="12"
                      strokeDasharray="59.69 238.76"
                      strokeDashoffset="-125"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Locked/In-Progress: 25% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#6B7280"
                      strokeWidth="12"
                      strokeDasharray="59.69 238.76"
                      strokeDashoffset="-190"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-white">8</span>
                    <p className="text-[10px] uppercase font-semibold text-[#73706D]">Total Topics</p>
                  </div>
                </div>
              </div>

              {/* Legend Breakdown */}
              <div className="mt-4 space-y-2 border-t border-[#1C1A18] pt-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9A9692]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Mastered (Retention &gt;75%)
                  </span>
                  <span className="font-mono text-white">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9A9692]">
                    <span className="h-2 w-2 rounded-full bg-amber-400"></span> Decaying (Audit Due)
                  </span>
                  <span className="font-mono text-white">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#9A9692]">
                    <span className="h-2 w-2 rounded-full bg-[#6B7280]"></span> Unvisited / Locked
                  </span>
                  <span className="font-mono text-white">2</span>
                </div>
              </div>
            </section>

            {/* 2. Retention Review Queue (SM-2 Spaced Scheduler) */}
            <section aria-label="Retention queue" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                  <h3 className="text-sm font-bold tracking-tight text-white">Retention Queue</h3>
                </div>
                <span className="text-[10px] font-mono text-[#73706D]">SM-2 Active</span>
              </div>
              <p className="mb-4 text-xs text-[#9A9692]">
                Scheduled review to halt knowledge decay before it compromises tree prerequisites.
              </p>

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
                          className={`rounded-full px-2 py-0.2 text-[9px] font-semibold uppercase tracking-wider ${
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

                    <Link
                      href={`/practice/${item.slug}`}
                      className="inline-flex h-7 items-center justify-center rounded-lg border border-[#333] bg-[#1E1C1A] px-2.5 text-[11px] font-medium text-white transition-colors hover:bg-white hover:text-black"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. 7-Day Activity / Consistency Matrix */}
            <section aria-label="Activity consistency" className="rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">7-Day Consistency</h3>
                  <p className="text-xs text-[#9A9692]">Active verification &amp; checks</p>
                </div>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  92% Met
                </span>
              </div>

              {/* Weekly Vertical Bars */}
              <div className="flex h-24 items-end justify-between gap-2 pt-2">
                {weeklyActivity.map((d, i) => (
                  <div key={i} className="group relative flex h-full w-full flex-col justify-end">
                    {/* Tooltip on hover */}
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