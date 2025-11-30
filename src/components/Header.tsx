import { useLocation } from 'react-router'
import { Bell, User, Settings, ChevronRight } from 'lucide-react'
import { PATH } from '@/constants/path'

const pageTitles: Record<string, string> = {
  [PATH.ROOT]: 'Dashboard',
  [PATH.DEPLOY]: 'Deploy',
  [PATH.FUNCTIONS]: 'Functions',
  [PATH.TIMELINE]: 'Timeline',
  [PATH.FAILURES]: 'Failures',
}

export function Header() {
  const location = useLocation()
  const currentTitle = pageTitles[location.pathname] || 'EventOS'

  return (
    <header
      className="h-14 flex items-center justify-between flex-shrink-0"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        padding: '0 var(--space-24)'
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span style={{ color: 'var(--text-secondary)' }}>Cloud Platform</span>
        <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {currentTitle}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          className="w-9 h-9 flex items-center justify-center transition-colors"
          style={{ 
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center transition-colors"
          style={{ 
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <Settings className="w-5 h-5" />
        </button>

        <div 
          className="h-6 w-px mx-2" 
          style={{ backgroundColor: 'var(--border)' }} 
        />

        <button 
          className="flex items-center gap-2 px-3 py-2 transition-colors"
          style={{ borderRadius: 'var(--radius-sm)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{ 
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <User className="w-4 h-4 text-white" />
          </div>
          <span 
            className="text-sm font-medium" 
            style={{ color: 'var(--text-primary)' }}
          >
            admin
          </span>
        </button>
      </div>
    </header>
  )
}
