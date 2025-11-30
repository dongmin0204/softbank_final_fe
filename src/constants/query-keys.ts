export const QUERY_KEYS = {
  // Functions
  functions: {
    all: ['functions'] as const,
    list: () => [...QUERY_KEYS.functions.all, 'list'] as const,
    detail: (id: string) => [...QUERY_KEYS.functions.all, 'detail', id] as const,
  },

  // Executions
  executions: {
    all: ['executions'] as const,
    list: (params?: { functionId?: string; status?: string; type?: string }) =>
      [...QUERY_KEYS.executions.all, 'list', params] as const,
    detail: (id: string) => [...QUERY_KEYS.executions.all, 'detail', id] as const,
    timeline: (functionId?: string) =>
      [...QUERY_KEYS.executions.all, 'timeline', functionId] as const,
    failures: () => [...QUERY_KEYS.executions.all, 'failures'] as const,
  },

  // Stats
  stats: {
    all: ['stats'] as const,
    dashboard: () => [...QUERY_KEYS.stats.all, 'dashboard'] as const,
    replay: () => [...QUERY_KEYS.stats.all, 'replay'] as const,
  },
} as const

