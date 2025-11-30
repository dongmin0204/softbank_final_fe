import { ExecutionTimeline } from '@/components/aws/ExecutionTimeline'
import { mockData } from '@/data/mockData'
import { useNavigate } from 'react-router'
import { PATH, generatePath } from '@/constants/path'
import { useExecutionStore } from '@/stores/execution.store'

export function TimelinePage() {
  const navigate = useNavigate()
  const setSelectedExecution = useExecutionStore((state) => state.setSelectedExecution)

  const handleNavigate = (page: string, data?: any) => {
    switch (page) {
      case 'dashboard':
        navigate(PATH.ROOT)
        break
      case 'execution':
        if (data) {
          setSelectedExecution(data)
          navigate(generatePath.executionDetail(data.id))
        }
        break
      default:
        break
    }
  }

  return <ExecutionTimeline onNavigate={handleNavigate} data={mockData} />
}

