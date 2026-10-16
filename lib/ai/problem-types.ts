
export type DSAPattern = "Sliding Window" | "Two Pointers";

export type ProblemType =
  | "longest-subarray-target-sum"
  | "maximum-fixed-window-sum"
  | "minimum-fixed-window-average"
  | "count-close-pairs"
  | "two-sum-sorted"
  | "remove-duplicates-sorted";

export interface GenerateProblemRequest {
  pattern: DSAPattern;
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
  testCases: GeneratedTestCase[];
}
