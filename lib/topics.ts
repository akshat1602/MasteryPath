import type { DSAPattern, ProblemType } from '@/lib/ai/problem-types'

// 'available' = the generator exists, passed our smoke test, and the UI will request it.
// 'pending'   = not offered yet (failed or flaky in testing).
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
    status: 'ready',
    problems: [
      { id: 'count-close-pairs', title: 'Count Close Pairs', status: 'available' },
      { id: 'two-sum-sorted', title: 'Two Sum in a Sorted Array', status: 'available' },
      { id: 'remove-duplicates-sorted', title: 'Remove Duplicates from a Sorted Array', status: 'available' },
    ],
  },
  {
    slug: 'sliding-window',
    label: 'Sliding Window',
    pattern: 'Sliding Window',
    category: 'Subarrays & Substrings',
    status: 'ready',
    problems: [
      { id: 'longest-subarray-target-sum', title: 'Longest Subarray with Target Sum', status: 'available' },
      { id: 'maximum-fixed-window-sum', title: 'Maximum Sum of a Fixed-Size Window', status: 'available' },
      { id: 'minimum-fixed-window-average', title: 'Minimum Average of a Fixed-Size Window', status: 'available' },
    ],
  },
  {
    slug: 'arrays',
    label: 'Arrays',
    pattern: 'Arrays',
    category: 'Fundamentals',
    status: 'ready',
    problems: [
      { id: 'second-largest-element', title: 'Find the Second-Largest Element', status: 'available' },
      // Failed 3 of 5 smoke runs (validator 502). Flip to 'available' once Anshika fixes it.
      { id: 'rotate-array', title: 'Rotate Array', status: 'pending' },
      { id: 'maximum-subarray-sum', title: 'Maximum Subarray Sum', status: 'available' },
    ],
  },
  {
    slug: 'linked-lists',
    label: 'Linked Lists',
    pattern: 'Linked Lists',
    category: 'Linked Structures',
    status: 'ready',
    problems: [
      { id: 'reverse-linked-list', title: 'Reverse a Linked List', status: 'available' },
      { id: 'middle-linked-list', title: 'Find the Middle of a Linked List', status: 'available' },
      { id: 'detect-linked-list-cycle', title: 'Detect a Cycle in a Linked List', status: 'available' },
    ],
  },
  {
    slug: 'stacks',
    label: 'Stacks',
    pattern: 'Stacks',
    category: 'Stacks',
    status: 'ready',
    problems: [
      { id: 'valid-parentheses', title: 'Valid Parentheses', status: 'available' },
      { id: 'next-greater-element', title: 'Next Greater Element', status: 'available' },
      { id: 'min-stack', title: 'Min Stack', status: 'available' },
    ],
  },
  {
    slug: 'strings',
    label: 'Strings',
    pattern: 'Strings',
    category: 'Strings',
    status: 'ready',
    problems: [
      { id: 'palindrome-check', title: 'Palindrome Check', status: 'available' },
      { id: 'anagram-check', title: 'Anagram Check', status: 'available' },
      { id: 'longest-common-prefix', title: 'Longest Common Prefix', status: 'available' },
    ],
  },
  {
    slug: 'binary-search',
    label: 'Binary Search',
    pattern: 'Searching / Binary Search',
    category: 'Searching',
    status: 'ready',
    problems: [
      { id: 'binary-search-target', title: 'Binary Search for a Target', status: 'available' },
      { id: 'first-occurrence', title: 'First Occurrence of a Value', status: 'available' },
      { id: 'lower-bound', title: 'Lower Bound', status: 'available' },
    ],
  },
  {
    slug: 'sorting',
    label: 'Sorting',
    pattern: 'Sorting',
    category: 'Sorting',
    status: 'ready',
    problems: [
      { id: 'bubble-sort', title: 'Bubble Sort', status: 'available' },
      { id: 'selection-sort', title: 'Selection Sort', status: 'available' },
      { id: 'merge-sorted-arrays', title: 'Merge Two Sorted Arrays', status: 'available' },
      { id: 'sort-colors', title: 'Sort Colors', status: 'available' },
      { id: 'merge-sort', title: 'Merge Sort', status: 'available' },
    ],
  },
  {
    slug: 'prefix-sums',
    label: 'Prefix Sums & Difference Arrays',
    pattern: 'Prefix Sums and Difference Arrays',
    category: 'Prefix Sums & Difference Arrays',
    status: 'ready',
    problems: [
      { id: 'range-sum-query', title: 'Range Sum Query', status: 'available' },
      { id: 'equilibrium-index', title: 'Equilibrium Index', status: 'available' },
      { id: 'range-update-queries', title: 'Range Update Queries', status: 'available' },
    ],
  },
  {
    slug: 'trees-dfs',
    label: 'Trees & DFS',
    pattern: null,
    category: 'Trees & Hierarchical',
    status: 'pending', // Not one of Anshika's 9 topics
    problems: [],
  },
]

export const getTopicBySlug = (slug: string) => TOPICS.find((t) => t.slug === slug)
export const getTopicByLabel = (label: string) => TOPICS.find((t) => t.label === label)

export const getAvailableTypes = (topic?: TopicConfig): ProblemType[] => {
  if (!topic) return []
  return topic.problems.filter((p) => p.status === 'available').map((p) => p.id)
}