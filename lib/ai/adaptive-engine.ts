
export type Difficulty = "Easy" | "Medium" | "Hard";

export type SubmissionVerdict =
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "EXECUTION_FAILED"
  | "SERVICE_UNAVAILABLE"
  | "RATE_LIMITED"
  | "SERVICE_ERROR";

export interface AdaptiveInput {
  currentDifficulty: Difficulty;
  verdict: SubmissionVerdict;
  accepted: boolean;
  attempts: number;
  hintsUsed: number;
}

export interface AdaptiveDecision {
  nextDifficulty: Difficulty;
  action: "increase" | "maintain" | "retry" | "retry_later";
  updateLearningPerformance: boolean;
  reason: string;
}

const DIFFICULTY_ORDER: Difficulty[] = [
  "Easy",
  "Medium",
  "Hard",
];

export function decideNextDifficulty(
  input: AdaptiveInput,
): AdaptiveDecision {
  const {
    currentDifficulty,
    verdict,
    accepted,
    attempts,
    hintsUsed,
  } = input;

  // Service failures must not be treated as student failures.
  if (
    verdict === "SERVICE_UNAVAILABLE" ||
    verdict === "RATE_LIMITED" ||
    verdict === "SERVICE_ERROR"
  ) {
    return {
      nextDifficulty: currentDifficulty,
      action: "retry_later",
      updateLearningPerformance: false,
      reason: "The execution service failed. Try again later.",
    };
  }

  // Validate the input before making an adaptive decision.
  if (
    !Number.isInteger(attempts) ||
    attempts < 1 ||
    !Number.isInteger(hintsUsed) ||
    hintsUsed < 0 ||
    !DIFFICULTY_ORDER.includes(currentDifficulty)
  ) {
    throw new Error("Invalid adaptive-engine input.");
  }

  // Only a fully accepted solution counts as successful here.
  if (verdict === "ACCEPTED" && accepted) {
    const index = DIFFICULTY_ORDER.indexOf(currentDifficulty);
    const demonstratedIndependentMastery =
      attempts === 1 && hintsUsed === 0;

    if (demonstratedIndependentMastery && index < 2) {
      return {
        nextDifficulty: DIFFICULTY_ORDER[index + 1],
        action: "increase",
        updateLearningPerformance: true,
        reason:
          "The solution passed on the first attempt without hints.",
      };
    }

    return {
      nextDifficulty: currentDifficulty,
      action: "maintain",
      updateLearningPerformance: true,
      reason:
        currentDifficulty === "Hard"
          ? "Hard difficulty is the current maximum."
          : "Continue practising to demonstrate consistent mastery.",
    };
  }

  if (verdict === "WRONG_ANSWER") {
    return {
      nextDifficulty: currentDifficulty,
      action: "retry",
      updateLearningPerformance: true,
      reason:
        "Some test cases failed. Review the logic and try again.",
    };
  }

  // Compilation errors, runtime errors and timeouts need debugging,
  // not an automatic conclusion that the student lacks understanding.
  return {
    nextDifficulty: currentDifficulty,
    action: "retry",
    updateLearningPerformance: false,
    reason:
      "The code did not execute successfully. Review the error before retrying.",
  };
}
