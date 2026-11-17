import { NextResponse } from "next/server";
import {
  decideNextDifficulty,
  type AdaptiveInput,
} from "@/lib/ai/adaptive-engine";

// Thin HTTP wrapper around lib/ai/adaptive-engine.ts.
// It only validates the request and calls decideNextDifficulty().
// The decision logic itself lives in the engine file.

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const VERDICTS = [
  "ACCEPTED",
  "WRONG_ANSWER",
  "EXECUTION_FAILED",
  "SERVICE_UNAVAILABLE",
  "RATE_LIMITED",
  "SERVICE_ERROR",
];

function isAdaptiveInput(value: unknown): value is AdaptiveInput {
  if (typeof value !== "object" || value === null) return false;

  const input = value as Record<string, unknown>;

  return (
    typeof input.currentDifficulty === "string" &&
    DIFFICULTIES.includes(input.currentDifficulty) &&
    typeof input.verdict === "string" &&
    VERDICTS.includes(input.verdict) &&
    typeof input.accepted === "boolean" &&
    typeof input.attempts === "number" &&
    Number.isInteger(input.attempts) &&
    typeof input.hintsUsed === "number" &&
    Number.isInteger(input.hintsUsed)
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  if (!isAdaptiveInput(body)) {
    return NextResponse.json(
      {
        error:
          "Provide currentDifficulty, verdict, accepted, attempts and hintsUsed.",
      },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(decideNextDifficulty(body));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid adaptive-engine input.",
      },
      { status: 400 },
    );
  }
}