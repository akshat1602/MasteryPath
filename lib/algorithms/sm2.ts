export interface SM2Input {
  currentInterval: number;       // In days (0 for brand-new topics)
  currentEaseFactor: number;     // Standard baseline is 2.5
  consecutiveSuccesses: number;  // Consecutive review successes
  grade: number;                 // Performance rating: 0 to 5
  transferGap?: number;          // Recall score - Transfer score (0 to 100)
}

export interface SM2Output {
  nextInterval: number;          // Days until the student should review again
  nextEaseFactor: number;        // Adjusted topic difficulty multiplier
  consecutiveSuccesses: number;  // Reset to 0 if the student fails
  nextReviewDate: Date;
}

/**
 * Modified SM-2 Algorithm incorporating a Transfer Gap penalty.
 * Standard formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
 */
export function calculateNextReview(input: SM2Input): SM2Output {
  const {
    currentInterval,
    currentEaseFactor,
    consecutiveSuccesses,
    grade,
    transferGap = 0,
  } = input;

  // 1. Calculate new Ease Factor
  let nextEaseFactor =
    currentEaseFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

  // SM-2 lower bound: Ease Factor cannot drop below 1.3
  if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

  let nextInterval: number;
  let nextSuccesses: number;

  // 2. Determine interval progression
  if (grade >= 3) {
    // Passed the checkpoint
    if (consecutiveSuccesses === 0) {
      nextInterval = 1;
    } else if (consecutiveSuccesses === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(currentInterval * nextEaseFactor);
    }
    nextSuccesses = consecutiveSuccesses + 1;

    // 3. The Transfer Gap Penalty:
    // If recall is high but transfer is low (gap > 25%), compress the interval
    // by 35% so this structural weakness is resurfaced sooner.
    if (transferGap > 25) {
      nextInterval = Math.max(1, Math.round(nextInterval * 0.65));
    }
  } else {
    // Failed: reset interval back to 1 day to rebuild the fundamental
    nextInterval = 1;
    nextSuccesses = 0;
  }

  // 4. Compute target review timestamp
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

  return {
    nextInterval,
    nextEaseFactor: Number(nextEaseFactor.toFixed(2)),
    consecutiveSuccesses: nextSuccesses,
    nextReviewDate,
  };
}