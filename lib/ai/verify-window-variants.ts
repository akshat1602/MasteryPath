
export interface VerificationResult {
  valid: boolean;
  message: string;
}

function parseIntegerInput(input: string): number[] | null {
  const trimmed = input.trim();

  if (!trimmed) return null;

  const tokens = trimmed.split(/\s+/);
  const values = tokens.map(Number);

  if (
    values.some(
      (value, index) =>
        !Number.isSafeInteger(value) || tokens[index] === "",
    )
  ) {
    return null;
  }

  return values;
}

export function calculateMaximumFixedWindowSum(
  numbers: number[],
  k: number,
): number | null {
  if (k < 1 || k > numbers.length) return null;

  let windowSum = 0;

  for (let i = 0; i < k; i++) {
    windowSum += numbers[i];
  }

  let maximum = windowSum;

  for (let right = k; right < numbers.length; right++) {
    windowSum += numbers[right] - numbers[right - k];
    maximum = Math.max(maximum, windowSum);
  }

  return maximum;
}

export function calculateMinimumFixedWindowAverage(
  numbers: number[],
  k: number,
): number | null {
  if (k < 1 || k > numbers.length) return null;

  let windowSum = 0;

  for (let i = 0; i < k; i++) {
    windowSum += numbers[i];
  }

  let minimum = windowSum;

  for (let right = k; right < numbers.length; right++) {
    windowSum += numbers[right] - numbers[right - k];
    minimum = Math.min(minimum, windowSum);
  }

  // Return the sum; divide by k only when formatting the answer.
  return minimum / k;
}

function calculateFromInput(
  input: string,
  kind: "maximum-sum" | "minimum-average",
): number | null {
  const values = parseIntegerInput(input);

  if (!values || values.length < 3) return null;

  const [n, k, ...numbers] = values;

  if (
    n < 1 ||
    k < 1 ||
    k > n ||
    numbers.length !== n ||
    numbers.some((value) => !Number.isSafeInteger(value))
  ) {
    return null;
  }

  return kind === "maximum-sum"
    ? calculateMaximumFixedWindowSum(numbers, k)
    : calculateMinimumFixedWindowAverage(numbers, k);
}

export function verifyWindowVariantCase(
  input: string,
  expectedOutput: string,
  kind: "maximum-sum" | "minimum-average",
): VerificationResult {
  const actual = calculateFromInput(input, kind);

  if (actual === null || !Number.isFinite(actual)) {
    return {
      valid: false,
      message: "Input is invalid for this fixed-window problem.",
    };
  }

  const expected = Number(expectedOutput.trim());

  if (
    !Number.isFinite(expected) ||
    expectedOutput.trim() === ""
  ) {
    return {
      valid: false,
      message: "Expected output must be a valid number.",
    };
  }

  const matches =
    kind === "maximum-sum"
      ? Number.isSafeInteger(expected) && expected === actual
      : Math.abs(expected - actual) <= 1e-6;

  return matches
    ? { valid: true, message: "Output verified." }
    : {
        valid: false,
        message: `Expected output ${expected}, but the trusted algorithm calculated ${actual}.`,
      };
}
