
import patternDNA from "./pattern-dna.json";
import type {
  Difficulty,
  GenerateProblemRequest,
  ProblemType,
} from "./problem-types";

const DIFFICULTY_RULES: Record<Difficulty, string> = {
  Easy: `
- Test one fundamental application of the selected pattern.
- Use straightforward constraints and clearly specified inputs.
- Prefer basic edge cases and minimal additional conditions.
- Expected approach should be easy to explain to a beginner.
`,
  Medium: `
- Require careful application of the selected pattern.
- Include meaningful edge cases or an additional constraint.
- Require the student to reason about pointer/window updates.
- Avoid simply increasing the input size to create difficulty.
`,
  Hard: `
- Require deeper reasoning about the selected pattern's invariants.
- Include interacting constraints or non-obvious edge cases.
- Require the student to justify why the approach remains correct.
- Do not introduce unrelated algorithms or unsupported assumptions.
`,
};

const PROBLEM_TYPES: Record<ProblemType, string> = {
  "longest-subarray-target-sum": `
Problem type: Longest Subarray with Given Sum
Pattern: Sliding Window
Given an array of positive integers and a target sum,
find the length of the longest contiguous subarray
whose sum equals the target. Return 0 if no such
subarray exists.
Input: First line contains N and target.
Second line contains N positive integers.
`,
  "maximum-fixed-window-sum": `
Problem type: Maximum Sum of a Fixed-Size Subarray
Pattern: Sliding Window
Given an array of integers and a window size K,
find the maximum sum among all contiguous subarrays
of exactly K elements.
Input: First line contains N and K.
Second line contains N integers.
`,
  "minimum-fixed-window-average": `
Problem type: Minimum Average of a Fixed-Size Subarray
Pattern: Sliding Window
Given an array of integers and a window size K,
find the minimum average among all contiguous
subarrays containing exactly K elements.
Input:
- First line contains N and K.
- Second line contains N integers.
Constraints:
- 1 <= K <= N <= 100000.
Output:
Print the minimum average rounded to exactly 6 digits
after the decimal point.
`,
  "count-close-pairs": `
Problem type: Count Close Pairs
Pattern: Two Pointers
Given an array of N integers and a non-negative
integer K, count pairs (i, j) where i < j and
abs(A[i] - A[j]) <= K.
The array may be unsorted.
Input: First line contains N and K.
Second line contains N integers.
Output one integer.
`,
  "two-sum-sorted": `
Problem type: Two Sum in a Sorted Array
Pattern: Two Pointers
Given a sorted array and a target, determine whether
two elements at different indices sum to the target.
Input:
- First line contains N and target.
- Second line contains N integers in non-decreasing order.
Constraints:
- 2 <= N <= 100000.
- Array elements and target are integers.
Output:
Print YES if a valid pair exists; otherwise print NO.
The two elements must be at different indices.
`,
  "remove-duplicates-sorted": `
Problem type: Remove Duplicates from a Sorted Array
Pattern: Two Pointers
Given a sorted array, output its distinct elements
in their original sorted order.
Input:
- First line contains N.
- Second line contains N integers in non-decreasing order.
Constraints:
- 1 <= N <= 100000.
Output:
- Print the number of distinct elements on the first line.
- Print the distinct elements in sorted order on the second line,
  separated by single spaces.
- Do not print any additional text.
`,

 "second-largest-element": `
Problem type: Second Largest Distinct Element
Topic: Arrays

Given an array of N integers, find the second-largest DISTINCT value.
If the array contains fewer than two distinct values, the input is invalid
and must not be generated as a valid problem instance.

Input:
- First line contains N.
- Second line contains N space-separated integers.

Constraints:
- 2 <= N <= 100000.
- Every array element is a safe integer.
- The array does not need to be sorted.
- The array contains at least two distinct values.

Output:
Print the second-largest distinct integer.
Print no additional text.

Examples:
Input:
5
10 10 8 5 3

Output:
8

Input:
4
-4 -1 -7 -1

Output:
-4

Generation requirements:
- Use the second-largest DISTINCT value, not the second array element.
- Duplicate maximum values must not change the answer.
- Include negative numbers and duplicate values across examples or test cases.
- Every generated input must contain at least two distinct values.
- Expected outputs must be independently checked against the trusted reference solution.
- Do not include invalid arrays such as [3, 3, 3].
- Do not include source code in the problem statement.
`,
  "rotate-array": "Registered topic: Arrays. Generation is not implemented yet.",
  "maximum-subarray-sum": `
Registered topic: Arrays.
Generate a complete Maximum Subarray Sum problem.

Task: Given an array of N integers, find the maximum sum of any non-empty contiguous subarray.

Input format:
- First line: integer N.
- Second line: N space-separated integers.

Output format:
- Print one integer: the maximum contiguous subarray sum.

Requirements:
- Include negative, positive, and zero values across suitable test cases.
- The array must contain at least one element.
- The answer must allow an all-negative array.
- Use Kadane's algorithm as the intended O(N) solution.
- Provide at least two examples and three test cases.
- Every example and test-case output must be mathematically correct.
- Keep the input format consistent across the statement, examples, and test cases.
- Do not confuse maximum subarray sum with maximum element or maximum subsequence sum.
- The first-line N must exactly equal the number of integers on the second line.
- Verify every example and test-case input count before returning JSON.
`.trim(),


"reverse-linked-list": `
Problem type: Reverse a Linked List.
Input format: First line contains integer N. Second line contains N space-separated integers.
Output format: Print the list values in reverse order, space-separated. If N = 0, print the word EMPTY.
Requirements: N must be at least 1 for generated examples and test cases. Preserve all values and reverse their order.
`.trim(),


  "middle-linked-list": `
Problem type: Find the Middle of a Linked List.
Input format: First line contains integer N. Second line contains N space-separated integers.
Output format: Print the middle element. For even N, print the second middle element.
Requirements: N must be at least 1. Preserve the original order when identifying the middle.
`.trim(),

  "detect-linked-list-cycle": `
Problem type: Detect a Cycle in a Linked List.
Input format: First line contains integer N. Second line contains N space-separated integers. Third line contains integer POS, the zero-based index where the last node links back, or -1 if there is no cycle.
Output format: Print YES if a cycle exists, otherwise print NO.
Requirements: Do not confuse repeated values with a cycle. A cycle exists only when links point back to an earlier node.
`.trim(),

"valid-parentheses": `
Problem type: Valid Parentheses.
Input format: One line containing a string made only of (), [], and {} brackets.
Output format: Print YES if every opening bracket is closed by the correct type in the correct order; otherwise print NO.
Requirements: Empty strings are not allowed. Handle nested and mismatched brackets correctly.
`.trim(),

"next-greater-element": `
Problem type: Next Greater Element.
Input format: First line contains integer N. Second line contains N space-separated integers.
Output format: Print the next strictly greater element to the right for each array element, separated by spaces. Print -1 if no greater element exists.
Requirements: N must be at least 1. Equal values do not count as greater.
`.trim(),

"min-stack": `
Problem type: Min Stack.
Input format: First line contains integer N, the number of operations. The next N lines contain PUSH x, POP, or MIN.
Output format: For each MIN operation, print the smallest value currently in the stack, or EMPTY if the stack is empty.
Requirements: PUSH adds a value, POP removes the top value if present, and MIN must not modify the stack. Handle empty-stack operations safely.
`.trim(),


  "palindrome-check": `
Problem type: Palindrome Check.
Input format: One line containing a non-empty string.
Output format: Print YES if the string reads the same forward and backward; otherwise print NO.
Requirements: Compare the string exactly, including character case and spaces. Do not ignore punctuation.
`.trim(),

"anagram-check": `
Problem type: Anagram Check.
Input format: Two lines, each containing a non-empty string.
Output format: Print YES if both strings contain exactly the same characters with the same frequencies; otherwise print NO.
Requirements:
- Character case matters.
- Spaces and punctuation are characters and must be counted.
- Do not ignore, remove, or normalize spaces.
- Reordering characters, including spaces, does not change the character frequencies.
- Example: "Hello World" and "World Hello" must output YES.
`.trim(),

"longest-common-prefix": `
Problem type: Longest Common Prefix.
Input format: First line contains integer N. The next N lines each contain one non-empty string.
Output format: Print the longest prefix shared by all strings. Print -1 if there is no common non-empty prefix.
Requirements: N must be at least 1. Preserve character case and do not reorder the strings.
`.trim(),
  "binary-search-target": `
Problem type: Binary Search Target.
Topic: Searching / Binary Search.
Input format:
- First line contains two integers N and TARGET.
- Second line contains N integers sorted in ascending order.
Output format:
- Print the 0-based index of TARGET if it exists; otherwise print -1.
Requirements:
- Use binary search, not a linear scan.
- N is at least 1.
- The array is sorted in ascending order.
- If the target appears multiple times, any matching index is acceptable.
- Generate valid input and the correct expected output.
`.trim(),

  "first-occurrence": `
Problem type: First Occurrence.
Topic: Searching / Binary Search.
Input format:
- First line contains two integers N and TARGET.
- Second line contains N integers sorted in ascending order.
Output format:
- Print the 0-based index of the first occurrence of TARGET; otherwise print -1.
Requirements:
- Use binary search.
- N is at least 1.
- The array is sorted in ascending order and may contain duplicates.
- If the target appears multiple times, return its smallest index.
- Generate valid input and the correct expected output.
`.trim(),

  "lower-bound": `
Problem type: Lower Bound.
Topic: Searching / Binary Search.
Input format:
- First line contains two integers N and TARGET.
- Second line contains N integers sorted in ascending order.
Output format:
- Print the 0-based index of the first element greater than or equal to TARGET.
- Print -1 if no such element exists.
Requirements:
- Use binary search.
- N is at least 1.
- The array is sorted in ascending order and may contain duplicates.
- If TARGET is smaller than or equal to the first element, return 0.
- If TARGET is greater than every element, return -1.
- Generate valid input and the correct expected output.
`.trim(),

  "merge-sorted-arrays": `
Generate a Merge Two Sorted Arrays coding problem.

Objective:
Given two arrays sorted in ascending order, merge them into one sorted array.

Input format:
- First line: two integers N and M, the sizes of the arrays.
- Second line: N space-separated integers of the first sorted array.
- Third line: M space-separated integers of the second sorted array.

Output format:
- Print the merged array in ascending order, separated by spaces.

Requirements:
- Preserve all elements, including duplicates.
- Use a two-pointer merging approach.
- Do not use built-in sorting functions.
- Include constraints, examples with explanations, solution approach, time and space complexity, and test cases.
- Cover empty arrays where permitted, duplicate values, negative numbers, and arrays of different sizes.
- Ensure all expected outputs are correct.
`,

"sort-colors": `
Generate a Sort Colors coding problem.

Objective:
Given an array containing only 0, 1, and 2, sort it in ascending order.

Input format:
- First line: integer N, the number of elements.
- Second line: N space-separated integers, each either 0, 1, or 2.

Output format:
- Print the sorted array, separated by spaces.

Requirements:
- Require an in-place Dutch National Flag algorithm using three pointers.
- Do not use built-in sorting functions.
- Include constraints, examples with explanations, solution approach, time and space complexity, and test cases.
- Cover arrays containing only one value, mixed values, and repeated values.
- Ensure all expected outputs are correct.
`,

"merge-sort": `
Generate a Merge Sort coding problem.

Objective:
Given an integer array, sort it in ascending order using the Merge Sort algorithm.

Input format:
- First line: integer N, the number of elements.
- Second line: N space-separated integers.

Output format:
- Print the sorted array in ascending order, separated by spaces.

Requirements:
- Require the Merge Sort divide-and-conquer algorithm.
- Do not use built-in sorting functions.
- Include constraints, examples with explanations, solution approach, time and space complexity, and test cases.
- Cover already sorted arrays, reverse-sorted arrays, duplicate values, negative integers, and single-element arrays.
- Ensure all expected outputs are correct.
`,

"bubble-sort": `
Generate a Bubble Sort coding problem.

Objective:
Given an integer array, sort it in ascending order using Bubble Sort.

Input format:
- First line: integer N, the number of elements.
- Second line: N space-separated integers.

Output format:
- Print the sorted array in ascending order, separated by spaces.

Requirements:
- Require adjacent-element comparisons and swaps using Bubble Sort.
- Do not use built-in sorting functions.
- Include constraints, examples with explanations, solution approach, time and space complexity, and test cases.
- Cover already sorted arrays, reverse-sorted arrays, duplicates, negative integers, and single-element arrays.
- Ensure all expected outputs are correct.
`,

"selection-sort": `
Generate a Selection Sort coding problem.

Objective:
Given an integer array, sort it in ascending order using Selection Sort.

Input format:
- First line: integer N, the number of elements.
- Second line: N space-separated integers.

Output format:
- Print the sorted array in ascending order, separated by spaces.

Requirements:
- Require repeatedly selecting the minimum element from the unsorted portion and placing it in the correct position.
- Do not use built-in sorting functions.
- Include constraints, examples with explanations, solution approach, time and space complexity, and test cases.
- Cover already sorted arrays, reverse-sorted arrays, duplicates, negative integers, and single-element arrays.
- Ensure all expected outputs are correct.
`,


"range-sum-query": `
Topic: Prefix Sums and Difference Arrays.
Problem: Range Sum Query.
Given an integer array and multiple queries, each query contains two zero-based inclusive indices L and R. Return the sum of elements from index L through R for every query.
Input format:
Line 1: n q
Line 2: n space-separated integers
Next q lines: L R
Output: Print one sum per query, each on a separate line.
Constraints: n >= 1, q >= 1, 0 <= L <= R < n.
Use a prefix-sum array to answer each query efficiently.
Generate a complete problem statement, valid examples, explanations, and test cases matching this exact input/output format.
`,

"equilibrium-index": `
Topic: Prefix Sums and Difference Arrays.
Problem: Equilibrium Index.
Given an integer array, find the first zero-based index where the sum of all elements strictly to its left equals the sum of all elements strictly to its right.
The current element is excluded from both sums. If no such index exists, output -1.
Input format:
Line 1: n
Line 2: n space-separated integers
Output: The first equilibrium index, or -1.
Constraints: n >= 1.
Use a running left sum and the total array sum.
Generate a complete problem statement, valid examples, explanations, and test cases matching this exact input/output format.
`,

"range-update-queries": `
Topic: Prefix Sums and Difference Arrays.
Problem: Range Update Queries.
Given an initially zero-filled array of length n and q range-update operations, each operation contains L R X. Add X to every element from zero-based index L through R, inclusive. Output the final array.
Input format:
Line 1: n q
Next q lines: L R X
Output: The final n array elements, space-separated.
Constraints: n >= 1, q >= 1, 0 <= L <= R < n.
Use a difference array to process range updates efficiently.
Generate a complete problem statement, valid examples, explanations, and test cases matching this exact input/output format.
`,

};

const SUPPORTED_PROBLEM_TYPES: Partial<
  Record<GenerateProblemRequest["pattern"], ProblemType[]>
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

export function buildProblemPrompt(
  request: GenerateProblemRequest,
): string {
  const dna =
  request.pattern === "Sliding Window" ||
  request.pattern === "Two Pointers" ||
  request.pattern === "Arrays"
    ? patternDNA[request.pattern]
    : null;
  const allowedTypes = SUPPORTED_PROBLEM_TYPES[request.pattern];

  if (!allowedTypes) {
    throw new Error(
      `Generation is not implemented for the topic "${request.pattern}".`,
    );
  }

  const selectedType: ProblemType =
    request.problemType &&
    allowedTypes.includes(request.problemType)
      ? request.problemType
      : allowedTypes[0];

  const previousType = request.previousProblemType;

  return `
You are MasteryPath's DSA problem designer.

PATTERN
${request.pattern}

DIFFICULTY
${request.difficulty ?? "Easy"}

DIFFICULTY REQUIREMENTS
${DIFFICULTY_RULES[request.difficulty ?? "Easy"]}

REQUIRED PROBLEM TYPE
${selectedType}

PROBLEM DEFINITION
${PROBLEM_TYPES[selectedType]}

PREVIOUS PROBLEM TYPE
${previousType ?? "None supplied"}

TRUSTED PATTERN DNA
${JSON.stringify(dna, null, 2)}

RULES
1. Follow the required problem definition exactly.
2. Do not switch to a different algorithmic problem.
3. Use the specified input and output format.
4. Include at least two examples and three test cases.
5. Ensure all inputs satisfy the constraints.
6. Keep examples, explanations and expected outputs consistent.
7. Do not include a complete solution or source code.
8. Do not claim that independent verification has occurred.
9. Return exactly one valid JSON object without Markdown fences.
10. Use strings for all example and test-case inputs and outputs.

REQUIRED JSON STRUCTURE
{
  "title": "Problem title",
  "problemStatement": "Complete problem statement with input and output formats",
  "constraints": ["Constraint 1", "Constraint 2"],
  "examples": [
    {
      "input": "Complete example input",
      "output": "Expected output",
      "explanation": "Short explanation"
    },
    {
      "input": "Complete example input",
      "output": "Expected output",
      "explanation": "Short explanation"
    }
  ],
  "patternReasoning": "Why the selected pattern is suitable",
  "expectedApproach": "High-level algorithm",
  "testCases": [
    {
      "input": "Test input",
      "expectedOutput": "Expected output"
    },
    {
      "input": "Test input",
      "expectedOutput": "Expected output"
    },
    {
      "input": "Test input",
      "expectedOutput": "Expected output"
    }
  ]
}
`;
}
