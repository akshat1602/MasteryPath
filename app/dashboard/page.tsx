'use client'

import { useEffect, useState } from 'react'

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

// SVG Icons
const Icons = {
  Book: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Trophy: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Clock: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Flame: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
  Code: () => <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  More: () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
}

// --- Main Page Component ---
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showProgress, setShowProgress] = useState(false)

  // Mock Data
  const stats = { activePaths: 3, skillsMastered: 8, learningHours: 24, dayStreak: 5 }
  const recentPath = { title: "Data Structures & Algorithms", completed: 12, total: 20, progress: 60, next: "Trees" }
  const otherPaths = [
    { title: "Advanced React Patterns", category: "Frontend", progress: 35, lastActive: "2 days ago" },
    { title: "System Design Prep", category: "Architecture", progress: 15, lastActive: "1 week ago" }
  ]
  const activityData = [40, 70, 45, 90, 60, 100, 80] // percentages for 7 days

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
                <p className="text-[#9A9692] text-[15px]">Ready to make progress today?</p>
              </div>
            )}
          </div>
          
          {!isLoading && (
            <button className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-[#090807] transition-all hover:bg-[#F3F4F6] hover:-translate-y-[1px] hover:shadow-[0_8px_25px_rgba(255,255,255,0.15)] focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#050505] outline-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              Create learning path
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-12">
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
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[500ms]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-bold tracking-tight">Continue learning</h2>
                  <button className="text-sm font-medium text-[#9A9692] hover:text-white transition-colors">View all →</button>
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
                  <h2 className="text-[17px] font-bold tracking-tight mb-4 text-[#9A9692]">7-Day Activity</h2>
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
            <h2 className="text-[17px] font-bold tracking-tight mb-4">Your paths</h2>
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