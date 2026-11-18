import { z } from 'zod'

/* ───────── GET /api/topics (PROPOSED, confirm with Akshat) ───────── */
export const TopicStatusSchema = z.enum(['mastered', 'ready', 'decaying', 'pending'])

export const TopicNodeDataSchema = z
  .object({
    label: z.string(),
    slug: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    estimatedMinutes: z.number().optional(),
    status: TopicStatusSchema.optional(),
    retention: z.number().min(0).max(100).optional(),   // percent
    transferGap: z.number().min(0).max(100).optional(), // percent
    nextReviewAt: z.string().nullable().optional(),     // ISO date, for the SM-2 queue
  })
  .passthrough()

export const TopicsResponseSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string().optional(),
      position: z.object({ x: z.number(), y: z.number() }).optional(),
      data: TopicNodeDataSchema,
    })
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      animated: z.boolean().optional(),
    })
  ),
})
export type TopicsResponse = z.infer<typeof TopicsResponseSchema>

/* ───────── POST /api/evaluate-answer (CONFIRMED) ───────── */
export const EvaluateAnswerResponseSchema = z.object({
  verdict: z.enum(['CORRECT', 'PARTIALLY_CORRECT', 'INCORRECT', 'NEEDS_CLARIFICATION']),
  conceptualScore: z.number().int().min(0).max(100),
  strengths: z.array(z.string()),
  mistakes: z.array(z.string()),
  missingConcepts: z.array(z.string()),
  feedback: z.string(),
  nextStep: z.string(),
  verificationStatus: z.literal('AI_CONCEPTUAL_ASSESSMENT_ONLY'),
  model: z.string(),
})

/* ───────── POST /api/rag/answer (CONFIRMED) ───────── */
export const RagAnswerResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(
    z.object({ chunkIndex: z.number(), score: z.number(), text: z.string() })
  ),
  metadata: z
    .object({
      provider: z.string(),
      model: z.string(),
      totalPages: z.number(),
      totalChunks: z.number(),
      retrievedChunks: z.number(),
    })
    .optional(),
})