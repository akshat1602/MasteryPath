
/**
 * Independently checks the longest contiguous subarray
 * with sum equal to a target, assuming all array values
 * are positive integers.
 */
export function findLongestSubarrayLength(
  numbers: number[],
  target: number,
): number {
  let left = 0;
  let currentSum = 0;
  let longest = 0;

  for (let right = 0; right < numbers.length; right++) {
    currentSum += numbers[right];

    while (left <= right && currentSum > target) {
      currentSum -= numbers[left];
      left++;
    }

    if (currentSum === target) {
      longest = Math.max(longest, right - left + 1);
    }
  }

  return longest;
}

/**
 * Parses input formatted as:
 * n target
 * a1 a2 ... an
 */
export function verifyLongestSubarrayCase(
  input: string,
  expectedOutput: string,
): { valid: boolean; message: string } {
  const values = input.trim().split(/\s+/).map(Number);

  if (
    values.length < 2 ||
    values.some((value) => !Number.isSafeInteger(value))
  ) {
    return { valid: false, message: "Input contains invalid integers." };
  }

  const [n, target] = values;

  if (
    n < 1 ||
    target < 1 ||
    values.length !== n + 2 ||
    values.slice(2).some((value) => value < 1)
  ) {
    return {
      valid: false,
      message: "Expected n positive integers and a positive target.",
    };
  }

  const expected = Number(expectedOutput.trim());

  if (!Number.isSafeInteger(expected) || expected < 0) {
    return {
      valid: false,
      message: "Expected output must be a non-negative integer.",
    };
  }

  const actual = findLongestSubarrayLength(values.slice(2), target);

  if (actual !== expected) {
    return {
      valid: false,
      message: `Expected output ${expected}, but calculated ${actual}.`,
    };
  }

  return { valid: true, message: "Output verified." };
}
