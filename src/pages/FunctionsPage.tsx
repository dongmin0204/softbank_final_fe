import { FunctionsList } from '@/components/aws/FunctionsList'
import { mockData } from '@/data/mockData'
import { useNavigate } from 'react-router'
import { PATH } from '@/constants/path'

export function FunctionsPage() {
  const navigate = useNavigate()

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard':
        navigate(PATH.ROOT)
        break
      case 'deploy':
        navigate(PATH.DEPLOY)
        break
      case 'timeline':
        navigate(PATH.TIMELINE)
        break
      default:
        break
    }
  }

  return <FunctionsList onNavigate={handleNavigate} data={mockData} />
}

