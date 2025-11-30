// Re-export API types
export type { Execution, ExecutionStatus, ExecutionType } from '@/apis/executions/dto'
export type { FunctionDef, Runtime, DeployRequest, DeployResponse } from '@/apis/functions/dto'

// Common types
export interface PageProps {
  params?: Record<string, string>
  searchParams?: Record<string, string | string[] | undefined>
}

export interface ApiError {
  message: string
  code: string
  status: number
}

