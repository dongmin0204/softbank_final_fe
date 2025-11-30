import { ExecutionDetail } from '@/components/aws/ExecutionDetail'
import { useNavigate, useParams } from 'react-router'
import { PATH, generatePath } from '@/constants/path'
import { useExecutionStore } from '@/stores/execution.store'
import { mockData } from '@/data/mockData'

export function ExecutionDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const selectedExecution = useExecutionStore((state) => state.selectedExecution)
  const setCompareData = useExecutionStore((state) => state.setCompareData)

  // Find execution from mockData if not in store
  const execution = selectedExecution || mockData.executions.find((e) => e.id === Number(id))

  const handleNavigate = (page: string, data?: any) => {
    switch (page) {
      case 'dashboard':
        navigate(PATH.ROOT)
        break
      case 'timeline':
        navigate(PATH.TIMELINE)
        break
      case 'compare':
        if (data) {
          setCompareData(data)
          navigate(generatePath.compare(data.original.id))
        }
        break
      default:
        break
    }
  }

  if (!execution) {
    return (
      <div className="p-6">
        <p>Execution not found</p>
      </div>
    )
  }

  return <ExecutionDetail onNavigate={handleNavigate} execution={execution} />
}

