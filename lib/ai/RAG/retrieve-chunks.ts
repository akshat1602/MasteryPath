
import type { TextChunk } from "./chunk-text";

export interface RetrievedChunk {
  chunk: TextChunk;
  score: number;
}

export interface RetrievalOptions {
  topK?: number;
  minScore?: number;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were",
  "what", "why", "how", "when", "where", "which",
  "who", "do", "does", "did", "for", "to", "of",
  "in", "on", "at", "by", "with", "and", "or",
  "it", "this", "that", "can", "could", "should",
  "would", "explain", "tell", "me", "about", "used",
  "use", "using",
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Prototype retriever using keyword overlap.
 * This is not embedding-based semantic search.
 */
export function retrieveChunks(
  chunks: TextChunk[],
  query: string,
  options: RetrievalOptions = {},
): RetrievedChunk[] {
  const topK = options.topK ?? 3;
  const minScore = options.minScore ?? 0.35;

  if (!Number.isInteger(topK) || topK < 1) {
    throw new Error("topK must be a positive integer.");
  }

  if (minScore < 0 || minScore > 1) {
    throw new Error("minScore must be between 0 and 1.");
  }

  const queryTerms = [...new Set(tokenize(query))];

  if (queryTerms.length === 0 || chunks.length === 0) {
    return [];
  }

  const normalizedQuery = normalizeText(query);
  const results: RetrievedChunk[] = [];

  for (const chunk of chunks) {
    const normalizedChunk = normalizeText(chunk.text);
    const chunkTerms = tokenize(chunk.text);

    if (chunkTerms.length === 0) {
      continue;
    }

    const termCounts = new Map<string, number>();

    for (const term of chunkTerms) {
      termCounts.set(term, (termCounts.get(term) ?? 0) + 1);
    }

    let matchedTerms = 0;
    let frequencyBonus = 0;

    for (const term of queryTerms) {
      const count = termCounts.get(term) ?? 0;

      if (count > 0) {
        matchedTerms++;
        frequencyBonus += Math.min(count - 1, 2);
      }
    }

    if (matchedTerms === 0) {
      continue;
    }

    const coverage = matchedTerms / queryTerms.length;
    const repetition = Math.min(
      frequencyBonus / (queryTerms.length * 10),
      0.1,
    );

    const meaningfulQuery = queryTerms.join(" ");
const topicPhrase = queryTerms.slice(0, 2).join(" ");

const phraseBonus = normalizedChunk.includes(meaningfulQuery)
  ? 0.1
  : topicPhrase.length > 0 &&
      normalizedChunk.includes(topicPhrase)
    ? 0.25
    : 0;

    const score = Math.min(
      coverage + repetition + phraseBonus,
      1,
    );

    if (score >= minScore) {
      results.push({ chunk, score });
    }
  }

  return results
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.chunk.chunkIndex - b.chunk.chunkIndex,
    )
    .slice(0, topK);
}
