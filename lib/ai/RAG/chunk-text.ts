
export interface TextChunk {
  chunkIndex: number;
  text: string;
  startChar: number;
  endChar: number;
}

export interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
}

export function chunkText(
  input: string,
  options: ChunkOptions = {},
): TextChunk[] {
  const chunkSize = options.chunkSize ?? 1200;
  const overlap = options.overlap ?? 200;

  if (
    !Number.isInteger(chunkSize) ||
    !Number.isInteger(overlap) ||
    chunkSize <= 0 ||
    overlap < 0 ||
    overlap >= chunkSize
  ) {
    throw new Error(
      "chunkSize must be positive and overlap must be between 0 and chunkSize - 1.",
    );
  }

  const text = input.replace(/\r\n?/g, "\n").trim();

  if (!text) {
    return [];
  }

  const chunks: TextChunk[] = [];

  function addChunk(start: number, end: number): void {
    const rawText = text.slice(start, end);
    const leadingWhitespace = rawText.length - rawText.trimStart().length;
    const trailingWhitespace = rawText.length - rawText.trimEnd().length;

    const cleanText = rawText.trim();

    if (!cleanText) {
      return;
    }

    chunks.push({
      chunkIndex: chunks.length,
      text: cleanText,
      startChar: start + leadingWhitespace,
      endChar: end - trailingWhitespace,
    });
  }

  // Preserve paragraph boundaries and their original positions.
  const paragraphs: Array<{ start: number; end: number }> = [];
  const paragraphRegex = /\S[\s\S]*?(?=\n\s*\n|$)/g;

  for (const match of text.matchAll(paragraphRegex)) {
    if (match.index === undefined) {
      continue;
    }

    const raw = match[0];
    const leading = raw.length - raw.trimStart().length;
    const trailing = raw.length - raw.trimEnd().length;

    paragraphs.push({
      start: match.index + leading,
      end: match.index + raw.length - trailing,
    });
  }

  // Split an oversized paragraph into sentence-sized pieces.
  function splitLongParagraph(
    paragraph: { start: number; end: number },
  ): void {
    const sentences: Array<{ start: number; end: number }> = [];
    const sentenceRegex = /[^.!?]+(?:[.!?]+["')\]]*|$)/g;
    const paragraphText = text.slice(paragraph.start, paragraph.end);

    for (const match of paragraphText.matchAll(sentenceRegex)) {
      if (match.index === undefined) {
        continue;
      }

      const raw = match[0];
      const leading = raw.length - raw.trimStart().length;
      const trailing = raw.length - raw.trimEnd().length;
      const start = paragraph.start + match.index + leading;
      const end = paragraph.start + match.index + raw.length - trailing;

      if (start < end) {
        sentences.push({ start, end });
      }
    }

    // Fall back to word boundaries for a sentence longer than chunkSize.
    function splitOversizedSentence(
      start: number,
      end: number,
    ): void {
      let cursor = start;

      while (cursor < end) {
        let boundary = Math.min(cursor + chunkSize, end);

        if (boundary < end) {
          const window = text.slice(cursor, boundary);
          const lastSpace = window.lastIndexOf(" ");

          if (lastSpace > 0) {
            boundary = cursor + lastSpace;
          }
        }

        addChunk(cursor, boundary);

        if (boundary >= end) {
          break;
        }

        // Overlap only inside a single oversized sentence.
        const nextCursor = Math.max(cursor + 1, boundary - overlap);
        cursor = nextCursor;
      }
    }

    let groupStart: number | null = null;
    let groupEnd = 0;

    function flush(): void {
      if (groupStart !== null) {
        addChunk(groupStart, groupEnd);
        groupStart = null;
      }
    }

    for (const sentence of sentences) {
      const sentenceLength = sentence.end - sentence.start;

      if (sentenceLength > chunkSize) {
        flush();
        splitOversizedSentence(sentence.start, sentence.end);
        continue;
      }

      if (groupStart === null) {
        groupStart = sentence.start;
        groupEnd = sentence.end;
        continue;
      }

      if (sentence.end - groupStart <= chunkSize) {
        groupEnd = sentence.end;
      } else {
        flush();
        groupStart = sentence.start;
        groupEnd = sentence.end;
      }
    }

    flush();
  }

  let groupStart: number | null = null;
  let groupEnd = 0;

  function flushGroup(): void {
    if (groupStart !== null) {
      addChunk(groupStart, groupEnd);
      groupStart = null;
    }
  }

  for (const paragraph of paragraphs) {
    const paragraphLength = paragraph.end - paragraph.start;

    if (paragraphLength > chunkSize) {
      flushGroup();
      splitLongParagraph(paragraph);
      continue;
    }

    if (groupStart === null) {
      groupStart = paragraph.start;
      groupEnd = paragraph.end;
      continue;
    }

    // Keep paragraphs together when they fit within the size limit.
    if (paragraph.end - groupStart <= chunkSize) {
      groupEnd = paragraph.end;
    } else {
      flushGroup();
      groupStart = paragraph.start;
      groupEnd = paragraph.end;
    }
  }

  flushGroup();

  return chunks;
}
