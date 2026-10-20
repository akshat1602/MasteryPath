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
  pattern: DSAPattern | null // null = backend generation endpoint not supported yet
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
    status: 'ready', // Fully tested and working
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
    status: 'ready', // Enabled: generation & runner work
    problems: [
      { id: 'longest-subarray-target-sum', title: 'Longest Subarray with Target Sum', status: 'tested' },
      { id: 'maximum-fixed-window-sum', title: 'Maximum Sum of a Fixed-Size Window', status: 'pending' },
      { id: 'minimum-fixed-window-average', title: 'Minimum Average of a Fixed-Size Window', status: 'pending' },
    ],
  },
  {
    slug: 'arrays',
    label: 'Arrays',
    pattern: null, // Keep null until teammate connects and pushes backend array generator
    category: 'Fundamentals',
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
    pattern: null, // Backend not available yet
    category: 'Searching / Binary Search',
    status: 'pending',
    problems: [],
  },
  {
    slug: 'linked-lists',
    label: 'Linked Lists',
    pattern: null,
    category: 'Linear Data Structures',
    status: 'pending',
    problems: [],
  },
  {
    slug: 'stacks',
    label: 'Stacks',
    pattern: null,
    category: 'LIFO Structures',
    status: 'pending',
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