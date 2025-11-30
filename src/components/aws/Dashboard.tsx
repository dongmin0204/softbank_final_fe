import { Breadcrumb } from '../ui/breadcrumb';
import { Badge } from '../Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  RotateCcw, 
  GitBranch, 
  ExternalLink,
  Layers,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getExecutionStats, type Execution } from '../../data/mockData';

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
  data: any;
}

export function Dashboard({ onNavigate, data }: DashboardProps) {
  const execStats = getExecutionStats(data.executions as Execution[]);
  
  const todayExecutions = data.executions.filter((e: any) => {
    const today = new Date().toDateString();
    return new Date(e.timestamp).toDateString() === today;
  });

  const stats = [
    { 
      title: 'Total Functions', 
      value: data.functions.length,
      change: '+2',
      trend: 'up',
      color: '#2D6FF3',
      icon: Layers
    },
    { 
      title: "Today's Executions", 
      value: todayExecutions.length,
      change: '+127',
      trend: 'up',
      color: '#2F9B4D',
      icon: CheckCircle
    },
    { 
      title: 'Failures (24h)', 
      value: execStats.failed,
      change: '-3',
      trend: 'down',
      color: '#E03538',
      icon: XCircle
    },
    {
      title: 'Avg Duration',
      value: `${Math.round(data.executions.reduce((acc: number, e: any) => acc + e.duration, 0) / data.executions.length)}ms`,
      change: '-8ms',
      trend: 'down',
      color: '#FFB020',
      icon: Activity
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[{ label: 'EventOS' }, { label: 'Dashboard' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor your serverless functions</p>
        </div>
        
        {/* Grafana Link Button */}
        <a
          href="http://localhost:3001/grafana"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" fill="#F46800"/>
            <path d="M12 6L12 18M6 12L18 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          리소스 사용 상세 보기
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: stat.color + '15' }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Replay/Shadow Stats - NEW */}
      <div className="grid grid-cols-3 gap-5">
        {/* Debug Usage Rate Card */}
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>디버깅 활용률</h3>
            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#E8F0FE', color: '#2D6FF3' }}>
              {execStats.debugRate}%
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${execStats.debugRate}%`, 
                    background: 'linear-gradient(90deg, #2D6FF3, #1F56C3)' 
                  }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
            전체 실행 중 Replay/Shadow 비율
          </p>
        </div>

        {/* Replay Stats Card */}
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F0FE' }}>
              <RotateCcw className="w-5 h-5" style={{ color: '#2D6FF3' }} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2D6FF3' }} />
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2D6FF3', opacity: 0.4 }} />
            </div>
          </div>
          <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {execStats.replay}
            <span className="text-sm font-normal ml-2" style={{ color: 'var(--text-secondary)' }}>
              ({execStats.replayRate}%)
            </span>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Replay Executions</div>
          <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <span className="text-green-600 font-medium">
              {data.executions.filter((e: Execution) => e.type === 'REPLAY' && e.status === 'SUCCESS').length}
            </span>
            {' '}성공 / {' '}
            <span className="text-red-600 font-medium">
              {data.executions.filter((e: Execution) => e.type === 'REPLAY' && e.status === 'FAILED').length}
            </span>
            {' '}실패
          </div>
        </div>

        {/* Shadow Stats Card */}
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F0FE' }}>
              <GitBranch className="w-5 h-5" style={{ color: '#1F56C3' }} />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: '#1F56C3' }} />
            </div>
          </div>
          <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {execStats.shadow}
            <span className="text-sm font-normal ml-2" style={{ color: 'var(--text-secondary)' }}>
              ({execStats.shadowRate}%)
            </span>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Shadow Executions</div>
          <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <span className="text-green-600 font-medium">
              {data.executions.filter((e: Execution) => e.type === 'SHADOW' && e.status === 'SUCCESS').length}
            </span>
            {' '}성공 / {' '}
            <span className="text-red-600 font-medium">
              {data.executions.filter((e: Execution) => e.type === 'SHADOW' && e.status === 'FAILED').length}
            </span>
            {' '}실패
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="executions">
        <TabsList>
          <TabsTrigger value="executions">Recent Executions</TabsTrigger>
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="executions" className="mt-5">
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3>Recent Executions</h3>
              <button 
                onClick={() => onNavigate('timeline')}
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                View all
              </button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Execution ID</TableHead>
                  <TableHead>Function</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Worker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.executions.slice(0, 8).map((exec: any) => (
                  <TableRow
                    key={exec.id}
                    onClick={() => onNavigate('execution', exec)}
                  >
                    <TableCell>
                      <Badge status={exec.status} size="sm" />
                    </TableCell>
                    <TableCell>
                      {exec.type === 'REPLAY' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#E8F0FE', color: '#2D6FF3' }}>
                          <RotateCcw className="w-3 h-3" />
                          Replay
                        </span>
                      )}
                      {exec.type === 'SHADOW' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#E8F0FE', color: '#1F56C3' }}>
                          <GitBranch className="w-3 h-3" />
                          Shadow
                        </span>
                      )}
                      {exec.type === 'NORMAL' && (
                        <span className="text-xs text-gray-400">Normal</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-gray-600">
                      #{exec.id}
                      {exec.parentExecutionId && (
                        <span className="text-xs text-gray-400 ml-1">
                          ← #{exec.parentExecutionId}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium">
                      {exec.function}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {exec.duration}ms
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(exec.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-600 font-mono text-xs">
                      {exec.worker}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="functions" className="mt-5">
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
            <div className="text-gray-600 text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-700 mb-3">Switch to Functions tab to view details</p>
              <button
                onClick={() => onNavigate('functions')}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Go to Functions →
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-5">
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
            <div className="text-gray-600 text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-700">Activity feed coming soon</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
