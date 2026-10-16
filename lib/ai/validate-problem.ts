
import type { GeneratedProblem } from "./problem-types";
import { verifyLongestSubarrayCase } from "./verify-two-pointers";
import { verifyClosePairsCase } from "./verify-close-pairs";

export type VerificationStrategy =
  | "longest-subarray-target-sum"
  | "count-close-pairs"
  | "none";

export interface ProblemValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateGeneratedProblem(
  problem: GeneratedProblem,
  strategy: VerificationStrategy = "none",
): ProblemValidationResult {
  const errors: string[] = [];

  // Check that the generated result is an object.
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

  // Validate required text fields.
  if (typeof problem.title !== "string" || !problem.title.trim()) {
    errors.push("Problem title is empty or invalid.");
  }

  if (
    typeof problem.problemStatement !== "string" ||
    !problem.problemStatement.trim()
  ) {
    errors.push("Problem statement is empty or invalid.");
  }

  if (!Array.isArray(problem.constraints)) {
    errors.push("Constraints must be an array.");
  } else {
    if (problem.constraints.length === 0) {
      errors.push("At least one constraint is required.");
    }

    problem.constraints.forEach((constraint, index) => {
      if (typeof constraint !== "string" || !constraint.trim()) {
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

  // Stop before accessing array elements if the structure is invalid.
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

  // Validate individual examples.
  problem.examples.forEach((example, index) => {
    if (
      !example ||
      typeof example !== "object" ||
      Array.isArray(example)
    ) {
      errors.push(`Example ${index + 1} must be an object.`);
      return;
    }

    if (
      typeof example.input !== "string" ||
      !example.input.trim()
    ) {
      errors.push(`Example ${index + 1} has empty or invalid input.`);
    }

    if (
      typeof example.output !== "string" ||
      !example.output.trim()
    ) {
      errors.push(`Example ${index + 1} has empty or invalid output.`);
    }

    if (
      typeof example.explanation !== "string" ||
      !example.explanation.trim()
    ) {
      errors.push(`Example ${index + 1} has no valid explanation.`);
    }
  });

  // Validate individual test cases.
  problem.testCases.forEach((testCase, index) => {
    if (
      !testCase ||
      typeof testCase !== "object" ||
      Array.isArray(testCase)
    ) {
      errors.push(`Test case ${index + 1} must be an object.`);
      return;
    }

    if (
      typeof testCase.input !== "string" ||
      !testCase.input.trim()
    ) {
      errors.push(`Test case ${index + 1} has empty or invalid input.`);
    }

    if (
      typeof testCase.expectedOutput !== "string" ||
      !testCase.expectedOutput.trim()
    ) {
      errors.push(
        `Test case ${index + 1} has empty or invalid expected output.`,
      );
    }
  });

  // Verify Sliding Window outputs against the trusted reference algorithm.
  if (strategy === "longest-subarray-target-sum") {
    problem.examples.forEach((example, index) => {
      if (
        !example ||
        typeof example !== "object" ||
        typeof example.input !== "string" ||
        typeof example.output !== "string" ||
        !example.input.trim() ||
        !example.output.trim()
      ) {
        return;
      }

      const result = verifyLongestSubarrayCase(
        example.input,
        example.output,
      );

      if (!result.valid) {
        errors.push(`Example ${index + 1}: ${result.message}`);
      }
    });

    problem.testCases.forEach((testCase, index) => {
      if (
        !testCase ||
        typeof testCase !== "object" ||
        typeof testCase.input !== "string" ||
        typeof testCase.expectedOutput !== "string" ||
        !testCase.input.trim() ||
        !testCase.expectedOutput.trim()
      ) {
        return;
      }

      const result = verifyLongestSubarrayCase(
        testCase.input,
        testCase.expectedOutput,
      );

      if (!result.valid) {
        errors.push(`Test case ${index + 1}: ${result.message}`);
      }
    });
  }

  // Verify Two Pointers / Count Close Pairs outputs.
  if (strategy === "count-close-pairs") {
    problem.examples.forEach((example, index) => {
      if (
        !example ||
        typeof example !== "object" ||
        typeof example.input !== "string" ||
        typeof example.output !== "string" ||
        !example.input.trim() ||
        !example.output.trim()
      ) {
        return;
      }

      const result = verifyClosePairsCase(
        example.input,
        example.output,
      );

      if (!result.valid) {
        errors.push(`Example ${index + 1}: ${result.message}`);
      }
    });

    problem.testCases.forEach((testCase, index) => {
      if (
        !testCase ||
        typeof testCase !== "object" ||
        typeof testCase.input !== "string" ||
        typeof testCase.expectedOutput !== "string" ||
        !testCase.input.trim() ||
        !testCase.expectedOutput.trim()
      ) {
        return;
      }

      const result = verifyClosePairsCase(
        testCase.input,
        testCase.expectedOutput,
      );

      if (!result.valid) {
        errors.push(`Test case ${index + 1}: ${result.message}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
