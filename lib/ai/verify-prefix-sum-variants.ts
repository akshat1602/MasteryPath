
function parseIntegerLines(input: string): string[] {
  return input.trim().split(/\r?\n/).map(line => line.trim());
}

export function verifyRangeSumQueryCase(
  input: string,
  expectedOutput: string,
): boolean {
  const lines = parseIntegerLines(input);
  if (lines.length < 2) return false;

  const [n, q] = lines[0].split(/\s+/).map(Number);
  if (!Number.isInteger(n) || !Number.isInteger(q) || n < 1 || q < 1) return false;
  if (lines.length !== q + 2) return false;

  const arr = lines[1].split(/\s+/).map(Number);
  if (arr.length !== n || arr.some(x => !Number.isSafeInteger(x))) return false;

  const answers: number[] = [];
  for (let i = 0; i < q; i++) {
    const parts = lines[i + 2].split(/\s+/).map(Number);
    if (parts.length !== 2) return false;
    const [l, r] = parts;
    if (!Number.isInteger(l) || !Number.isInteger(r) || l < 0 || l > r || r >= n) return false;
    answers.push(arr.slice(l, r + 1).reduce((sum, x) => sum + x, 0));
  }

  return normalize(expectedOutput) === normalize(answers.join("\n"));
}

export function verifyEquilibriumIndexCase(
  input: string,
  expectedOutput: string,
): boolean {
  const lines = parseIntegerLines(input);
  if (lines.length !== 2) return false;

  const n = Number(lines[0]);
  const arr = lines[1].split(/\s+/).map(Number);
  if (!Number.isInteger(n) || n < 1 || arr.length !== n || arr.some(x => !Number.isSafeInteger(x))) return false;

  const total = arr.reduce((sum, x) => sum + x, 0);
  let leftSum = 0;
  let answer = -1;

  for (let i = 0; i < n; i++) {
    if (leftSum === total - leftSum - arr[i]) {
      answer = i;
      break;
    }
    leftSum += arr[i];
  }

  return normalize(expectedOutput) === String(answer);
}

export function verifyRangeUpdateQueriesCase(
  input: string,
  expectedOutput: string,
): boolean {
  const lines = parseIntegerLines(input);
  if (lines.length < 1) return false;

  const [n, q] = lines[0].split(/\s+/).map(Number);
  if (!Number.isInteger(n) || !Number.isInteger(q) || n < 1 || q < 1) return false;
  if (lines.length !== q + 1) return false;

  const diff = Array(n + 1).fill(0);

  for (let i = 0; i < q; i++) {
    const parts = lines[i + 1].split(/\s+/).map(Number);
    if (parts.length !== 3) return false;

    const [l, r, x] = parts;
    if (!Number.isInteger(l) || !Number.isInteger(r) || l < 0 || l > r || r >= n || !Number.isSafeInteger(x)) return false;

    diff[l] += x;
    diff[r + 1] -= x;
  }

  const result: number[] = [];
  let current = 0;
  for (let i = 0; i < n; i++) {
    current += diff[i];
    result.push(current);
  }

  return normalize(expectedOutput) === normalize(result.join(" "));
}

function normalize(value: string): string {
  return value.trim().split(/\s+/).join(" ");
}
