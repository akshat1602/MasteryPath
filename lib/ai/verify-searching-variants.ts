
function parseSearchInput(input: string): {
  n: number;
  target: number;
  arr: number[];
} | null {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length !== 2) return null;

  const firstLine = lines[0].trim().split(/\s+/).map(Number);
  const arr = lines[1].trim().split(/\s+/).map(Number);

  if (firstLine.length !== 2) return null;

  const [n, target] = firstLine;

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    !Number.isFinite(target) ||
    arr.length !== n ||
    arr.some((value) => !Number.isFinite(value)) ||
    arr.some((value, i) => i > 0 && value < arr[i - 1])
  ) {
    return null;
  }

  return { n, target, arr };
}

function normalizeOutput(output: string): string | null {
  const trimmed = output.trim();

  if (!/^-?\d+$/.test(trimmed)) return null;

  const value = Number(trimmed);
  return Number.isSafeInteger(value) ? String(value) : null;
}

function verifySearchOutput(
  input: string,
  output: string,
  calculate: (arr: number[], target: number) => number,
): { valid: boolean; message: string } {
  const parsed = parseSearchInput(input);

  if (!parsed) {
    return {
      valid: false,
      message: "Invalid input. Provide N TARGET followed by N sorted integers.",
    };
  }

  const actual = normalizeOutput(output);

  if (actual === null) {
    return {
      valid: false,
      message: "Output must be a single integer.",
    };
  }

  const expected = calculate(parsed.arr, parsed.target);

  if (Number(actual) !== expected) {
    return {
      valid: false,
      message: `Incorrect output. Expected ${expected}, received ${actual}.`,
    };
  }

  return { valid: true, message: "Output verified successfully." };
}

export function verifyBinarySearchTargetCase(
  input: string,
  output: string,
): { valid: boolean; message: string } {
  return verifySearchOutput(input, output, (arr, target) => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (arr[mid] === target) return mid;
      if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }

    return -1;
  });
}

export function verifyFirstOccurrenceCase(
  input: string,
  output: string,
): { valid: boolean; message: string } {
  return verifySearchOutput(input, output, (arr, target) => {
    let left = 0;
    let right = arr.length - 1;
    let answer = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (arr[mid] === target) {
        answer = mid;
        right = mid - 1;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return answer;
  });
}

export function verifyLowerBoundCase(
  input: string,
  output: string,
): { valid: boolean; message: string } {
  return verifySearchOutput(input, output, (arr, target) => {
    let left = 0;
    let right = arr.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      if (arr[mid] < target) left = mid + 1;
      else right = mid;
    }

    return left < arr.length ? left : -1;
  });
}
