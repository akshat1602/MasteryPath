import type { DSAPattern } from '@/lib/ai/problem-types'

export type TopicConfig = {
  slug: string
  label: string
  pattern: DSAPattern | null // null = backend not available yet
}

export const TOPICS: TopicConfig[] = [
  { slug: 'two-pointers', label: 'Two Pointers', pattern: 'Two Pointers' },
  { slug: 'sliding-window', label: 'Sliding Window', pattern: 'Sliding Window' },
  { slug: 'binary-search', label: 'Binary Search', pattern: null },
  { slug: 'trees-dfs', label: 'Trees & DFS', pattern: null },
]

export const getTopicBySlug = (slug: string) => TOPICS.find((t) => t.slug === slug)
export const getTopicByLabel = (label: string) => TOPICS.find((t) => t.label === label)