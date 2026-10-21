type VerificationResult = {
  valid: boolean;
  message: string;
};

export function verifyPalindromeCheckCase(
  input: string,
  output: string,
): VerificationResult {
  const s = input.replace(/\r?\n$/, "");

  if (!s.length) {
    return { valid: false, message: "Input string cannot be empty." };
  }

  const expected = s === s.split("").reverse().join("") ? "YES" : "NO";

  return {
    valid: output.trim().toUpperCase() === expected,
    message: `Expected output: ${expected}.`,
  };
}

export function verifyAnagramCheckCase(
  input: string,
  output: string,
): VerificationResult {
  const lines = input.split(/\r?\n/);

  if (lines.length < 2 || !lines[0].length || !lines[1].length) {
    return { valid: false, message: "Expected two non-empty strings." };
  }

  const expected =
    [...lines[0]].sort().join("") === [...lines[1]].sort().join("")
      ? "YES"
      : "NO";

  return {
    valid: output.trim().toUpperCase() === expected,
    message: `Expected output: ${expected}.`,
  };
}

export function verifyLongestCommonPrefixCase(
  input: string,
  output: string,
): VerificationResult {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    lines.length !== n + 1 ||
    lines.slice(1).some((word) => !word.length)
  ) {
    return { valid: false, message: "Invalid string input." };
  }

  let prefix = lines[1];

  for (const word of lines.slice(2)) {
    while (!word.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) break;
    }

    if (!prefix) break;
  }

  const expected = prefix || "-1";

  return {
    valid: output.trim() === expected,
    message: `Expected output: ${expected}.`,
  };
}