export const PATH = {
  ROOT: '/',
  DEPLOY: '/deploy',
  FUNCTIONS: '/functions',
  TIMELINE: '/timeline',
  FAILURES: '/failures',
  EXECUTION_DETAIL: '/execution/:id',
  COMPARE: '/compare/:id',
} as const

export type PathKey = keyof typeof PATH

// Helper function to generate paths with parameters
export const generatePath = {
  executionDetail: (id: string | number) => `/execution/${id}`,
  compare: (id: string | number) => `/compare/${id}`,
}

