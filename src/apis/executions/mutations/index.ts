import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { apiClient } from '@/apis/instance'
import { ExecutionSchema, type ReplayRequest, type ShadowRequest } from '../dto'

// Replay execution
export function useReplayExecution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ executionId }: ReplayRequest) => {
      const { data } = await apiClient.post(`/executions/${executionId}/replay`)
      return ExecutionSchema.parse(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.executions.all })
    },
  })
}

// Shadow execution
export function useShadowExecution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ executionId, targetWorker }: ShadowRequest) => {
      const { data } = await apiClient.post(`/executions/${executionId}/shadow`, {
        targetWorker,
      })
      return ExecutionSchema.parse(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.executions.all })
    },
  })
}

