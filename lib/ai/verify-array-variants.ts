
export interface ArrayVerificationResult {
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

export function calculateSecondLargest(
  numbers: number[],
): number | null {
  if (numbers.length < 2) return null;

  let largest: number | null = null;
  let secondLargest: number | null = null;

  for (const number of numbers) {
    if (largest === null || number > largest) {
      secondLargest = largest;
      largest = number;
    } else if (
      number < largest &&
      (secondLargest === null || number > secondLargest)
    ) {
      secondLargest = number;
    }
  }

  return secondLargest;
}

export function verifySecondLargestCase(
  input: string,
  expectedOutput: string,
): ArrayVerificationResult {
  const values = parseInput(input);

  if (!values || values.length < 2) {
    return {
      valid: false,
      message: "Input must contain N and at least two array elements.",
    };
  }

  const [n, ...numbers] = values;

  if (n < 2 || numbers.length !== n) {
    return {
      valid: false,
      message: "N must match the number of array elements and be at least 2.",
    };
  }

  const actual = calculateSecondLargest(numbers);

  if (actual === null) {
    return {
      valid: false,
      message: "The array must contain at least two distinct values.",
    };
  }

  const output = expectedOutput.trim();

  if (!/^-?\d+$/.test(output)) {
    return {
      valid: false,
      message: "Expected output must be a single integer.",
    };
  }

  const expected = Number(output);

  if (!Number.isSafeInteger(expected)) {
    return {
      valid: false,
      message: "Expected output must be a safe integer.",
    };
  }

  return actual === expected
    ? { valid: true, message: "Output verified." }
    : {
        valid: false,
        message: `Expected ${expected}, but the trusted algorithm calculated ${actual}.`,
      };
    }
      export function verifyRotateArrayCase(
  input: string,
  expectedOutput: string,
): ArrayVerificationResult {
  const values = parseInput(input);

  if (!values || values.length < 3) {
    return {
      valid: false,
      message: "Input must contain N, K, and at least one array element.",
    };
  }

  const [n, k, ...numbers] = values;

  if (n < 1 || k < 0 || numbers.length !== n) {
    return {
      valid: false,
      message: "N must match the number of array elements, and K must be non-negative.",
    };
  }

  const rotation = k % n;
  const rotated = rotation === 0
    ? numbers
    : [...numbers.slice(-rotation), ...numbers.slice(0, -rotation)];

  const output = expectedOutput.trim().split(/\s+/).map(Number);

  if (
    output.length !== n ||
    output.some((value) => !Number.isSafeInteger(value))
  ) {
    return {
      valid: false,
      message: "Expected output must contain exactly N integers.",
    };
  }

  const valid = rotated.every((value, index) => value === output[index]);

  return valid
    ? { valid: true, message: "Output verified." }
    : {
        valid: false,
        message: `Expected rotated array: ${rotated.join(" ")}.`,
      };
}
export function verifyMaximumSubarraySumCase(
  input: string,
  expectedOutput: string,
): ArrayVerificationResult {
  const values = parseInput(input);

  if (!values || values.length < 2) {
    return {
      valid: false,
      message: "Input must contain N and at least one array element.",
    };
  }

  const [n, ...numbers] = values;

  if (n < 1 || numbers.length !== n) {
    return {
      valid: false,
      message: "N must match the number of array elements.",
    };
  }

  let maxEndingHere = numbers[0];
  let maxSoFar = numbers[0];

  for (let i = 1; i < n; i++) {
    maxEndingHere = Math.max(
      numbers[i],
      maxEndingHere + numbers[i],
    );
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  const output = expectedOutput.trim();

  if (!/^-?\d+$/.test(output) || !Number.isSafeInteger(Number(output))) {
    return {
      valid: false,
      message: "Expected output must be one integer.",
    };
  }

  return Number(output) === maxSoFar
    ? { valid: true, message: "Output verified." }
    : {
        valid: false,
        message: `Expected maximum subarray sum: ${maxSoFar}.`,
      };
}
