
type VerificationResult = {
  valid: boolean;
  message?: string;
};

function parseArrayInput(input: string) {
  const lines = input.trim().split(/\r?\n/);

  if (lines.length !== 2) return null;

  const n = Number(lines[0].trim());
  const values = lines[1].trim().split(/\s+/).map(Number);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    values.length !== n ||
    values.some((value) => !Number.isSafeInteger(value))
  ) {
    return null;
  }

  return values;
}

function compareOutput(
  output: string,
  expected: number[],
): VerificationResult {
  const actual = output.trim().split(/\s+/).map(Number);

  if (
    actual.length !== expected.length ||
    actual.some((value) => !Number.isSafeInteger(value)) ||
    actual.some((value, index) => value !== expected[index])
  ) {
    return {
      valid: false,
      message: "Output does not match the trusted expected result.",
    };
  }

  return { valid: true };
}

export function verifyBubbleSortCase(
  input: string,
  output: string,
): VerificationResult {
  const values = parseArrayInput(input);
  if (!values) {
    return { valid: false, message: "Invalid Bubble Sort input." };
  }

  const expected = [...values].sort((a, b) => a - b);
  return compareOutput(output, expected);
}

export function verifySelectionSortCase(
  input: string,
  output: string,
): VerificationResult {
  const values = parseArrayInput(input);
  if (!values) {
    return { valid: false, message: "Invalid Selection Sort input." };
  }

  const expected = [...values].sort((a, b) => a - b);
  return compareOutput(output, expected);
}

export function verifyMergeSortCase(
  input: string,
  output: string,
): VerificationResult {
  const values = parseArrayInput(input);
  if (!values) {
    return { valid: false, message: "Invalid Merge Sort input." };
  }

  const expected = [...values].sort((a, b) => a - b);
  return compareOutput(output, expected);
}

export function verifySortColorsCase(
  input: string,
  output: string,
): VerificationResult {
  const values = parseArrayInput(input);

  if (!values || values.some((value) => ![0, 1, 2].includes(value))) {
    return { valid: false, message: "Invalid Sort Colors input." };
  }

  const expected = [...values].sort((a, b) => a - b);
  return compareOutput(output, expected);
}


export function verifyMergeSortedArraysCase(
  input: string,
  output: string,
): VerificationResult {
  const lines = input.split(/\r?\n/);

  // Remove extra trailing blank lines, but preserve the three input lines.
  while (lines.length > 3 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  if (lines.length !== 3) {
    return {
      valid: false,
      message: "Invalid Merge Sorted Arrays input.",
    };
  }

  const sizes = lines[0].trim().split(/\s+/).map(Number);
  const a =
    lines[1].trim() === ""
      ? []
      : lines[1].trim().split(/\s+/).map(Number);
  const b =
    lines[2].trim() === ""
      ? []
      : lines[2].trim().split(/\s+/).map(Number);

  if (sizes.length !== 2) {
    return {
      valid: false,
      message: "Invalid Merge Sorted Arrays sizes.",
    };
  }

  const [n, m] = sizes;

  if (
    !Number.isInteger(n) ||
    !Number.isInteger(m) ||
    n < 0 ||
    m < 0 ||
    a.length !== n ||
    b.length !== m ||
    [...a, ...b].some((value) => !Number.isSafeInteger(value)) ||
    a.some((value, i) => i > 0 && a[i - 1] > value) ||
    b.some((value, i) => i > 0 && b[i - 1] > value)
  ) {
    return {
      valid: false,
      message: "Invalid or unsorted input arrays.",
    };
  }

  const expected = [...a, ...b].sort((x, y) => x - y);
  return compareOutput(output, expected);
}
