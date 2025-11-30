import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { apiClient } from '@/apis/instance'
import { DeployResponseSchema, type DeployRequest } from '../dto'

// Deploy function
export function useDeployFunction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: DeployRequest) => {
      const { data } = await apiClient.post('/functions', request)
      return DeployResponseSchema.parse(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.functions.all })
    },
  })
}

// Invoke function (test run)
export function useInvokeFunction() {
  return useMutation({
    mutationFn: async ({
      functionName,
      payload,
    }: {
      functionName: string
      payload: Record<string, unknown>
    }) => {
      const { data } = await apiClient.post(`/invoke/${functionName}`, payload)
      return data
    },
  })
}

// Delete function
export function useDeleteFunction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/functions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.functions.all })
    },
  })
}

