import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { apiClient } from '@/apis/instance'
import { FunctionSchema, type FunctionDef } from '../dto'
import { z } from 'zod'

// Get all functions
export function useFunctions() {
  return useQuery({
    queryKey: QUERY_KEYS.functions.list(),
    queryFn: async () => {
      const { data } = await apiClient.get('/functions')
      return z.array(FunctionSchema).parse(data)
    },
  })
}

// Get function by ID
export function useFunction(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.functions.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/functions/${id}`)
      return FunctionSchema.parse(data) as FunctionDef
    },
    enabled: !!id,
  })
}

