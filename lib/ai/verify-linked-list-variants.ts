
type VerificationResult = {
  valid: boolean;
  message: string;
};

export function verifyReverseLinkedListCase(
  input: string,
  output: string,
): VerificationResult {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);

  if (!Number.isInteger(n) || n < 0) {
    return {
      valid: false,
      message: "Invalid linked-list input.",
    };
  }

  if (n === 0) {
    return {
      valid: output.trim() === "EMPTY",
      message: "An empty list must produce EMPTY.",
    };
  }

  const values = (lines[1] ?? "")
    .trim()
    .split(/\s+/)
    .map(Number);

  if (
    values.length !== n ||
    values.some((value) => !Number.isFinite(value))
  ) {
    return {
      valid: false,
      message: "Invalid linked-list input.",
    };
  }

  const expected = [...values].reverse().join(" ");

  return {
    valid: output.trim() === expected,
    message: "Output must contain all list values in reverse order.",
  };
}

export function verifyMiddleLinkedListCase(
  input: string,
  output: string,
): VerificationResult {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);
  const values = (lines[1] ?? "").trim().split(/\s+/).map(Number);

  if (!Number.isInteger(n) || n < 1 || values.length !== n) {
    return { valid: false, message: "Invalid linked-list input." };
  }

  const expected = String(values[Math.floor(n / 2)]);
  return {
    valid: output.trim() === expected,
    message: "Output must be the middle value (second middle for even lengths).",
  };
}

export function verifyLinkedListCycleCase(
  input: string,
  output: string,
): VerificationResult {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);
  const values = n > 0
    ? (lines[1] ?? "").trim().split(/\s+/).map(Number)
    : [];
  const pos = Number(lines[2]);

  if (
    !Number.isInteger(n) ||
    n < 0 ||
    values.length !== n ||
    !Number.isInteger(pos) ||
    pos < -1 ||
    pos >= n
  ) {
    return { valid: false, message: "Invalid cycle-detection input." };
  }

  const expected = pos === -1 ? "NO" : "YES";
  return {
    valid: output.trim().toUpperCase() === expected,
    message: "Output must be YES when POS is not -1, otherwise NO.",
  };
}
