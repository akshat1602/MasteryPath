// Calls the existing /api/generate-problem once per problem type.
// Needs `npm run dev` running. Node 18+.
import { writeFileSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const DIFFICULTIES = (process.env.DIFFS ?? 'Medium').split(',').map((s) => s.trim())

const MATRIX = {
  'Sliding Window': ['longest-subarray-target-sum', 'maximum-fixed-window-sum', 'minimum-fixed-window-average'],
  'Two Pointers': ['count-close-pairs', 'two-sum-sorted', 'remove-duplicates-sorted'],
  'Arrays': ['second-largest-element', 'rotate-array', 'maximum-subarray-sum'],
  'Linked Lists': ['reverse-linked-list', 'middle-linked-list', 'detect-linked-list-cycle'],
  'Stacks': ['valid-parentheses', 'next-greater-element', 'min-stack'],
  'Strings': ['palindrome-check', 'anagram-check', 'longest-common-prefix'],
  'Searching / Binary Search': ['binary-search-target', 'first-occurrence', 'lower-bound'],
  'Sorting': ['bubble-sort', 'selection-sort', 'merge-sorted-arrays', 'sort-colors', 'merge-sort'],
  'Prefix Sums and Difference Arrays': ['range-sum-query', 'equilibrium-index', 'range-update-queries'],
}

const rows = []
const ONLY = process.env.ONLY ? process.env.ONLY.split(',').map((s) => s.trim()) : null
for (const [pattern, types] of Object.entries(MATRIX)) {
  for (const problemType of types) {
        if (ONLY && !ONLY.includes(problemType)) continue
    for (const difficulty of DIFFICULTIES) {
      const started = Date.now()
      let row = { pattern, problemType, difficulty }
      try {
        const res = await fetch(`${BASE}/api/generate-problem`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pattern, problemType, difficulty }),
          signal: AbortSignal.timeout(120_000),
        })
        const json = await res.json().catch(() => null)
        row = {
          ...row,
          httpStatus: res.status,
          ok: res.ok && json?.success === true && json?.problemType === problemType,
          returnedType: json?.problemType,
          referenceVerified: json?.validation?.referenceVerified,
          judge0Verified: json?.validation?.judge0Verified,
          error: json?.error,
          details: json?.details,
        }
      } catch (err) {
        row = { ...row, ok: false, error: String(err) }
      }
      row.seconds = Math.round((Date.now() - started) / 100) / 10
      rows.push(row)
      const note = row.ok ? '' : `  -> ${row.error ?? 'returned a different problemType'}`
      console.log(`${row.ok ? 'PASS' : 'FAIL'}  ${pattern} / ${problemType} / ${difficulty} (${row.seconds}s)${note}`)
    }
  }
}

const failed = rows.filter((r) => !r.ok)
console.log(`\n${rows.length - failed.length}/${rows.length} passed`)
if (failed.length) console.log('Failures:\n', JSON.stringify(failed, null, 2))

writeFileSync('smoke-results.json', JSON.stringify(rows, null, 2))