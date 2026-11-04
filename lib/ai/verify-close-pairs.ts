
export interface ClosePairsVerificationResult {
  valid: boolean;
  message: string;
}

export function countClosePairs(
  numbers: number[],
  maxDifference: number,
): number {
  const sorted = [...numbers].sort((a, b) => a - b);

  let left = 0;
  let right = 0;
  let count = 0;

  while (left < sorted.length) {
    while (
      right < sorted.length &&
      sorted[right] - sorted[left] <= maxDifference
    ) {
      right++;
    }

    count += right - left - 1;
    left++;
  }

  return count;
}

export function verifyClosePairsCase(
  input: string,
  expectedOutput: string,
): ClosePairsVerificationResult {
  const values = input.trim().split(/\s+/).map(Number);

  if (
    values.length < 3 ||
    values.some((value) => !Number.isSafeInteger(value))
  ) {
    return {
      valid: false,
      message: "Input must contain N, K, and N integer values.",
    };
  }

  const [n, maxDifference, ...numbers] = values;
if (
  n < 1 ||
  maxDifference < 0 ||
  numbers.length !== n
) {

    return {
      valid: false,
      message: "Input does not satisfy the Count Close Pairs constraints.",
    };
  }

  const expected = Number(expectedOutput.trim());

  if (
    !Number.isSafeInteger(expected) ||
    expected < 0 ||
    String(expected) !== expectedOutput.trim()
  ) {
    return {
      valid: false,
      message: "Expected output must be a non-negative integer.",
    };
  }

  const actual = countClosePairs(numbers, maxDifference);

  if (actual !== expected) {
    return {
      valid: false,
      message: `Expected output ${expected}, but the trusted algorithm calculated ${actual}.`,
    };
  }

  return {
    valid: true,
    message: "Output matches the trusted reference algorithm.",
  };
}
