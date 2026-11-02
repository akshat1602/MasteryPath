
import { findLongestSubarrayLength } from "@/lib/ai/verify-two-pointers";
import { countClosePairs } from "@/lib/ai/verify-close-pairs";
import { validateGeneratedProblem } from "@/lib/ai/validate-problem";
import { buildProblemPrompt } from "@/lib/ai/build-prompt";
import { verifyReferenceWithJudge0 } from "@/lib/ai/verify-with-judge0";
import { calculateSecondLargest } from "@/lib/ai/verify-array-variants";
import type {
  Difficulty,
  GenerateProblemRequest,
  GeneratedProblem,
  ProblemType,
} from "@/lib/ai/problem-types";
type SupportedPattern =
  | "Sliding Window"
  | "Two Pointers"
  | "Arrays"
  | "Linked Lists"
  | "Stacks"
  | "Strings"
  | "Searching / Binary Search"
  | "Sorting"
  | "Prefix Sums and Difference Arrays";
const SUPPORTED_PROBLEM_TYPES: Record<
  SupportedPattern,
  ProblemType[]
> = {
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
  "Stacks": [
  "valid-parentheses",
  "next-greater-element",
  "min-stack",
],
  "Strings": [
    "palindrome-check",
    "anagram-check",
    "longest-common-prefix",
  ],
    "Searching / Binary Search": [
    "binary-search-target",
    "first-occurrence",
    "lower-bound",
  ],
  "Sorting": [
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

const DEFAULT_PROBLEM_TYPE: Record<
  SupportedPattern,
  ProblemType
> = {
  "Sliding Window": "longest-subarray-target-sum",
  "Two Pointers": "count-close-pairs",
  "Arrays": "second-largest-element",
  "Linked Lists": "reverse-linked-list",
  "Stacks": "valid-parentheses",
  "Strings": "palindrome-check",
  "Searching / Binary Search": "binary-search-target",
  "Sorting": "bubble-sort",
    "Prefix Sums and Difference Arrays": "range-sum-query",
};

function isGeneratedProblem(value: unknown): value is GeneratedProblem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const problem = value as Record<string, unknown>;

  return (
    typeof problem.title === "string" &&
    problem.title.trim().length > 0 &&
    typeof problem.problemStatement === "string" &&
    problem.problemStatement.trim().length > 0 &&
    Array.isArray(problem.constraints) &&
    problem.constraints.length > 0 &&
    problem.constraints.every((item) => typeof item === "string") &&
    Array.isArray(problem.examples) &&
    problem.examples.length >= 2 &&
    problem.examples.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "input" in item &&
        typeof item.input === "string" &&
        "output" in item &&
        typeof item.output === "string" &&
        "explanation" in item &&
        typeof item.explanation === "string",
    ) &&
    typeof problem.patternReasoning === "string" &&
    typeof problem.expectedApproach === "string" &&
    Array.isArray(problem.testCases) &&
    problem.testCases.length >= 3 &&
    problem.testCases.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "input" in item &&
        typeof item.input === "string" &&
        "expectedOutput" in item &&
        typeof item.expectedOutput === "string",
    )
  );
}

function parseInput(input: string): number[] | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const tokens = trimmed.split(/\s+/);
  const values = tokens.map(Number);

  if (
    values.some(
      (value, index) =>
        tokens[index] === "" ||
        !Number.isSafeInteger(value),
    )
  ) {
    return null;
  }

  return values;
}


function verifyAndCorrectOutputs(
  problem: GeneratedProblem,
  problemType: ProblemType,
): boolean {
  function calculateOutput(input: string): string | null {
        if (
      problemType === "reverse-linked-list" ||
      problemType === "middle-linked-list" ||
      problemType === "detect-linked-list-cycle"
    ) {
      switch (problemType) {
        case "reverse-linked-list":
          return calculateReverseLinkedListOutput(input);

        case "middle-linked-list":
          return calculateMiddleLinkedListOutput(input);

        case "detect-linked-list-cycle":
          return calculateLinkedListCycleOutput(input);
      }
        }

    if (
      problemType === "valid-parentheses" ||
      problemType === "next-greater-element" ||
      problemType === "min-stack"
    ) {
      switch (problemType) {
        case "valid-parentheses":
          return calculateValidParenthesesOutput(input);

        case "next-greater-element":
          return calculateNextGreaterElementOutput(input);

        case "min-stack":
          return calculateMinStackOutput(input);
      }
    }
    if (
  problemType === "palindrome-check" ||
  problemType === "anagram-check" ||
  problemType === "longest-common-prefix"
) {
  switch (problemType) {
    case "palindrome-check":
      return calculatePalindromeCheckOutput(input);

    case "anagram-check":
      return calculateAnagramCheckOutput(input);

    case "longest-common-prefix":
      return calculateLongestCommonPrefixOutput(input);
  }
}
    if (
      problemType === "binary-search-target" ||
      problemType === "first-occurrence" ||
      problemType === "lower-bound"
    ) {
      switch (problemType) {
        case "binary-search-target":
          return calculateBinarySearchOutput(input);

        case "first-occurrence":
          return calculateFirstOccurrenceOutput(input);

        case "lower-bound":
          return calculateLowerBoundOutput(input);
      }
    }
    const values = parseInput(input);

    if (!values || values.length < 2) {
      return null;
    }

    const [n, parameter, ...numbers] = values;

    if (
      !Number.isSafeInteger(n) ||
      n < 1 ||
      numbers.length !== n ||
      numbers.some((number) => !Number.isSafeInteger(number))
    ) {
      return null;
    }

    switch (problemType) {
      case "longest-subarray-target-sum": {
        if (parameter < 1 || numbers.some((number) => number <= 0)) {
          return null;
        }
        return String(findLongestSubarrayLength(numbers, parameter));
      }

      case "count-close-pairs": {
        if (parameter < 0) return null;
        return String(countClosePairs(numbers, parameter));
      }

      case "maximum-fixed-window-sum": {
        if (parameter < 1 || parameter > n) return null;

        let sum = numbers.slice(0, parameter).reduce((a, b) => a + b, 0);
        let maximum = sum;

        for (let i = parameter; i < n; i++) {
          sum += numbers[i] - numbers[i - parameter];
          maximum = Math.max(maximum, sum);
        }

        return String(maximum);
      }

      case "minimum-fixed-window-average": {
        if (parameter < 1 || parameter > n) return null;

        let sum = numbers.slice(0, parameter).reduce((a, b) => a + b, 0);
        let minimum = sum;

        for (let i = parameter; i < n; i++) {
          sum += numbers[i] - numbers[i - parameter];
          minimum = Math.min(minimum, sum);
        }

        return (minimum / parameter).toFixed(6);      }

      case "two-sum-sorted": {
        if (n < 2 || numbers.some((value, i) => i > 0 && numbers[i - 1] > value)) {
          return null;
        }

        let left = 0;
        let right = n - 1;

        while (left < right) {
          const sum = numbers[left] + numbers[right];

          if (sum === parameter) return "YES";
          if (sum < parameter) left++;
          else right--;
        }

        return "NO";
      }

      case "remove-duplicates-sorted": {
        // This type has a different input format: N followed by N values.
        // Its input does not include a target or window size.
        return null;
      }
    }
     return null;
  }

  function calculateRemoveDuplicatesOutput(input: string): string | null {
    const values = parseInput(input);

    if (!values || values.length < 2) return null;

    const [n, ...numbers] = values;

    if (
      !Number.isSafeInteger(n) ||
      n < 1 ||
      numbers.length !== n ||
      numbers.some((value, i) => i > 0 && numbers[i - 1] > value)
    ) {
      return null;
    }
    const unique = numbers.filter(
      (value, index) => index === 0 || numbers[index - 1] !== value,
    );

    return `${unique.length}\n${unique.join(" ")}`;
  }

function calculateSecondLargestOutput(
  input: string,
): string | null {
  const values = parseInput(input);

  if (!values || values.length < 3) {
    return null;
  }

  const [n, ...numbers] = values;

  if (
    !Number.isSafeInteger(n) ||
    n < 2 ||
    numbers.length !== n
  ) {
    return null;
  }

  const result = calculateSecondLargest(numbers);

  return result === null ? null : String(result);
}

function calculateRotateArrayOutput(
  input: string,
): string | null {
  const values = parseInput(input);

  if (!values || values.length < 3) {
    return null;
  }

  const [n, k, ...numbers] = values;

  if (
    !Number.isSafeInteger(n) ||
    !Number.isSafeInteger(k) ||
    n < 1 ||
    k < 0 ||
    numbers.length !== n
  ) {
    return null;
  }

  const rotation = k % n;

  const rotated =
    rotation === 0
      ? numbers
      : [...numbers.slice(-rotation), ...numbers.slice(0, -rotation)];

  return rotated.join(" ");
}
function calculateMaximumSubarraySumOutput(input: string): string | null {
  const values = parseInput(input);

  if (!values || values.length < 2) {
    return null;
  }

  const [n, ...numbers] = values;

  if (
    !Number.isSafeInteger(n) ||
    n < 1 ||
    numbers.length !== n
  ) {
    return null;
  }

  let maxEndingHere = numbers[0];
  let maxSoFar = numbers[0];

  for (let i = 1; i < n; i++) {
    maxEndingHere = Math.max(
      numbers[i],
      maxEndingHere + numbers[i],
    );
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return String(maxSoFar);
}

function calculateBubbleSortOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);
  const arr = (lines[1] ?? "").trim().split(/\s+/).map(Number);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    arr.length !== n ||
    arr.some((value) => !Number.isSafeInteger(value))
  ) {
    return null;
  }

  const result = [...arr];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }

  return result.join(" ");
}

function calculateSelectionSortOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);
  const arr = (lines[1] ?? "").trim().split(/\s+/).map(Number);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    arr.length !== n ||
    arr.some((value) => !Number.isSafeInteger(value))
  ) {
    return null;
  }

  const result = [...arr];

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (result[j] < result[minIndex]) {
        minIndex = j;
      }
    }

    [result[i], result[minIndex]] = [result[minIndex], result[i]];
  }

  return result.join(" ");
}


function calculateMergeSortedArraysOutput(input: string): string | null {
  const lines = input.split(/\r?\n/);

  // Remove only extra lines; preserve the three required input lines.
  while (lines.length > 3 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  if (lines.length !== 3) return null;

  const sizes = lines[0].trim().split(/\s+/).map(Number);

  const a =
    lines[1].trim() === ""
      ? []
      : lines[1].trim().split(/\s+/).map(Number);

  const b =
    lines[2].trim() === ""
      ? []
      : lines[2].trim().split(/\s+/).map(Number);

  if (sizes.length !== 2) return null;

  const [n, m] = sizes;

  if (
    !Number.isInteger(n) ||
    !Number.isInteger(m) ||
    n < 0 ||
    m < 0 ||
    a.length !== n ||
    b.length !== m ||
    [...a, ...b].some((value) => !Number.isSafeInteger(value)) ||
    a.some((value, i) => i > 0 && a[i - 1] > value) ||
    b.some((value, i) => i > 0 && b[i - 1] > value)
  ) {
    return null;
  }

  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < n && j < m) {
    if (a[i] <= b[j]) {
      result.push(a[i++]);
    } else {
      result.push(b[j++]);
    }
  }

  result.push(...a.slice(i), ...b.slice(j));
  return result.join(" ");
}

function calculateSortColorsOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);
  const arr = (lines[1] ?? "").trim().split(/\s+/).map(Number);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    arr.length !== n ||
    arr.some((value) => ![0, 1, 2].includes(value))
  ) {
    return null;
  }

  const result = [...arr];
  let low = 0;
  let mid = 0;
  let high = n - 1;

  while (mid <= high) {
    if (result[mid] === 0) {
      [result[low], result[mid]] = [result[mid], result[low]];
      low++;
      mid++;
    } else if (result[mid] === 1) {
      mid++;
    } else {
      [result[mid], result[high]] = [result[high], result[mid]];
      high--;
    }
  }

  return result.join(" ");
}

function calculateMergeSortOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);
  const arr = (lines[1] ?? "").trim().split(/\s+/).map(Number);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    arr.length !== n ||
    arr.some((value) => !Number.isSafeInteger(value))
  ) {
    return null;
  }

  function mergeSort(values: number[]): number[] {
    if (values.length <= 1) return values;

    const mid = Math.floor(values.length / 2);
    const left = mergeSort(values.slice(0, mid));
    const right = mergeSort(values.slice(mid));
    const merged: number[] = [];

    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        merged.push(left[i++]);
      } else {
        merged.push(right[j++]);
      }
    }

    merged.push(...left.slice(i), ...right.slice(j));
    return merged;
  }

  return mergeSort(arr).join(" ");
}

function calculateReverseLinkedListOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);

  if (!Number.isInteger(n) || n < 0) return null;

  if (n === 0) {
    return "EMPTY";
  }

  const values = (lines[1] ?? "")
    .trim()
    .split(/\s+/)
    .map(Number);

  if (
    values.length !== n ||
    values.some((value) => !Number.isFinite(value))
  ) {
    return null;
  }

  return values.reverse().join(" ");
}

function calculateValidParenthesesOutput(input: string): string | null {
  const s = input.trim();
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const ch of s) {
    if ("([{".includes(ch)) {
      stack.push(ch);
    } else if (ch in pairs) {
      if (stack.length === 0 || stack.pop() !== pairs[ch]) {
        return "NO";
      }
    } else {
      return null;
    }
  }

  return stack.length === 0 ? "YES" : "NO";
}

function calculateNextGreaterElementOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);

  if (!Number.isInteger(n) || n < 1) return null;

  const values = (lines[1] ?? "").trim().split(/\s+/).map(Number);

  if (
    values.length !== n ||
    values.some((value) => !Number.isFinite(value))
  ) {
    return null;
  }

  const result = Array(n).fill(-1);
  const stack: number[] = [];

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && values[i] > values[stack[stack.length - 1]]) {
      result[stack.pop()!] = values[i];
    }
    stack.push(i);
  }

  return result.join(" ");
}

function calculateMinStackOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);

  if (!Number.isInteger(n) || n < 1 || lines.length !== n + 1) {
    return null;
  }

  const stack: number[] = [];
  const output: string[] = [];

  for (let i = 1; i <= n; i++) {
    const parts = lines[i].trim().split(/\s+/);
    const operation = parts[0];

    if (operation === "PUSH" && parts.length === 2) {
      const value = Number(parts[1]);
      if (!Number.isFinite(value)) return null;
      stack.push(value);
    } else if (operation === "POP" && parts.length === 1) {
      if (stack.length > 0) stack.pop();
    } else if (operation === "MIN" && parts.length === 1) {
      output.push(stack.length > 0 ? String(Math.min(...stack)) : "EMPTY");
    } else {
      return null;
    }
  }

  return output.join("\n");
}
function calculateBinarySearchOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length !== 2) return null;

  const [n, target] = lines[0].trim().split(/\s+/).map(Number);
  const arr = lines[1].trim().split(/\s+/).map(Number);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    !Number.isFinite(target) ||
    arr.length !== n ||
    arr.some((value) => !Number.isFinite(value)) ||
    arr.some((value, i) => i > 0 && value < arr[i - 1])
  ) {
    return null;
  }

  let left = 0;
  let right = n - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return String(mid);
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return "-1";
}

function calculateFirstOccurrenceOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length !== 2) return null;

  const [n, target] = lines[0].trim().split(/\s+/).map(Number);
  const arr = lines[1].trim().split(/\s+/).map(Number);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    !Number.isFinite(target) ||
    arr.length !== n ||
    arr.some((value) => !Number.isFinite(value)) ||
    arr.some((value, i) => i > 0 && value < arr[i - 1])
  ) {
    return null;
  }

  let left = 0;
  let right = n - 1;
  let answer = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      answer = mid;
      right = mid - 1;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return String(answer);
}

function calculateLowerBoundOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length !== 2) return null;

  const [n, target] = lines[0].trim().split(/\s+/).map(Number);
  const arr = lines[1].trim().split(/\s+/).map(Number);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    !Number.isFinite(target) ||
    arr.length !== n ||
    arr.some((value) => !Number.isFinite(value)) ||
    arr.some((value, i) => i > 0 && value < arr[i - 1])
  ) {
    return null;
  }

  let left = 0;
  let right = n;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] < target) left = mid + 1;
    else right = mid;
  }

  return String(left < n ? left : -1);
}
function calculatePalindromeCheckOutput(input: string): string | null {
  const s = input.replace(/\r?\n$/, "");

  if (!s.length) return null;

  return s === s.split("").reverse().join("") ? "YES" : "NO";
}

function calculateAnagramCheckOutput(input: string): string | null {
  const lines = input.split(/\r?\n/);

  if (lines.length < 2 || !lines[0].length || !lines[1].length) {
    return null;
  }

  const s1 = lines[0];
  const s2 = lines[1];

  return [...s1].sort().join("") === [...s2].sort().join("")
    ? "YES"
    : "NO";
}

function calculateLongestCommonPrefixOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    lines.length !== n + 1 ||
    lines.slice(1).some((word) => !word.length)
  ) {
    return null;
  }

  let prefix = lines[1];

  for (const word of lines.slice(2)) {
    while (!word.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);

      if (!prefix) return "-1";
    }
  }

  return prefix || "-1";
}


function calculateMiddleLinkedListOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);

  if (!Number.isInteger(n) || n < 1) return null;

  const values = (lines[1] ?? "").trim().split(/\s+/).map(Number);

  if (values.length !== n || values.some((value) => !Number.isFinite(value))) {
    return null;
  }

  return String(values[Math.floor(n / 2)]);
}

function calculateLinkedListCycleOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);

  if (!Number.isInteger(n) || n < 0) return null;

  const values =
    n === 0
      ? []
      : (lines[1] ?? "").trim().split(/\s+/).map(Number);

  const pos = Number(lines[2]);

  if (
    values.length !== n ||
    values.some((value) => !Number.isFinite(value)) ||
    !Number.isInteger(pos) ||
    pos < -1 ||
    pos >= n
  ) {
    return null;
  }

  return pos === -1 ? "NO" : "YES";
}

function outputFor(input: string): string | null {
  switch (problemType) {
    case "remove-duplicates-sorted":
      return calculateRemoveDuplicatesOutput(input);

    case "second-largest-element":
      return calculateSecondLargestOutput(input);

    case "rotate-array":
      return calculateRotateArrayOutput(input);

    case "maximum-subarray-sum":
  return calculateMaximumSubarraySumOutput(input);

      case "reverse-linked-list":
      return calculateReverseLinkedListOutput(input);

    case "middle-linked-list":
      return calculateMiddleLinkedListOutput(input);

    case "detect-linked-list-cycle":
      return calculateLinkedListCycleOutput(input);

    case "valid-parentheses":
  return calculateValidParenthesesOutput(input);

case "next-greater-element":
  return calculateNextGreaterElementOutput(input);

case "min-stack":
  return calculateMinStackOutput(input);
  case "palindrome-check":
  return calculatePalindromeCheckOutput(input);

case "anagram-check":
  return calculateAnagramCheckOutput(input);

case "longest-common-prefix":
  return calculateLongestCommonPrefixOutput(input);
  case "binary-search-target":
  return calculateBinarySearchOutput(input);

case "first-occurrence":
  return calculateFirstOccurrenceOutput(input);

case "lower-bound":
  return calculateLowerBoundOutput(input);

  case "bubble-sort":
  return calculateBubbleSortOutput(input);

case "selection-sort":
  return calculateSelectionSortOutput(input);

case "merge-sorted-arrays":
  return calculateMergeSortedArraysOutput(input);

case "sort-colors":
  return calculateSortColorsOutput(input);

case "merge-sort":
  return calculateMergeSortOutput(input);

  case "range-sum-query":
  return calculateRangeSumQueryOutput(input);

case "equilibrium-index":
  return calculateEquilibriumIndexOutput(input);

case "range-update-queries":
  return calculateRangeUpdateQueriesOutput(input);

    default:
      return calculateOutput(input);
  }
}


  // Recalculate example outputs using the trusted calculator.
for (const example of problem.examples) {
  const expected = outputFor(example.input);

  if (expected === null) return false;

  example.output = expected;
}

// Recalculate test-case outputs using the trusted calculator.
for (const testCase of problem.testCases) {
  const expected = outputFor(testCase.input);

  if (expected === null) return false;

  testCase.expectedOutput = expected;
}

  return true;
}


export async function GET() {
  return Response.json({
    message: "MasteryPath problem-generation API is running.",
    provider: "Groq",
    supportedPatterns: [
  "Sliding Window",
  "Two Pointers",
  "Arrays",
  "Linked Lists",
  "Stacks",
  "Strings",
  "Searching / Binary Search",
],
  });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured." },
        { status: 500 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null) {
      return Response.json(
        { error: "Request body must be a JSON object." },
        { status: 400 },
      );
    }

    const input = body as Record<string, unknown>;
    const requestedDifficulty = input.difficulty;

if (
  requestedDifficulty !== undefined &&
  requestedDifficulty !== "Easy" &&
  requestedDifficulty !== "Medium" &&
  requestedDifficulty !== "Hard"
) {
  return Response.json(
    {
      error: 'Difficulty must be "Easy", "Medium", or "Hard".',
    },
    { status: 400 },
  );
}

const difficulty: Difficulty =
  requestedDifficulty === undefined
    ? "Easy"
    : requestedDifficulty;
if (
  input.pattern !== "Two Pointers" &&
  input.pattern !== "Sliding Window" &&
  input.pattern !== "Arrays" &&
  input.pattern !== "Linked Lists" &&
  input.pattern !== "Stacks"&&
  input.pattern !== "Strings"&&
  input.pattern !== "Searching / Binary Search"&&
  input.pattern !== "Sorting" &&
  input.pattern !== "Prefix Sums and Difference Arrays"
) {
      return Response.json(
        {
  error:
  "Supported patterns are \"Sliding Window\", \"Two Pointers\", \"Arrays\", \"Linked Lists\", \"Stacks\", \"Strings\", \"Searching / Binary Search\", \"Sorting\", and \"Prefix Sums and Difference Arrays\"."
        },
        { status: 400 },
      );
    }

    const pattern = input.pattern;

const requestedProblemType = input.problemType;
const allowedProblemTypes = SUPPORTED_PROBLEM_TYPES[pattern];

if (
  !allowedProblemTypes ||
  (requestedProblemType !== undefined &&
    (typeof requestedProblemType !== "string" ||
      !allowedProblemTypes.includes(
        requestedProblemType as ProblemType,
      )))
) {
  return Response.json(
    {
      error: "Unsupported problem type for the selected pattern.",
      supportedProblemTypes: allowedProblemTypes ?? [],
    },
    { status: 400 },
  );
}

const problemRequest: GenerateProblemRequest = {
  pattern,
  difficulty,
  problemType:
    requestedProblemType === undefined
      ? DEFAULT_PROBLEM_TYPE[pattern]
      : (requestedProblemType as ProblemType),
};

const prompt = buildProblemPrompt(problemRequest);

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                "You are MasteryPath's DSA problem generator. Return only a valid JSON object matching the requested schema. Do not include Markdown fences or text outside the JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_completion_tokens: 6000,
          reasoning_effort: "low",
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
        signal: AbortSignal.timeout(60000),
        cache: "no-store",
      },
    );

    if (!groqResponse.ok) {
      const providerError = await groqResponse.text();

      console.error(
        "Groq request failed:",
        groqResponse.status,
        providerError.slice(0, 500),
      );

      return Response.json(
        {
          error:
            "The AI provider could not complete the request. Please try again.",
        },
        { status: 502 },
      );
    }

    const result = await groqResponse.json();
    const choice = result.choices?.[0];
    const generatedText = choice?.message?.content;

    if (
      typeof generatedText !== "string" ||
      generatedText.trim().length === 0
    ) {
      return Response.json(
        {
          error:
            "The AI did not return a usable problem. Please try again.",
        },
        { status: 502 },
      );
    }

    let parsedProblem: unknown;

const cleanedText = generatedText
  .trim()
  .replace(/^```(?:json)?\s*/i, "")
  .replace(/\s*```$/, "")
  .trim();

try {
  parsedProblem = JSON.parse(cleanedText);
} catch {
  console.error(
    "Groq returned invalid JSON:",
    generatedText.slice(0, 3000),
  );

  return Response.json(
    {
      error:
        "The AI returned invalid JSON. Please try again.",
    },
    { status: 502 },
  );
}

console.log(
  "Generated examples:",
  JSON.stringify(
    (parsedProblem as { examples?: unknown }).examples,
    null,
    2,
  ),
);

if (!isGeneratedProblem(parsedProblem)) {
  return Response.json(
    {
      error:
        "The generated problem did not match the required format.",
    },
    { status: 502 },
  );
}


    const problem = parsedProblem;

    // Recalculate outputs using the trusted algorithm for the selected template.
    const outputsCalculated = verifyAndCorrectOutputs(
      problem,
      problemRequest.problemType!,
    );

    if (!outputsCalculated) {
  console.error(
    "Verification failed for pattern:",
    problemRequest.pattern,
    "problem type:",
    problemRequest.problemType,
    "examples:",
    JSON.stringify(problem.examples, null, 2),
    "test cases:",
    JSON.stringify(problem.testCases, null, 2),
  );

  return Response.json(
    {
      error:
        "The generated problem contains invalid input data for its selected pattern.",
    },
    { status: 502 },
  );
}

    const validation = validateGeneratedProblem(
  problem,
  problemRequest.problemType!,
);
    if (!validation.valid) {
      console.error(
        "Generated problem validation failed:",
        validation.errors,
      );

      return Response.json(
        {
          error: "The generated problem failed validation.",
          details: validation.errors,
        },
        { status: 502 },
      );
    }
const judge0Verified = await verifyReferenceWithJudge0(
  problem,
  problemRequest.problemType!,
);
if (!judge0Verified) {
  return Response.json(
    {
      error: "The generated problem failed Judge0 verification.",
    },
    { status: 502 },
  );
}

    return Response.json({
  success: true,
  pattern: problemRequest.pattern,
  difficulty: problemRequest.difficulty,
  problemType: problemRequest.problemType,
  result: problem,
  validation: {
    schemaValid: validation.valid,
    referenceVerified: outputsCalculated && validation.valid,
    judge0Verified,
  },
});
  } catch (error) {
    console.error(
      "Problem-generation request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return Response.json(
      {
        error:
          "Unable to generate a problem right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
function calculateRangeSumQueryOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/).map(line => line.trim());
  if (lines.length < 2) return null;

  const [n, q] = lines[0].split(/\s+/).map(Number);
  if (!Number.isInteger(n) || !Number.isInteger(q) || n < 1 || q < 1) return null;
  if (lines.length !== q + 2) return null;

  const arr = lines[1].split(/\s+/).map(Number);
  if (arr.length !== n || arr.some(x => !Number.isSafeInteger(x))) return null;

  const results: number[] = [];
  for (let i = 0; i < q; i++) {
    const parts = lines[i + 2].split(/\s+/).map(Number);
    if (parts.length !== 2) return null;
    const [l, r] = parts;
    if (!Number.isInteger(l) || !Number.isInteger(r) || l < 0 || l > r || r >= n) return null;
    results.push(arr.slice(l, r + 1).reduce((sum, x) => sum + x, 0));
  }

  return results.join("\n");
}

function calculateEquilibriumIndexOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/).map(line => line.trim());
  if (lines.length !== 2) return null;

  const n = Number(lines[0]);
  const arr = lines[1].split(/\s+/).map(Number);
  if (!Number.isInteger(n) || n < 1 || arr.length !== n || arr.some(x => !Number.isSafeInteger(x))) return null;

  const total = arr.reduce((sum, x) => sum + x, 0);
  let leftSum = 0;

  for (let i = 0; i < n; i++) {
    if (leftSum === total - leftSum - arr[i]) return String(i);
    leftSum += arr[i];
  }

  return "-1";
}

function calculateRangeUpdateQueriesOutput(input: string): string | null {
  const lines = input.trim().split(/\r?\n/).map(line => line.trim());
  if (lines.length < 1) return null;

  const [n, q] = lines[0].split(/\s+/).map(Number);
  if (!Number.isInteger(n) || !Number.isInteger(q) || n < 1 || q < 1) return null;
  if (lines.length !== q + 1) return null;

  const diff = Array(n + 1).fill(0);

  for (let i = 0; i < q; i++) {
    const parts = lines[i + 1].split(/\s+/).map(Number);
    if (parts.length !== 3) return null;

    const [l, r, x] = parts;
    if (!Number.isInteger(l) || !Number.isInteger(r) || l < 0 || l > r || r >= n || !Number.isSafeInteger(x)) return null;

    diff[l] += x;
    diff[r + 1] -= x;
  }

  const result: number[] = [];
  let current = 0;
  for (let i = 0; i < n; i++) {
    current += diff[i];
    result.push(current);
  }

  return result.join(" ");
}