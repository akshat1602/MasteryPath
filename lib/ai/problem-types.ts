export type DSAPattern =
  | "Sliding Window"
  | "Two Pointers"
  | "Arrays"
  | "Linked Lists"
  | "Stacks"
  | "Strings"
  | "Searching / Binary Search"
  | "Sorting"
  | "Prefix Sums and Difference Arrays";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemType =
  // Sliding Window / Two Pointers (existing templates)
  | "longest-subarray-target-sum"
  | "maximum-fixed-window-sum"
  | "minimum-fixed-window-average"
  | "count-close-pairs"
  | "two-sum-sorted"
  | "remove-duplicates-sorted"

  // Arrays
  | "second-largest-element"
  | "rotate-array"
  | "maximum-subarray-sum"

  // Linked Lists
  | "reverse-linked-list"
  | "middle-linked-list"
  | "detect-linked-list-cycle"

  // Stacks
  | "valid-parentheses"
  | "next-greater-element"
  | "min-stack"

  // Strings
  | "palindrome-check"
  | "anagram-check"
  | "longest-common-prefix"

  // Searching / Binary Search
  | "binary-search-target"
  | "first-occurrence"
  | "lower-bound"

  // Sorting
  | "bubble-sort"
  | "selection-sort"
  | "merge-sorted-arrays"
  | "sort-colors"
  | "merge-sort"

  // Prefix Sums and Difference Arrays
  | "range-sum-query"
  | "equilibrium-index"
  | "range-update-queries";

export interface GenerateProblemRequest {
  pattern: DSAPattern;
  difficulty?: Difficulty;
  problemType?: ProblemType;
  previousProblemType?: ProblemType;
}

export interface GeneratedExample {
  input: string;
  output: string;
  explanation: string;
}

export interface GeneratedTestCase {
  input: string;
  expectedOutput: string;
}

export interface GeneratedProblem {
  title: string;
  problemStatement: string;
  constraints: string[];
  examples: GeneratedExample[];
  patternReasoning: string;
  expectedApproach: string;
  // WARNING: these reach the browser today. Hidden tests must move
  // server-side (Step 4). Don't render them in the UI.
  testCases: GeneratedTestCase[];
}