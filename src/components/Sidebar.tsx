import { NavLink, useLocation } from 'react-router'
import { LayoutDashboard, Code, Clock, AlertCircle, Upload, BarChart3 } from 'lucide-react'
import { PATH } from '@/constants/path'
import { cn } from '@/lib/utils'

const menuItems = [
  { path: PATH.ROOT, label: 'Dashboard', icon: LayoutDashboard },
  { path: PATH.DEPLOY, label: 'Deploy', icon: Upload },
  { path: PATH.FUNCTIONS, label: 'Functions', icon: Code },
  { path: PATH.TIMELINE, label: 'Timeline', icon: Clock },
  { path: PATH.FAILURES, label: 'Failures', icon: AlertCircle },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside
      className="w-64 flex flex-col flex-shrink-0 h-screen"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderRight: '1px solid var(--border)' 
      }}
    >
      {/* Logo */}
      <div
        className="flex-shrink-0"
        style={{ 
          padding: 'var(--space-20)',
          borderBottom: '1px solid var(--border)' 
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{ 
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div 
              className="font-semibold text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              EventOS
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Lite Console
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: 'var(--space-16)' }}>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.path === PATH.ROOT 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path)

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 font-medium text-sm transition-colors'
                )}
                style={{
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div
        className="flex-shrink-0"
        style={{
          padding: 'var(--space-20)',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            EventOS Lite
          </div>
          <div
            className="text-xs px-2 py-0.5"
            style={{
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
            }}
          >
            v1.0.0
          </div>
        </div>
      </div>
    </aside>
  )
}
