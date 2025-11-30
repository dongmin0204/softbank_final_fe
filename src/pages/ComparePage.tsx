import { CompareView } from '@/components/aws/CompareView'
import { useNavigate } from 'react-router'
import { PATH } from '@/constants/path'
import { useExecutionStore } from '@/stores/execution.store'

export function ComparePage() {
  const navigate = useNavigate()
  const compareData = useExecutionStore((state) => state.compareData)

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard':
        navigate(PATH.ROOT)
        break
      case 'timeline':
        navigate(PATH.TIMELINE)
        break
      default:
        break
    }
  }

  if (!compareData) {
    return (
      <div className="p-6">
        <p>No compare data available</p>
      </div>
    )
  }

  return <CompareView onNavigate={handleNavigate} compareData={compareData} />
}

