import { z } from 'zod'

// Execution Status
export const ExecutionStatusSchema = z.enum(['SUCCESS', 'FAILED', 'RUNNING', 'PENDING'])
export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>

// Execution Type
export const ExecutionTypeSchema = z.enum(['NORMAL', 'REPLAY', 'SHADOW'])
export type ExecutionType = z.infer<typeof ExecutionTypeSchema>

// Execution Schema
export const ExecutionSchema = z.object({
  id: z.number(),
  function: z.string(),
  status: ExecutionStatusSchema,
  type: ExecutionTypeSchema,
  parentExecutionId: z.number().nullable(),
  duration: z.number(),
  timestamp: z.string(),
  worker: z.string(),
  lamport: z.number(),
  input: z.record(z.any()),
  output: z.record(z.any()),
  logs: z.array(z.string()),
})

export type Execution = z.infer<typeof ExecutionSchema>

// List Response
export const ExecutionListResponseSchema = z.object({
  data: z.array(ExecutionSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
})

export type ExecutionListResponse = z.infer<typeof ExecutionListResponseSchema>

// Replay Request
export const ReplayRequestSchema = z.object({
  executionId: z.number(),
})

export type ReplayRequest = z.infer<typeof ReplayRequestSchema>

// Shadow Request
export const ShadowRequestSchema = z.object({
  executionId: z.number(),
  targetWorker: z.string().optional(),
})

export type ShadowRequest = z.infer<typeof ShadowRequestSchema>

