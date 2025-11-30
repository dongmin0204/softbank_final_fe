import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { apiClient } from '@/apis/instance'
import { ExecutionSchema, ExecutionListResponseSchema, type Execution } from '../dto'

interface GetExecutionsParams {
  functionId?: string
  status?: string
  type?: string
  page?: number
  limit?: number
}

// Get all executions
export function useExecutions(params?: GetExecutionsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.executions.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get('/executions', { params })
      return ExecutionListResponseSchema.parse(data)
    },
  })
}

// Get execution by ID
export function useExecution(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.executions.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/executions/${id}`)
      return ExecutionSchema.parse(data)
    },
    enabled: !!id,
  })
}

// Get failed executions
export function useFailedExecutions() {
  return useQuery({
    queryKey: QUERY_KEYS.executions.failures(),
    queryFn: async () => {
      const { data } = await apiClient.get('/executions', {
        params: { status: 'FAILED' },
      })
      return ExecutionListResponseSchema.parse(data)
    },
  })
}

// Get execution timeline
export function useExecutionTimeline(functionId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.executions.timeline(functionId),
    queryFn: async () => {
      const { data } = await apiClient.get('/executions/timeline', {
        params: { functionId },
      })
      return data as Execution[]
    },
  })
}

