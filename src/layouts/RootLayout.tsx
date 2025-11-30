import { Outlet } from 'react-router'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

export function RootLayout() {
  return (
    <div 
      className="h-screen flex"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
