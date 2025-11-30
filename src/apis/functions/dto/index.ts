import { z } from 'zod'

// Runtime Schema
export const RuntimeSchema = z.enum(['node20', 'python312', 'go121'])
export type Runtime = z.infer<typeof RuntimeSchema>

// Function Schema
export const FunctionSchema = z.object({
  id: z.string(),
  name: z.string(),
  runtime: z.string(),
  currentVersion: z.string(),
  executions24h: z.number(),
  failures24h: z.number(),
  active: z.boolean(),
})

export type FunctionDef = z.infer<typeof FunctionSchema>

// Deploy Request
export const DeployRequestSchema = z.object({
  name: z.string().min(1, 'Function name is required'),
  runtime: RuntimeSchema,
  code: z.string().min(1, 'Code is required'),
  envVars: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  memory: z.number().optional(),
  timeout: z.number().optional(),
})

export type DeployRequest = z.infer<typeof DeployRequestSchema>

// Deploy Response
export const DeployResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  url: z.string(),
  deployedAt: z.string(),
})

export type DeployResponse = z.infer<typeof DeployResponseSchema>

