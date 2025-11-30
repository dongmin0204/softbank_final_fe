import { DeployFunction } from '@/components/aws/DeployFunction'
import { useNavigate } from 'react-router'
import { PATH } from '@/constants/path'

export function DeployPage() {
  const navigate = useNavigate()

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard':
        navigate(PATH.ROOT)
        break
      case 'functions':
        navigate(PATH.FUNCTIONS)
        break
      default:
        break
    }
  }

  return <DeployFunction onNavigate={handleNavigate} />
}

