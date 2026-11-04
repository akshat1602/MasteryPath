import type { DSAPattern, ProblemType } from '@/lib/ai/problem-types'

// 'available' = generator exists and the UI will request it.
// It does NOT mean fully tested. Anshika hasn't shared a test matrix yet.
export type ProblemStatus = 'available' | 'pending'

export interface ProblemVariant {
  id: ProblemType
  title: string
  status: ProblemStatus
}

export type TopicConfig = {
  slug: string
  label: string
  pattern: DSAPattern | null // null = coming soon
  category: string
  status: 'ready' | 'pending'
  problems: ProblemVariant[]
}

export const TOPICS: TopicConfig[] = [
  {
    slug: 'two-pointers',
    label: 'Two Pointers',
    pattern: 'Two Pointers',
    category: 'Array / Two Pointers',
    status: 'ready', // Generation works end-to-end; no full test matrix yet
    problems: [
      { id: 'count-close-pairs', title: 'Count Close Pairs', status: 'available' },
      { id: 'two-sum-sorted', title: 'Two Sum in a Sorted Array', status: 'pending' },
      { id: 'remove-duplicates-sorted', title: 'Remove Duplicates from a Sorted Array', status: 'pending' },
    ],
  },
  {
    slug: 'sliding-window',
    label: 'Sliding Window',
    pattern: 'Sliding Window',
    category: 'Subarrays & Substrings',
    status: 'ready', // Generation works end-to-end; no full test matrix yet
    problems: [
      { id: 'longest-subarray-target-sum', title: 'Longest Subarray with Target Sum', status: 'available' },
      { id: 'maximum-fixed-window-sum', title: 'Maximum Sum of a Fixed-Size Window', status: 'pending' },
      { id: 'minimum-fixed-window-average', title: 'Minimum Average of a Fixed-Size Window', status: 'pending' },
    ],
  },
  {
    slug: 'arrays',
    label: 'Arrays',
    pattern: 'Arrays',
    category: 'Fundamentals',
    // Locked until Anshika confirms. Flip to 'ready' and mark variants 'available' then.
    status: 'pending',
    problems: [
      { id: 'second-largest-element', title: 'Find the Second-Largest Element', status: 'pending' },
      { id: 'rotate-array', title: 'Rotate Array', status: 'pending' },
      { id: 'maximum-subarray-sum', title: 'Maximum Subarray Sum', status: 'pending' },
    ],
  },
  {
    slug: 'binary-search',
    label: 'Binary Search',
    pattern: null,
    category: 'Searching',
    status: 'pending', // Locked until backend confirms
    problems: [],
  },
  {
    slug: 'trees-dfs',
    label: 'Trees & DFS',
    pattern: null,
    category: 'Trees & Hierarchical',
    status: 'pending',
    problems: [],
  },
]

export const getTopicBySlug = (slug: string) => TOPICS.find((t) => t.slug === slug)
export const getTopicByLabel = (label: string) => TOPICS.find((t) => t.label === label)

export const getAvailableTypes = (topic?: TopicConfig): ProblemType[] => {
  if (!topic) return []
  return topic.problems.filter((p) => p.status === 'available').map((p) => p.id)
}