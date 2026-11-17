import type { RagAnswerResponse } from '@/types/api'

// Kept so existing imports of AskResponse still work
export type AskResponse = RagAnswerResponse

// POST /api/rag/answer: multipart form with `file` (PDF) and `question`.
// Do NOT set Content-Type; the browser adds the multipart boundary itself.
export async function askRagQuestion(file: File, question: string): Promise<RagAnswerResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('question', question.trim())

  let res: Response
  try {
    res = await fetch('/api/rag/answer', { method: 'POST', body: formData })
  } catch {
    throw new Error('Network error. Check your connection and try again.')
  }

  const json = await res.json().catch(() => null)

  if (!res.ok || !json || 'error' in json) {
    throw new Error(json?.error ?? `Request failed (${res.status}). Please try again.`)
  }

  return json as RagAnswerResponse
}