export interface AskResponse {
  answer: string
  sources: { filename: string; page: number; [key: string]: any }[]
  hasRelevantMaterial?: boolean
}

export class RagApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'RagApiError'
  }
}

/**
 * Sends a PDF file and a question to the RAG endpoint for an AI-generated answer.
 */
export async function askRagQuestion(file: File, question: string): Promise<AskResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('question', question)

  try {
    const res = await fetch('/api/rag/answer', {
      method: 'POST',
      body: formData, // fetch automatically sets the correct multipart/form-data boundary
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new RagApiError(errorData?.error || `Request failed with status ${res.status}`, res.status)
    }

    const data = await res.json()
    return data as AskResponse
  } catch (error) {
    if (error instanceof RagApiError) throw error
    throw new RagApiError('Network error. Check your connection and try again.')
  }
}