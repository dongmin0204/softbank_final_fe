import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Execution } from '@/apis/executions/dto'

interface ExecutionState {
  // Selected execution for detail view
  selectedExecution: Execution | null
  setSelectedExecution: (execution: Execution | null) => void

  // Compare data
  compareData: {
    original: Execution
    type: 'replay' | 'shadow'
  } | null
  setCompareData: (data: { original: Execution; type: 'replay' | 'shadow' } | null) => void

  // Filters
  filters: {
    status?: string
    type?: string
    functionId?: string
    timeRange?: string
  }
  setFilters: (filters: ExecutionState['filters']) => void
  clearFilters: () => void
}

export const useExecutionStore = create<ExecutionState>()(
  devtools(
    (set) => ({
      // Selected execution
      selectedExecution: null,
      setSelectedExecution: (execution) => set({ selectedExecution: execution }),

      // Compare data
      compareData: null,
      setCompareData: (data) => set({ compareData: data }),

      // Filters
      filters: {},
      setFilters: (filters) => set({ filters }),
      clearFilters: () => set({ filters: {} }),
    }),
    { name: 'ExecutionStore' }
  )
)

