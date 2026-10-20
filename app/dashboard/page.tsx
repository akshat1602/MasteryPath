'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// --- Helper Components ---

// Animated Number Counter
function AnimatedNumber({ value, suffix = '', duration = 1000 }: { value: number, suffix?: string, duration?: number }) {
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

// Marks sections that show sample values instead of real student data
function DemoBadge() {
  return (
    <span className="ml-2 inline-block rounded-full border border-amber-500/30 bg-amber-950/20 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-amber-300">
      Demo data
    </span>
  )
}

// SVG Icons
const Icons = {
  Book: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Trophy: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Clock: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Flame: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
  Code: () => <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  More: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>,
  AlertTriangle: () => <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Refresh: () => <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
}

// --- Main Page Component ---
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showProgress, setShowProgress] = useState(false)

  // Mock Data (sample values illustrating core research metrics)
  const stats = { activePaths: 3, skillsMastered: 8, learningHours: 24, dayStreak: 5 }
  const recentPath = { title: "Data Structures & Algorithms", completed: 12, total: 20, progress: 60, next: "Trees" }
  const otherPaths = [
    { title: "Advanced React Patterns", category: "Frontend", progress: 35, lastActive: "2 days ago" },
    { title: "System Design Prep", category: "Architecture", progress: 15, lastActive: "1 week ago" }
  ]
  const activityData = [40, 70, 45, 90, 60, 100, 80] // percentages for 7 days

  // Transfer Gap Analysis Data (Paper 1 & Module 5)
  const transferGapData = {
    overallRecall: 88,
    overallTransfer: 64,
    gap: 24, // Recall - Transfer
    riskPatterns: [
      { pattern: 'Two Pointers', recall: 92, transfer: 68, gap: 24, slug: 'two-pointers' },
      { pattern: 'Sliding Window', recall: 84, transfer: 58, gap: 26, slug: 'sliding-window' }
    ]
  }

  // Retention Review Queue Data (Module 6 - Modified SM-2 Scheduler)
  const retentionQueue = [
    {
      topic: 'Two Pointers (Opposite Direction)',
      pattern: 'Two Pointers',
      slug: 'two-pointers',
      retentionScore: 42,
      dueStatus: 'Overdue (2 days)',
      priority: 'high',
      intervalDays: 3
    },
    {
      topic: 'Fixed Window Aggregation',
      pattern: 'Sliding Window',
      slug: 'sliding-window',
      retentionScore: 58,
      dueStatus: 'Due today',
      priority: 'medium',
      intervalDays: 7
    },
    {
      topic: 'Prefix Sum Lookup',
      pattern: 'Hash Map',
      slug: 'hash-map',
      retentionScore: 71,
      dueStatus: 'Due in 2 days',
      priority: 'low',
      intervalDays: 14
    }
  ]

  useEffect(() => {
    // Simulate data fetch
    const timer1 = setTimeout(() => setIsLoading(false), 1200)
    const timer2 = setTimeout(() => setShowProgress(true), 1300)
    return () => { clearTimeout(timer1); clearTimeout(timer2) }
  }, [])

  return (
    <div className="min-h-[calc(100vh-64px)] w-full text-white selection:bg-[#6B7280]/30 selection:text-white pb-20">
      <main className="mx-auto max-w-[1000px] px-6 pt-10">
        
        {/* Header & Primary Action */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            {isLoading ? (
              <>
                <div className="h-8 w-48 bg-[#1A1A1A] animate-pulse rounded-md mb-3"></div>
                <div className="h-5 w-64 bg-[#1A1A1A] animate-pulse rounded-md"></div>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Welcome back!</h1>
                <p className="text-[#9A9692] text-[15px]">Ready to turn concepts into retained, transferable skills?</p>
              </div>
            )}
          </div>
          
          {!isLoading && (
            <button
              disabled
              title="Coming soon"
              aria-label="Create learning path (coming soon)"
              className="cursor-not-allowed opacity-60 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-[#090807] transition-all outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              Create learning path · Soon
            </button>
          )}
        </div>

        {/* Demo data notice */}
        {!isLoading && (
          <div role="note" className="mb-6 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-[13px] text-amber-200">
            <span className="font-semibold">Demo data.</span> The metrics, transfer gaps, and review queues below are sample values for evaluation purposes. Live data connects once user study persistence is enabled.
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-[104px] rounded-2xl bg-[#0A0A0A] border border-[#242424] p-5 flex flex-col justify-between">
                <div className="h-5 w-5 bg-[#1A1A1A] animate-pulse rounded-full mb-3"></div>
                <div>
                  <div className="h-7 w-12 bg-[#1A1A1A] animate-pulse rounded-md mb-2"></div>
                  <div className="h-3 w-20 bg-[#1A1A1A] animate-pulse rounded-md"></div>
                </div>
              </div>
            ))
          ) : (
            [
              { icon: <Icons.Book />, value: stats.activePaths, label: 'Active paths', delay: 'delay-[100ms]' },
              { icon: <Icons.Trophy />, value: stats.skillsMastered, label: 'Skills mastered', delay: 'delay-[200ms]' },
              { icon: <Icons.Clock />, value: stats.learningHours, suffix: 'h', label: 'Learning hours', delay: 'delay-[300ms]' },
              { icon: <Icons.Flame />, value: stats.dayStreak, label: 'Day streak', delay: 'delay-[400ms]' }
            ].map((stat, i) => (
              <div key={i} className={`animate-in fade-in slide-in-from-bottom-4 duration-700 ${stat.delay} rounded-2xl border border-[#242424] bg-[#0A0A0A] p-5 flex flex-col justify-between transition-colors hover:border-[#3A3A3A]`}>
                <div className="text-[#9A9692] mb-3">{stat.icon}</div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1 tabular-nums tracking-tight">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[13px] font-medium text-[#73706D]">{stat.label}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- RESEARCH ANALYTICS ROW: Transfer Gap & Retention Queue --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          
          {/* Transfer Gap Indicator Widget */}
          <div className="flex flex-col">
            {isLoading ? (
              <div className="h-[220px] rounded-2xl bg-[#0A0A0A] border border-[#242424] animate-pulse"></div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[450ms] rounded-2xl border border-[#242424] bg-[#0A0A0A] p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-[#A78BFA]"></span>
                      <h2 className="text-[16px] font-bold tracking-tight text-white">Transfer Gap Analysis<DemoBadge /></h2>
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#A78BFA] bg-[#A78BFA]/10 border border-[#A78BFA]/30 px-2 py-0.5 rounded-full">
                      Δ {transferGapData.gap}% gap
                    </span>
                  </div>
                  <p className="text-xs text-[#9A9692] mb-5 leading-relaxed">
                    Measures divergence between familiar recall and novel variation transfer. A high gap reveals vibe-coding rote memorization.
                  </p>

                  {/* Dual Comparison Bars */}
                  <div className="space-y-3.5 mb-6">
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-[#9A9692]">Concept Recall (Familiar Seed Problems)</span>
                        <span className="text-white font-mono">{transferGapData.overallRecall}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#1F1F1F] overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400 transition-all duration-1000 ease-out rounded-full" 
                          style={{ width: showProgress ? `${transferGapData.overallRecall}%` : '0%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-[#9A9692]">Variation Transfer (Novel Unseen Problems)</span>
                        <span className="text-white font-mono">{transferGapData.overallTransfer}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#1F1F1F] overflow-hidden">
                        <div 
                          className="h-full bg-[#A78BFA] transition-all duration-1000 ease-out rounded-full" 
                          style={{ width: showProgress ? `${transferGapData.overallTransfer}%` : '0%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro Alert for Highest Gap */}
                <div className="rounded-xl border border-[#2E2419] bg-[#1A140F] p-3 flex items-start gap-3">
                  <div className="text-amber-400 mt-0.5"><Icons.AlertTriangle /></div>
                  <div className="text-xs">
                    <span className="text-amber-200 font-semibold">Priority check: </span>
                    <span className="text-[#C4BDB5]">
                      Sliding Window exhibits a 26% transfer gap. Practice unseen variations to bridge structural understanding.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Retention Review Queue Widget (SM-2 Scheduler) */}
          <div className="flex flex-col">
            {isLoading ? (
              <div className="h-[220px] rounded-2xl bg-[#0A0A0A] border border-[#242424] animate-pulse"></div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[500ms] rounded-2xl border border-[#242424] bg-[#0A0A0A] p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                      <h2 className="text-[16px] font-bold tracking-tight text-white">Retention Queue<DemoBadge /></h2>
                    </div>
                    <span className="text-[11px] text-[#73706D] font-medium">Modified SM-2 Scheduler</span>
                  </div>
                  <p className="text-xs text-[#9A9692] mb-4">
                    Fundamentals scheduled for resurfacing to prevent silent memory decay while you advance.
                  </p>

                  <div className="space-y-2.5">
                    {retentionQueue.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 rounded-xl border border-[#1F1F1F] bg-[#121212] hover:border-[#333333] transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">{item.topic}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.2 rounded-full border ${
                              item.priority === 'high' 
                                ? 'border-red-500/30 bg-red-950/30 text-red-300' 
                                : item.priority === 'medium'
                                ? 'border-amber-500/30 bg-amber-950/30 text-amber-300'
                                : 'border-[#333] bg-[#1A1A1A] text-[#9A9692]'
                            }`}>
                              {item.dueStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#73706D]">
                            Retention: <span className="text-[#A5A19D] font-mono">{item.retentionScore}%</span> · Interval: {item.intervalDays}d
                          </div>
                        </div>

                        <Link
                          href={`/practice/${item.slug}`}
                          className="flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#1A1A1A] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white hover:text-black transition-colors"
                        >
                          <Icons.Refresh />
                          <span>Review</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-[11px] text-[#73706D]">
                  <span>Reschedules nightly via batch cloud worker</span>
                  <Link href="/dashboard/paths" className="text-[#A78BFA] hover:underline">Full Skill Graph →</Link>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Middle Section: Recent Path & Activity Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Continue Learning */}
          <div className="lg:col-span-2 flex flex-col">
            {isLoading ? (
              <>
                <div className="h-6 w-40 bg-[#1A1A1A] animate-pulse rounded-md mb-4"></div>
                <div className="h-[160px] rounded-2xl bg-[#0A0A0A] border border-[#242424] animate-pulse"></div>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[550ms]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-bold tracking-tight">Continue learning<DemoBadge /></h2>
                  <Link href="/dashboard/paths" className="text-sm font-medium text-[#9A9692] hover:text-white transition-colors">View all →</Link>
                </div>
                
                <div className="group rounded-2xl border border-[#242424] bg-[#0A0A0A] p-6 transition-all hover:border-[#4B5563] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] relative overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#141414] border border-[#292929]">
                        <Icons.Code />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{recentPath.title}</h3>
                        <p className="text-[14px] text-[#9A9692]">{recentPath.completed} of {recentPath.total} lessons completed</p>
                      </div>
                    </div>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#1A1A1A] text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19L19 5m0 0v10m0-10H9" /></svg>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between text-[13px] font-medium mb-2">
                      <span className="text-[#9A9692]">{recentPath.progress}% complete</span>
                      <span className="text-white">Next: {recentPath.next}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#242424]">
                      <div 
                        className="h-full bg-white transition-all duration-1000 ease-out" 
                        style={{ width: showProgress ? `${recentPath.progress}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Secondary: Activity Chart */}
          <div className="lg:col-span-1 flex flex-col">
             {isLoading ? (
               <>
                 <div className="h-6 w-32 bg-[#1A1A1A] animate-pulse rounded-md mb-4"></div>
                 <div className="h-[160px] rounded-2xl bg-[#0A0A0A] border border-[#242424] animate-pulse"></div>
               </>
             ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[600ms] h-full flex flex-col">
                  <h2 className="text-[17px] font-bold tracking-tight mb-4 text-[#9A9692]">7-Day Activity<DemoBadge /></h2>
                  <div className="rounded-2xl border border-[#242424] bg-[#0A0A0A] p-6 flex-1 flex flex-col justify-end">
                     <div className="flex items-end justify-between h-24 gap-2 mb-2">
                       {activityData.map((val, i) => (
                         <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#292929] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                             {val}% goal
                           </div>
                           <div 
                             className={`w-full rounded-sm transition-all duration-1000 ease-out ${i === activityData.length - 1 ? 'bg-white' : 'bg-[#3A3A3A] group-hover:bg-[#6B7280]'}`}
                             style={{ height: showProgress ? `${val}%` : '0%' }}
                           ></div>
                         </div>
                       ))}
                     </div>
                     <div className="flex justify-between text-[10px] font-medium text-[#73706D] uppercase">
                       <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                     </div>
                  </div>
                </div>
             )}
          </div>
        </div>

        {/* Other Paths List */}
        {!isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[700ms]">
            <h2 className="text-[17px] font-bold tracking-tight mb-4">Your paths<DemoBadge /></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherPaths.map((path, index) => (
                <div key={index} className="group flex flex-col rounded-2xl border border-[#242424] bg-[#0A0A0A] p-5 transition-colors hover:border-[#3A3A3A] relative">
                  
                  <button className="absolute top-5 right-4 p-1 text-[#73706D] hover:text-white hover:bg-[#1A1A1A] rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none">
                    <Icons.More />
                  </button>

                  <div className="mb-6">
                    <span className="inline-block px-2.5 py-1 mb-3 rounded-full border border-[#242424] bg-[#141414] text-[11px] font-semibold text-[#9A9692] tracking-wide uppercase">
                      {path.category}
                    </span>
                    <h3 className="font-bold text-white text-[15px] pr-8">{path.title}</h3>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span className="text-[#9A9692]">Active {path.lastActive}</span>
                      <span className="text-white">{path.progress}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[#242424]">
                      <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: showProgress ? `${path.progress}%` : '0%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}