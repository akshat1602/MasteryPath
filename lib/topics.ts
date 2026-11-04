import type { DSAPattern } from '@/lib/ai/problem-types'

export type ProblemStatus = 'tested' | 'pending'

export interface ProblemVariant {
  id: string
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
    status: 'ready', // Confirmed end-to-end working
    problems: [
      { id: 'count-close-pairs', title: 'Count Close Pairs', status: 'tested' },
      { id: 'two-sum-sorted', title: 'Two Sum in a Sorted Array', status: 'pending' },
      { id: 'remove-duplicates-sorted', title: 'Remove Duplicates from a Sorted Array', status: 'pending' },
    ],
  },
  {
    slug: 'sliding-window',
    label: 'Sliding Window',
    pattern: 'Sliding Window',
    category: 'Subarrays & Substrings',
    status: 'ready', // Verified in test matrix
    problems: [
      { id: 'longest-subarray-target-sum', title: 'Longest Subarray with Target Sum', status: 'tested' },
      { id: 'maximum-fixed-window-sum', title: 'Maximum Sum of a Fixed-Size Window', status: 'pending' },
      { id: 'minimum-fixed-window-average', title: 'Minimum Average of a Fixed-Size Window', status: 'pending' },
    ],
  },
  {
    slug: 'arrays',
    label: 'Arrays',
    pattern: 'Arrays',
    category: 'Fundamentals',
    // Locked down honestly until backend generation completes end-to-end checks
    status: 'pending', 
    problems: [
      { id: 'second-largest-element', title: 'Find the Second-Largest Element', status: 'tested' },
      { id: 'rotate-array', title: 'Rotate Array', status: 'tested' },
      { id: 'maximum-subarray-sum', title: 'Maximum Subarray Sum', status: 'pending' },
    ],
  },
  {
    slug: 'binary-search',
    label: 'Binary Search',
    pattern: null, 
    category: 'Searching',
    status: 'pending', // No pattern available yet
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

export const getTestedTypes = (topic?: TopicConfig): any[] => {
  if (!topic) return []
  return topic.problems.filter((p) => p.status === 'tested').map((p) => p.id)
}