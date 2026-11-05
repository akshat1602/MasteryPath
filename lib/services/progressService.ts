// lib/services/progressService.ts
// Single source of dashboard data.
// Today it returns demo values. When Akshat confirms the Supabase schema,
// replace the body of getMasterySummary() and nothing else needs to change.

export type RetentionLevel = 'high' | 'medium' | 'low'

export type TrendPoint = {
  session: string
  recall: number // 0-100
  transfer: number // 0-100
}

export type RetentionItem = {
  pattern: string
  slug: string | null // null = no practice page yet
  urgency: string
  level: RetentionLevel
  retentionScore: number // 0-100
}

export type ActivityDay = {
  day: string
  val: number // 0-100
}

export type MasterySummary = {
  isDemo: boolean
  stats: {
    activePaths: number
    activePathsInPractice: number
    patternsMastered: number
    masteredThisMonth: number
    transferGapPct: number
    transferGapTargetPct: number
    auditStreakDays: number
  }
  distribution: {
    total: number
    mastered: number
    decaying: number
    locked: number
  }
  performanceTrend: TrendPoint[]
  retentionQueue: RetentionItem[]
  weeklyActivity: ActivityDay[]
  consistencyMetPct: number
  roadmap: {
    title: string
    nextChallenge: string
    nextSlug: string
    lessonsCompleted: number
    lessonsTotal: number
  }
}

const DEMO_SUMMARY: MasterySummary = {
  isDemo: true,
  stats: {
    activePaths: 3,
    activePathsInPractice: 2,
    patternsMastered: 8,
    masteredThisMonth: 2,
    transferGapPct: 24,
    transferGapTargetPct: 15,
    auditStreakDays: 5,
  },
  distribution: { total: 8, mastered: 4, decaying: 2, locked: 2 },
  performanceTrend: [
    { session: 'S1', recall: 70, transfer: 45 },
    { session: 'S2', recall: 75, transfer: 50 },
    { session: 'S3', recall: 80, transfer: 54 },
    { session: 'S4', recall: 82, transfer: 60 },
    { session: 'S5', recall: 85, transfer: 58 },
    { session: 'S6', recall: 90, transfer: 65 },
    { session: 'S7', recall: 88, transfer: 64 },
  ],
  retentionQueue: [
    { pattern: 'Two Pointers (Opposing)', slug: 'two-pointers', urgency: 'Overdue (2d)', level: 'high', retentionScore: 42 },
    { pattern: 'Sliding Window (Fixed)', slug: 'sliding-window', urgency: 'Due today', level: 'medium', retentionScore: 58 },
    { pattern: 'Prefix Sum Lookups', slug: null, urgency: 'In 2 days', level: 'low', retentionScore: 71 },
  ],
  weeklyActivity: [
    { day: 'Mon', val: 55 },
    { day: 'Tue', val: 80 },
    { day: 'Wed', val: 40 },
    { day: 'Thu', val: 95 },
    { day: 'Fri', val: 65 },
    { day: 'Sat', val: 100 },
    { day: 'Sun', val: 75 },
  ],
  consistencyMetPct: 92,
  roadmap: {
    title: 'Data Structures & Algorithms Core',
    nextChallenge: 'Two Pointers (Opposite Direction)',
    nextSlug: 'two-pointers',
    lessonsCompleted: 12,
    lessonsTotal: 20,
  },
}

export async function getMasterySummary(): Promise<MasterySummary> {
  // TODO(Supabase): read real progress for the signed-in user once the
  // schema is agreed with Akshat, and set isDemo to false.
  return DEMO_SUMMARY
}