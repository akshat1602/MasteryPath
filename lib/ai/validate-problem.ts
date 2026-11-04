
import type { GeneratedProblem, ProblemType } from "./problem-types";
import { verifyLongestSubarrayCase } from "./verify-two-pointers";
import { verifyClosePairsCase } from "./verify-close-pairs";
import { verifyWindowVariantCase } from "./verify-window-variants";
import {
  verifySecondLargestCase,
  verifyRotateArrayCase,
  verifyMaximumSubarraySumCase,
} from "./verify-array-variants";
import {
  verifyTwoSumSortedCase,
  verifyRemoveDuplicatesSortedCase,
} from "./verify-two-pointer-variants";
import {
  verifyReverseLinkedListCase,
  verifyMiddleLinkedListCase,
  verifyLinkedListCycleCase,
} from "./verify-linked-list-variants";
import {
  verifyValidParenthesesCase,
  verifyNextGreaterElementCase,
  verifyMinStackCase,
} from "./verify-stack-variants";
import {
  verifyPalindromeCheckCase,
  verifyAnagramCheckCase,
  verifyLongestCommonPrefixCase,
} from "./verify-string-variants";
import {
  verifyBinarySearchTargetCase,
  verifyFirstOccurrenceCase,
  verifyLowerBoundCase,
} from "./verify-searching-variants";
import {
  verifyBubbleSortCase,
  verifySelectionSortCase,
  verifyMergeSortedArraysCase,
  verifySortColorsCase,
  verifyMergeSortCase,
} from "./verify-sorting-variants";
import {
  verifyRangeSumQueryCase,
  verifyEquilibriumIndexCase,
  verifyRangeUpdateQueriesCase,
} from "./verify-prefix-sum-variants";

export interface ProblemValidationResult {
  valid: boolean;
  errors: string[];
}

type VerificationStrategy = ProblemType | "none";

interface VerificationResult {
  valid: boolean;
  message?: string;
}

export function validateGeneratedProblem(
  problem: GeneratedProblem,
  strategy: VerificationStrategy = "none",
): ProblemValidationResult {
  const errors: string[] = [];

  if (
    !problem ||
    typeof problem !== "object" ||
    Array.isArray(problem)
  ) {
    return {
      valid: false,
      errors: ["Generated problem must be an object."],
    };
  }

  if (typeof problem.title !== "string" || !problem.title.trim()) {
    errors.push("Problem title is empty or invalid.");
  }

  if (
    typeof problem.problemStatement !== "string" ||
    !problem.problemStatement.trim()
  ) {
    errors.push("Problem statement is empty or invalid.");
  }

  if (!Array.isArray(problem.constraints) || problem.constraints.length === 0) {
    errors.push("At least one constraint is required.");
  } else {
    problem.constraints.forEach((item, index) => {
      if (typeof item !== "string" || !item.trim()) {
        errors.push(`Constraint ${index + 1} is empty or invalid.`);
      }
    });
  }

  if (!Array.isArray(problem.examples)) {
    errors.push("Examples must be an array.");
  }

  if (!Array.isArray(problem.testCases)) {
    errors.push("Test cases must be an array.");
  }

  if (
    typeof problem.patternReasoning !== "string" ||
    !problem.patternReasoning.trim()
  ) {
    errors.push("Pattern reasoning is missing or invalid.");
  }

  if (
    typeof problem.expectedApproach !== "string" ||
    !problem.expectedApproach.trim()
  ) {
    errors.push("Expected approach is missing or invalid.");
  }

  if (
    !Array.isArray(problem.examples) ||
    !Array.isArray(problem.testCases) ||
    !Array.isArray(problem.constraints) ||
    typeof problem.title !== "string" ||
    typeof problem.problemStatement !== "string" ||
    typeof problem.patternReasoning !== "string" ||
    typeof problem.expectedApproach !== "string"
  ) {
    return { valid: false, errors };
  }

  if (problem.examples.length < 2) {
    errors.push("At least two examples are required.");
  }

  if (problem.testCases.length < 3) {
    errors.push("At least three test cases are required.");
  }

  problem.examples.forEach((example, index) => {
    if (
      !example ||
      typeof example !== "object" ||
      typeof example.input !== "string" ||
      !example.input.trim() ||
      typeof example.output !== "string" ||
      !example.output.trim() ||
      typeof example.explanation !== "string" ||
      !example.explanation.trim()
    ) {
      errors.push(`Example ${index + 1} is invalid.`);
    }
  });

  problem.testCases.forEach((testCase, index) => {
    if (
      !testCase ||
      typeof testCase !== "object" ||
      typeof testCase.input !== "string" ||
      !testCase.input.trim() ||
      typeof testCase.expectedOutput !== "string" ||
      !testCase.expectedOutput.trim()
    ) {
      errors.push(`Test case ${index + 1} is invalid.`);
    }
  });

  if (strategy === "none") {
    errors.push("A trusted verification strategy must be selected.");
    return { valid: false, errors };
  }

  function verify(input: string, output: string): VerificationResult {
    switch (strategy) {
      case "longest-subarray-target-sum":
        return verifyLongestSubarrayCase(input, output);

      case "count-close-pairs":
        return verifyClosePairsCase(input, output);

      case "maximum-fixed-window-sum":
        return verifyWindowVariantCase(input, output, "maximum-sum");

      case "minimum-fixed-window-average":
        return verifyWindowVariantCase(input, output, "minimum-average");

      case "two-sum-sorted":
        return verifyTwoSumSortedCase(input, output);

      case "remove-duplicates-sorted":
        return verifyRemoveDuplicatesSortedCase(input, output);

      case "second-largest-element":
        return verifySecondLargestCase(input, output);

      case "rotate-array":
        return verifyRotateArrayCase(input, output);

      case "maximum-subarray-sum":
        return verifyMaximumSubarraySumCase(input, output);

      case "reverse-linked-list":
        return verifyReverseLinkedListCase(input, output);

      case "middle-linked-list":
        return verifyMiddleLinkedListCase(input, output);

      case "detect-linked-list-cycle":
        return verifyLinkedListCycleCase(input, output);

      case "valid-parentheses":
        return verifyValidParenthesesCase(input, output);

      case "next-greater-element":
        return verifyNextGreaterElementCase(input, output);

      case "min-stack":
        return verifyMinStackCase(input, output);

      case "palindrome-check":
        return verifyPalindromeCheckCase(input, output);

      case "anagram-check":
        return verifyAnagramCheckCase(input, output);

      case "longest-common-prefix":
        return verifyLongestCommonPrefixCase(input, output);

      case "binary-search-target":
        return verifyBinarySearchTargetCase(input, output);

      case "first-occurrence":
        return verifyFirstOccurrenceCase(input, output);

      case "lower-bound":
        return verifyLowerBoundCase(input, output);

      case "bubble-sort":
        return verifyBubbleSortCase(input, output);

      case "selection-sort":
        return verifySelectionSortCase(input, output);

      case "merge-sorted-arrays":
        return verifyMergeSortedArraysCase(input, output);

      case "sort-colors":
        return verifySortColorsCase(input, output);

      case "merge-sort":
        return verifyMergeSortCase(input, output);

      case "range-sum-query": {
        const valid = verifyRangeSumQueryCase(input, output);
        return {
          valid,
          message: valid ? "" : "Invalid range-sum query input or output.",
        };
      }

      case "equilibrium-index": {
        const valid = verifyEquilibriumIndexCase(input, output);
        return {
          valid,
          message: valid ? "" : "Invalid equilibrium-index input or output.",
        };
      }

      case "range-update-queries": {
        const valid = verifyRangeUpdateQueriesCase(input, output);
        return {
          valid,
          message: valid ? "" : "Invalid range-update queries input or output.",
        };
      }

      default:
        return {
          valid: false,
          message: "Unsupported verification strategy.",
        };
    }
  }

  problem.examples.forEach((example, index) => {
    if (
      example &&
      typeof example.input === "string" &&
      typeof example.output === "string"
    ) {
      const result = verify(example.input, example.output);

      if (!result.valid) {
        errors.push(`Example ${index + 1}: ${result.message}`);
      }
    }
  });

  problem.testCases.forEach((testCase, index) => {
    if (
      testCase &&
      typeof testCase.input === "string" &&
      typeof testCase.expectedOutput === "string"
    ) {
      const result = verify(testCase.input, testCase.expectedOutput);

      if (!result.valid) {
        errors.push(`Test case ${index + 1}: ${result.message}`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}
