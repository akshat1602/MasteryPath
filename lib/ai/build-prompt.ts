
import patternDNA from "./pattern-dna.json";
import type {
  GenerateProblemRequest,
  ProblemType,
} from "./problem-types";

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
subarrays of exactly K elements.
Input: First line contains N and K.
Second line contains N integers.
Output the average with sufficient precision.
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
two different elements sum to the target.
Input: First line contains N and target.
Second line contains N integers in non-decreasing order.
Output YES if a pair exists, otherwise NO.
`,

  "remove-duplicates-sorted": `
Problem type: Remove Duplicates from a Sorted Array
Pattern: Two Pointers
Given a sorted array, return its distinct elements
in their original sorted order.
Input: First line contains N.
Second line contains N integers in non-decreasing order.
Output the number of distinct elements, followed by
the distinct elements on the next line.
`,
};

export function buildProblemPrompt(
  request: GenerateProblemRequest,
): string {
  const dna = patternDNA[request.pattern];

  const allowedTypes: ProblemType[] =
    request.pattern === "Sliding Window"
      ? [
          "longest-subarray-target-sum",
          "maximum-fixed-window-sum",
          "minimum-fixed-window-average",
        ]
      : [
          "count-close-pairs",
          "two-sum-sorted",
          "remove-duplicates-sorted",
        ];

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
