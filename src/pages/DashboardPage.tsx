import { Dashboard } from '@/components/aws/Dashboard'
import { mockData } from '@/data/mockData'
import { useNavigate } from 'react-router'
import { PATH, generatePath } from '@/constants/path'
import { useExecutionStore } from '@/stores/execution.store'

export function DashboardPage() {
  const navigate = useNavigate()
  const setSelectedExecution = useExecutionStore((state) => state.setSelectedExecution)
  const setCompareData = useExecutionStore((state) => state.setCompareData)

  const handleNavigate = (page: string, data?: any) => {
    switch (page) {
      case 'dashboard':
        navigate(PATH.ROOT)
        break
      case 'deploy':
        navigate(PATH.DEPLOY)
        break
      case 'functions':
        navigate(PATH.FUNCTIONS)
        break
      case 'timeline':
        navigate(PATH.TIMELINE)
        break
      case 'failures':
        navigate(PATH.FAILURES)
        break
      case 'execution':
        if (data) {
          setSelectedExecution(data)
          navigate(generatePath.executionDetail(data.id))
        }
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

  return <Dashboard onNavigate={handleNavigate} data={mockData} />
}

