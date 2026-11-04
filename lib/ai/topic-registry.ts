
import type { DSAPattern, ProblemType } from "./problem-types";

export const TOPIC_REGISTRY: Record<DSAPattern, ProblemType[]> = {
  "Sliding Window": [
    "longest-subarray-target-sum",
    "maximum-fixed-window-sum",
    "minimum-fixed-window-average",
  ],
  "Two Pointers": [
    "count-close-pairs",
    "two-sum-sorted",
    "remove-duplicates-sorted",
  ],
  Arrays: [
    "second-largest-element",
    "rotate-array",
    "maximum-subarray-sum",
  ],
  "Linked Lists": [
    "reverse-linked-list",
    "middle-linked-list",
    "detect-linked-list-cycle",
  ],
  Stacks: [
    "valid-parentheses",
    "next-greater-element",
    "min-stack",
  ],
  Strings: [
    "palindrome-check",
    "anagram-check",
    "longest-common-prefix",
  ],
  "Searching / Binary Search": [
    "binary-search-target",
    "first-occurrence",
    "lower-bound",
  ],
  Sorting: [
    "merge-sorted-arrays",
    "sort-colors",
    "merge-sort",
    "bubble-sort",
  "selection-sort",
  ],
  "Prefix Sums and Difference Arrays": [
    "range-sum-query",
    "equilibrium-index",
    "range-update-queries",
  ],
};

export const TOPICS = Object.keys(TOPIC_REGISTRY) as DSAPattern[];

export function getNextProblemType(
  topic: DSAPattern,
  currentType?: ProblemType,
): ProblemType {
  const types = TOPIC_REGISTRY[topic];

  if (!currentType) {
    return types[0];
  }

  const currentIndex = types.indexOf(currentType);

  if (currentIndex === -1) {
    return types[0];
  }

  return types[(currentIndex + 1) % types.length];
}
