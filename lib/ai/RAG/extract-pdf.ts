import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export interface ExtractedPdf {
  text: string;
  totalPages: number;
}

export async function extractPdfText(
  file: File,
): Promise<ExtractedPdf> {
  if (file.size === 0) {
    throw new Error("The uploaded PDF is empty.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("PDF size must not exceed 10 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();

    const text = result.text
      .replace(/\r\n?/g, "\n")
      .trim();

    if (!text) {
      throw new Error(
        "No readable text was found. The PDF may contain scanned images.",
      );
    }

    return {
      text,
      totalPages: result.total,
    };
  } finally {
    await parser.destroy();
  }
}
