
export interface TwoPointerVerificationResult {
  valid: boolean;
  message: string;
}

function parseInput(input: string): number[] | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const tokens = trimmed.split(/\s+/);
  const values = tokens.map(Number);

  if (values.some((value) => !Number.isSafeInteger(value))) {
    return null;
  }

  return values;
}

function isNonDecreasing(numbers: number[]): boolean {
  return numbers.every(
    (number, index) => index === 0 || numbers[index - 1] <= number,
  );
}

export function calculateTwoSumSorted(
  numbers: number[],
  target: number,
): boolean {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) return true;
    if (sum < target) left++;
    else right--;
  }

  return false;
}

export function calculateRemoveDuplicatesSorted(
  numbers: number[],
): number[] {
  if (numbers.length === 0) return [];

  const unique = [numbers[0]];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] !== numbers[i - 1]) {
      unique.push(numbers[i]);
    }
  }

  return unique;
}

export function verifyTwoSumSortedCase(
  input: string,
  expectedOutput: string,
): TwoPointerVerificationResult {
  const values = parseInput(input);

  if (!values || values.length < 3) {
    return { valid: false, message: "Input must contain N, target, and array values." };
  }

  const [n, target, ...numbers] = values;

  if (
    n < 2 ||
    numbers.length !== n ||
    !isNonDecreasing(numbers)
  ) {
    return {
      valid: false,
      message: "Expected at least two sorted array elements.",
    };
  }

  const expected = expectedOutput.trim().toUpperCase();

  if (expected !== "YES" && expected !== "NO") {
    return {
      valid: false,
      message: 'Expected output must be "YES" or "NO".',
    };
  }

  const actual = calculateTwoSumSorted(numbers, target) ? "YES" : "NO";

  return actual === expected
    ? { valid: true, message: "Output verified." }
    : {
        valid: false,
        message: `Expected ${expected}, but the trusted algorithm calculated ${actual}.`,
      };
}

export function verifyRemoveDuplicatesSortedCase(
  input: string,
  expectedOutput: string,
): TwoPointerVerificationResult {
  const values = parseInput(input);

  if (!values || values.length < 2) {
    return { valid: false, message: "Input must contain N and array values." };
  }

  const [n, ...numbers] = values;

  if (
    n < 1 ||
    numbers.length !== n ||
    !isNonDecreasing(numbers)
  ) {
    return {
      valid: false,
      message: "Expected a non-empty sorted array.",
    };
  }

  const unique = calculateRemoveDuplicatesSorted(numbers);
  const expectedLines = expectedOutput.trim().split(/\r?\n/);

  if (expectedLines.length < 2) {
    return {
      valid: false,
      message: "Expected output must contain a count and a second line of elements.",
    };
  }

  const count = Number(expectedLines[0].trim());
  const outputNumbers = expectedLines[1].trim()
    ? expectedLines[1].trim().split(/\s+/).map(Number)
    : [];

  const validOutput =
    Number.isSafeInteger(count) &&
    count === unique.length &&
    outputNumbers.length === unique.length &&
    outputNumbers.every((value, index) => value === unique[index]);

  return validOutput
    ? { valid: true, message: "Output verified." }
    : {
        valid: false,
        message: `Expected ${unique.length} distinct sorted elements: ${unique.join(" ")}.`,
      };
}
