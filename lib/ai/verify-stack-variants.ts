
type VerificationResult = {
  valid: boolean;
  message: string;
};

export function verifyValidParenthesesCase(
  input: string,
  output: string,
): VerificationResult {
  const s = input.trim();
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const ch of s) {
    if ("([{".includes(ch)) {
      stack.push(ch);
    } else if (ch in pairs) {
      if (!stack.length || stack.pop() !== pairs[ch]) {
        return {
          valid: output.trim().toUpperCase() === "NO",
          message: "Mismatched brackets must produce NO.",
        };
      }
    } else {
      return { valid: false, message: "Input contains invalid characters." };
    }
  }

  const expected = stack.length === 0 ? "YES" : "NO";

  return {
    valid: output.trim().toUpperCase() === expected,
    message: `Expected output: ${expected}.`,
  };
}

export function verifyNextGreaterElementCase(
  input: string,
  output: string,
): VerificationResult {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);
  const values = (lines[1] ?? "").trim().split(/\s+/).map(Number);

  if (
    !Number.isInteger(n) ||
    n < 1 ||
    values.length !== n ||
    values.some((v) => !Number.isFinite(v))
  ) {
    return { valid: false, message: "Invalid array input." };
  }

  const expected = Array(n).fill(-1);
  const stack: number[] = [];

  for (let i = 0; i < n; i++) {
    while (stack.length && values[i] > values[stack[stack.length - 1]]) {
      expected[stack.pop()!] = values[i];
    }
    stack.push(i);
  }

  return {
    valid: output.trim().split(/\s+/).join(" ") === expected.join(" "),
    message: `Expected output: ${expected.join(" ")}.`,
  };
}

export function verifyMinStackCase(
  input: string,
  output: string,
): VerificationResult {
  const lines = input.trim().split(/\r?\n/);
  const n = Number(lines[0]);

  if (!Number.isInteger(n) || n < 1 || lines.length !== n + 1) {
    return { valid: false, message: "Invalid operation count." };
  }

  const stack: number[] = [];
  const expected: string[] = [];

  for (let i = 1; i <= n; i++) {
    const parts = lines[i].trim().split(/\s+/);

    if (parts[0] === "PUSH" && parts.length === 2) {
      const value = Number(parts[1]);
      if (!Number.isFinite(value)) {
        return { valid: false, message: "Invalid PUSH value." };
      }
      stack.push(value);
    } else if (parts[0] === "POP" && parts.length === 1) {
      if (stack.length) stack.pop();
    } else if (parts[0] === "MIN" && parts.length === 1) {
      expected.push(stack.length ? String(Math.min(...stack)) : "EMPTY");
    } else {
      return { valid: false, message: "Invalid stack operation." };
    }
  }

  return {
    valid: output.trim() === expected.join("\n"),
    message: `Expected output: ${expected.join("\n") || "(empty output)"}.`,
  };
}
