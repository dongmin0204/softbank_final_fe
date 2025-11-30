import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { PATH } from '@/constants/path'

// Pages
import { DashboardPage } from '@/pages/DashboardPage'
import { DeployPage } from '@/pages/DeployPage'
import { FunctionsPage } from '@/pages/FunctionsPage'
import { TimelinePage } from '@/pages/TimelinePage'
import { FailuresPage } from '@/pages/FailuresPage'
import { ExecutionDetailPage } from '@/pages/ExecutionDetailPage'
import { ComparePage } from '@/pages/ComparePage'

export const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: PATH.DEPLOY,
        element: <DeployPage />,
      },
      {
        path: PATH.FUNCTIONS,
        element: <FunctionsPage />,
      },
      {
        path: PATH.TIMELINE,
        element: <TimelinePage />,
      },
      {
        path: PATH.FAILURES,
        element: <FailuresPage />,
      },
      {
        path: PATH.EXECUTION_DETAIL,
        element: <ExecutionDetailPage />,
      },
      {
        path: PATH.COMPARE,
        element: <ComparePage />,
      },
    ],
  },
])

